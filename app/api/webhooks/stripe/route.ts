import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import { AuditLog } from '@/models/Moderation';

// Plan type alias
type PlanType = 'free' | 'basic' | 'premium' | 'elite';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

// Webhook secret for signature verification
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
      console.error('No Stripe signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: unknown) {
      console.error(`Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    await connectDB();

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'customer.created':
        await handleCustomerCreated(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    const user = await User.findOne({ stripeCustomerId: customerId });

    if (!user) {
      console.error(`User not found for Stripe customer: ${customerId}`);
      return;
    }

    // Get plan details from subscription
    const priceId = subscription.items.data[0]?.price.id;
    const plan = getPlanFromPriceId(priceId);

    // Create or update subscription
    const subscriptionData = {
      userId: user._id.toString(),
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      plan,
      status: subscription.status === 'active' ? 'active' : 'trialing',
      currentPeriodStart: new Date((subscription as Stripe.Subscription & { current_period_start: number }).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
      entitlements: getEntitlementsForPlan(plan),
      lastPaymentAt: new Date(),
      nextBillingAt: new Date((subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000),
    };

    await Subscription.findOneAndUpdate(
      { userId: user._id.toString() },
      subscriptionData,
      { upsert: true, new: true }
    );

    // Log the event
    await AuditLog.create({
      actorId: user._id.toString(),
      actorType: 'system',
      action: 'subscription_created',
      targetType: 'subscription',
      targetId: subscription.id,
      metadata: { plan, priceId, stripeEvent: 'customer.subscription.created' },
    });

    console.log(`Subscription created for user ${user.email}: ${plan} plan`);

  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const user = await User.findOne({ stripeCustomerId: subscription.customer as string });

    if (!user) {
      console.error(`User not found for subscription: ${subscription.id}`);
      return;
    }

    const priceId = subscription.items.data[0]?.price.id;
    const plan = getPlanFromPriceId(priceId);

    const updateData = {
      stripeSubscriptionId: subscription.id,
      plan,
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date((subscription as Stripe.Subscription & { current_period_start: number }).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
      entitlements: getEntitlementsForPlan(plan),
      nextBillingAt: new Date((subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000),
      updatedAt: new Date(),
    };

    await Subscription.findOneAndUpdate(
      { userId: user._id.toString() },
      updateData
    );

    // Log the event
    await AuditLog.create({
      actorId: user._id.toString(),
      actorType: 'system',
      action: 'subscription_updated',
      targetType: 'subscription',
      targetId: subscription.id,
      metadata: { plan, status: subscription.status, stripeEvent: 'customer.subscription.updated' },
    });

    console.log(`Subscription updated for user ${user.email}: ${plan} plan, status: ${subscription.status}`);

  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const user = await User.findOne({ stripeCustomerId: subscription.customer as string });

    if (!user) {
      console.error(`User not found for subscription: ${subscription.id}`);
      return;
    }

    // Downgrade to free plan
    await Subscription.findOneAndUpdate(
      { userId: user._id.toString() },
      {
        plan: 'free',
        status: 'inactive',
        entitlements: getEntitlementsForPlan('free'),
        updatedAt: new Date(),
      }
    );

    // Log the event
    await AuditLog.create({
      actorId: user._id.toString(),
      actorType: 'system',
      action: 'subscription_cancelled',
      targetType: 'subscription',
      targetId: subscription.id,
      metadata: { stripeEvent: 'customer.subscription.deleted' },
    });

    console.log(`Subscription cancelled for user ${user.email}`);

  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

// Handle successful payment
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    if (!invoice.customer) return;

    const user = await User.findOne({ stripeCustomerId: invoice.customer as string });

    if (!user) {
      console.error(`User not found for invoice: ${invoice.id}`);
      return;
    }

    // Update subscription with payment info
    await Subscription.findOneAndUpdate(
      { userId: user._id.toString() },
      {
        lastPaymentAt: new Date(),
        status: 'active',
      }
    );

    // Log the event
    await AuditLog.create({
      actorId: user._id.toString(),
      actorType: 'system',
      action: 'payment_succeeded',
      targetType: 'subscription',
      targetId: invoice.id,
      metadata: {
        amount: invoice.amount_paid,
        currency: invoice.currency,
        invoiceId: invoice.id,
        stripeEvent: 'invoice.payment_succeeded'
      },
    });

    console.log(`Payment succeeded for user ${user.email}: ${invoice.amount_paid} ${invoice.currency}`);

  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    if (!invoice.customer) return;

    const user = await User.findOne({ stripeCustomerId: invoice.customer as string });

    if (!user) {
      console.error(`User not found for invoice: ${invoice.id}`);
      return;
    }

    // Update subscription status
    await Subscription.findOneAndUpdate(
      { userId: user._id.toString() },
      {
        status: 'past_due',
      }
    );

    // Log the event
    await AuditLog.create({
      actorId: user._id.toString(),
      actorType: 'system',
      action: 'payment_failed',
      targetType: 'subscription',
      targetId: invoice.id,
      metadata: {
        amount: invoice.amount_due,
        currency: invoice.currency,
        invoiceId: invoice.id,
        attemptCount: invoice.attempt_count,
        stripeEvent: 'invoice.payment_failed'
      },
    });

    console.log(`Payment failed for user ${user.email}: ${invoice.amount_due} ${invoice.currency}`);

  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

// Handle customer creation
async function handleCustomerCreated(customer: Stripe.Customer) {
  try {
    // This is mainly for logging purposes
    console.log(`Stripe customer created: ${customer.id}, email: ${customer.email}`);

    // You might want to update user with stripeCustomerId here if not already done
    // This would typically happen during subscription creation flow

  } catch (error) {
    console.error('Error handling customer created:', error);
  }
}

// Helper functions
function getPlanFromPriceId(priceId: string | undefined): PlanType {
  // Map your Stripe price IDs to plan names
  // You'll need to configure these in your Stripe dashboard and update these mappings
  const priceMappings: Record<string, PlanType> = {
    [process.env.STRIPE_PRICE_BASIC || '']: 'basic',
    [process.env.STRIPE_PRICE_PREMIUM || '']: 'premium',
    [process.env.STRIPE_PRICE_ELITE || '']: 'elite',
  };

  return priceMappings[priceId || ''] || 'free';
}

function getEntitlementsForPlan(plan: PlanType) {
  const entitlements = {
    free: {
      contactViewQuota: 5,
      contactViewsUsed: 0,
      unlimitedChat: false,
      profileBoosts: 0,
      profileBoostsUsed: 0,
      featuredPlacement: false,
      advancedFilters: false,
      videoCall: false,
      prioritySupport: false,
    },
    basic: {
      contactViewQuota: 25,
      contactViewsUsed: 0,
      unlimitedChat: false,
      profileBoosts: 1,
      profileBoostsUsed: 0,
      featuredPlacement: false,
      advancedFilters: true,
      videoCall: false,
      prioritySupport: false,
    },
    premium: {
      contactViewQuota: 100,
      contactViewsUsed: 0,
      unlimitedChat: true,
      profileBoosts: 5,
      profileBoostsUsed: 0,
      featuredPlacement: true,
      advancedFilters: true,
      videoCall: true,
      prioritySupport: false,
    },
    elite: {
      contactViewQuota: 999,
      contactViewsUsed: 0,
      unlimitedChat: true,
      profileBoosts: 20,
      profileBoostsUsed: 0,
      featuredPlacement: true,
      advancedFilters: true,
      videoCall: true,
      prioritySupport: true,
    },
  };

  return entitlements[plan];
}

function mapStripeStatus(status: Stripe.Subscription.Status): 'active' | 'inactive' | 'canceled' | 'past_due' | 'trialing' {
  switch (status) {
    case 'active':
      return 'active';
    case 'canceled':
      return 'canceled';
    case 'incomplete':
    case 'incomplete_expired':
    case 'past_due':
      return 'past_due';
    case 'trialing':
      return 'trialing';
    case 'unpaid':
      return 'inactive';
    default:
      return 'inactive';
  }
}
