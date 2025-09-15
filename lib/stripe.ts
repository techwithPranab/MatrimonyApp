import { loadStripe } from '@stripe/stripe-js';

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  prices: {
    basic: process.env.STRIPE_PRICE_BASIC!,
    premium: process.env.STRIPE_PRICE_PREMIUM!,
    elite: process.env.STRIPE_PRICE_ELITE!,
  },
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
};

// Initialize Stripe
let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};

// Plan configurations for frontend display
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      '5 contact views per month',
      'Basic profile creation',
      'Limited search filters',
      'Email support',
    ],
  },
  basic: {
    name: 'Basic',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    features: [
      '25 contact views per month',
      'Advanced search filters',
      '1 profile boost per month',
      'Priority email support',
    ],
  },
  premium: {
    name: 'Premium',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    features: [
      '100 contact views per month',
      'Unlimited messaging',
      '5 profile boosts per month',
      'Featured placement',
      'Video calling',
      'Phone & email support',
    ],
  },
  elite: {
    name: 'Elite',
    price: 39.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited contact views',
      'Unlimited messaging',
      '20 profile boosts per month',
      'Premium featured placement',
      'Video calling',
      'Priority support',
      'Dedicated account manager',
    ],
  },
};
