import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Home, Search, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center space-x-2 mb-8">
          <Heart className="h-8 w-8 text-pink-500" />
          <span className="text-2xl font-bold text-gray-900">MatrimonyWeb</span>
        </Link>

        {/* 404 Content */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12">
            <div className="mb-8">
              <h1 className="text-8xl font-bold text-gray-200 mb-4">404</h1>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Oops! Page Not Found
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                The page you&apos;re looking for seems to have wandered off. 
                Don&apos;t worry, let&apos;s help you find your way back to finding love!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <Button size="lg" asChild>
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Go Home
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/search">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Profiles
                </Link>
              </Button>
            </div>

            {/* Quick Links */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Popular Pages
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Link href="/sign-up" className="text-pink-600 hover:underline">
                  Create Account
                </Link>
                <Link href="/sign-in" className="text-pink-600 hover:underline">
                  Sign In
                </Link>
                <Link href="/pricing" className="text-pink-600 hover:underline">
                  View Pricing
                </Link>
                <Link href="/success-stories" className="text-pink-600 hover:underline">
                  Success Stories
                </Link>
                <Link href="/help" className="text-pink-600 hover:underline">
                  Help Center
                </Link>
                <Link href="/contact" className="text-pink-600 hover:underline">
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <HelpCircle className="h-5 w-5 text-blue-500 mr-2" />
                <span className="font-medium text-blue-900">Need Help?</span>
              </div>
              <p className="text-blue-700 text-sm mb-3">
                If you believe this is an error or you were looking for something specific, 
                our support team is here to help.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
