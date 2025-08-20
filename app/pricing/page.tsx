"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap, Heart } from "lucide-react";

import { useEffect, useState } from "react";

type SubscriptionPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
  icon: keyof typeof iconMap;
};

const iconMap = {
  Heart,
  Star,
  Crown,
};

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch("/api/subscription-plans");
        const data: SubscriptionPlan[] = await res.json();
        setPlans(data);
      } catch {
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-900">MatrimonyWeb</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/success-stories" className="text-gray-600 hover:text-gray-900">Success Stories</Link>
            <Link href="/help" className="text-gray-600 hover:text-gray-900">Help</Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Join Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-pink-100 text-pink-700 hover:bg-pink-100">
            <Zap className="w-3 h-3 mr-1" />
            Special Launch Offer - 50% OFF
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect Match with the{" "}
            <span className="text-pink-500">Right Plan</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the plan that suits your journey to finding love. All plans include our AI-powered matching system.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {loading ? (
              <div className="col-span-3 text-center py-12 text-xl text-gray-500">Loading plans...</div>
            ) : plans.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-xl text-gray-500">No plans available.</div>
            ) : (
              plans.map((plan) => {
                const IconComponent = iconMap[plan.icon] || Heart;
                return (
                  <Card 
                    key={plan.name} 
                    className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                      plan.popular 
                        ? 'border-pink-500 border-2 scale-105' 
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                        Most Popular
                      </div>
                    )}
                    <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-8'}`}>
                      <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-pink-100 to-purple-100">
                        <IconComponent className="h-8 w-8 text-pink-500" />
                      </div>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-600 mt-2">{plan.description}</CardDescription>
                      <div className="mt-6">
                        <div className="flex items-baseline justify-center">
                          <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                          {plan.period !== "forever" && (
                            <span className="text-gray-500 ml-1">/{plan.period}</span>
                          )}
                        </div>
                        {plan.price !== "₹0" && (
                          <p className="text-sm text-gray-500 mt-1">Billed monthly</p>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700' 
                            : ''
                        }`}
                        size="lg"
                        asChild
                      >
                        <Link href="/sign-up">{plan.cta}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change my plan anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a refund policy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">We offer a 7-day money-back guarantee for all premium plans. No questions asked.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">We accept all major credit cards, debit cards, UPI, and net banking.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the success guarantee work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Elite members get 3 months free if they don&apos;t find a suitable match within 6 months.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Soulmate?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy couples who found love with MatrimonyWeb.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/sign-up">Start Your Journey Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-pink-500" />
            <span className="text-xl font-bold text-white">MatrimonyWeb</span>
          </div>
          <p className="text-gray-400 mb-4">
            Find your perfect life partner with India&apos;s most trusted matrimony platform.
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
