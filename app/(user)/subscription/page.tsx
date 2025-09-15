'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, CreditCard, Calendar, AlertCircle, Crown, Zap, Star } from 'lucide-react';
import { PLANS } from '@/lib/stripe';
import { toast } from 'sonner';

interface SubscriptionData {
  plan: 'free' | 'basic' | 'premium' | 'elite';
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  entitlements: {
    contactViewQuota: number;
    contactViewsUsed: number;
    unlimitedChat: boolean;
    profileBoosts: number;
    profileBoostsUsed: number;
    featuredPlacement: boolean;
    advancedFilters: boolean;
    videoCall: boolean;
    prioritySupport: boolean;
  };
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planKey: 'basic' | 'premium' | 'elite') => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env[`NEXT_PUBLIC_STRIPE_PRICE_${planKey.toUpperCase()}`],
          successUrl: `${window.location.origin}/subscription?success=true`,
          cancelUrl: `${window.location.origin}/subscription?canceled=true`,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process');
    } finally {
      setActionLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/subscription/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/subscription`,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error('Failed to create portal session');
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast.error('Failed to open billing portal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.')) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch('/api/subscription', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Subscription cancelled successfully');
        fetchSubscription();
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const currentPlan = subscription ? PLANS[subscription.plan] : PLANS.free;
  const isPaidPlan = subscription?.plan !== 'free';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription & Billing</h1>
        <p className="text-gray-600">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Your current subscription details and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-semibold">{currentPlan.name}</h3>
              <p className="text-gray-600">
                ${currentPlan.price}/{currentPlan.interval}
              </p>
            </div>
            <Badge variant={subscription?.status === 'active' ? 'default' : 'secondary'}>
              {subscription?.status || 'Active'}
            </Badge>
          </div>

          {subscription?.cancelAtPeriodEnd && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Your subscription will be cancelled on {subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'the end of this billing period'}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <h4 className="font-medium">Usage This Month</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Contact Views</span>
                  <span>{subscription?.entitlements.contactViewsUsed || 0} / {subscription?.entitlements.contactViewQuota || 5}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profile Boosts</span>
                  <span>{subscription?.entitlements.profileBoostsUsed || 0} / {subscription?.entitlements.profileBoosts || 0}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Features</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  {subscription?.entitlements.unlimitedChat ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-gray-400" />}
                  <span>Unlimited Chat</span>
                </div>
                <div className="flex items-center gap-2">
                  {subscription?.entitlements.videoCall ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-gray-400" />}
                  <span>Video Calling</span>
                </div>
                <div className="flex items-center gap-2">
                  {subscription?.entitlements.featuredPlacement ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-gray-400" />}
                  <span>Featured Placement</span>
                </div>
              </div>
            </div>
          </div>

          {subscription?.currentPeriodEnd && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {subscription.cancelAtPeriodEnd ? 'Expires' : 'Renews'} on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose the plan that best fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(PLANS).map(([key, plan]) => {
              const isCurrentPlan = subscription?.plan === key;
              const isFree = key === 'free';

              return (
                <Card key={key} className={`relative ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      {key === 'elite' && <Star className="h-5 w-5 text-yellow-500" />}
                      {key === 'premium' && <Zap className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="text-2xl font-bold">
                      ${plan.price}
                      <span className="text-sm font-normal text-gray-600">/{plan.interval}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {isCurrentPlan ? (
                      <Badge variant="secondary" className="w-full justify-center">
                        Current Plan
                      </Badge>
                    ) : !isFree ? (
                      <Button
                        onClick={() => handleUpgrade(key as 'basic' | 'premium' | 'elite')}
                        disabled={actionLoading}
                        className="w-full"
                      >
                        {actionLoading ? 'Processing...' : 'Upgrade'}
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Billing Actions */}
      {isPaidPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing Management
            </CardTitle>
            <CardDescription>
              Manage your payment methods and billing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleManageBilling}
                disabled={actionLoading}
                variant="outline"
              >
                {actionLoading ? 'Loading...' : 'Manage Billing'}
              </Button>

              {!subscription?.cancelAtPeriodEnd && (
                <Button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading}
                  variant="destructive"
                >
                  {actionLoading ? 'Processing...' : 'Cancel Subscription'}
                </Button>
              )}
            </div>

            <Separator className="my-4" />

            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>Need help?</strong> Contact our support team for assistance with your subscription.
              </p>
              <p>
                All subscriptions are billed monthly and can be cancelled at any time.
                You&apos;ll continue to have access to premium features until the end of your billing period.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
