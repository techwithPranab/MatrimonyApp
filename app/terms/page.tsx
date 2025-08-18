import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, FileText, Calendar, Shield, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-900">MatrimonyWeb</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
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
          <Badge className="mb-4 bg-slate-100 text-slate-700 hover:bg-slate-100">
            <FileText className="w-3 h-3 mr-1" />
            Legal Document
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Terms of{" "}
            <span className="text-blue-500">Service</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our service. 
            By accessing MatrimonyWeb, you agree to be bound by these terms.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Last updated: January 15, 2024
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Version 2.1
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Quick Navigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="#acceptance" className="text-blue-600 hover:underline text-sm">1. Acceptance</Link>
                <Link href="#eligibility" className="text-blue-600 hover:underline text-sm">2. Eligibility</Link>
                <Link href="#user-accounts" className="text-blue-600 hover:underline text-sm">3. User Accounts</Link>
                <Link href="#user-conduct" className="text-blue-600 hover:underline text-sm">4. User Conduct</Link>
                <Link href="#content" className="text-blue-600 hover:underline text-sm">5. Content Policy</Link>
                <Link href="#privacy" className="text-blue-600 hover:underline text-sm">6. Privacy</Link>
                <Link href="#payments" className="text-blue-600 hover:underline text-sm">7. Payments</Link>
                <Link href="#termination" className="text-blue-600 hover:underline text-sm">8. Termination</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            {/* Section 1 */}
            <Card id="acceptance" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using MatrimonyWeb (&quot;the Service&quot;), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  These Terms of Service constitute a legally binding agreement between you and MatrimonyWeb Private Limited 
                  (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) regarding your use of our platform and services.
                </p>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card id="eligibility" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">2. Eligibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  To use our service, you must:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Be at least 18 years of age</li>
                  <li>Have the legal capacity to enter into binding contracts</li>
                  <li>Not be legally prohibited from using our services</li>
                  <li>Provide accurate and truthful information</li>
                  <li>Not have been previously banned from our platform</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                    <p className="text-amber-800 text-sm">
                      <strong>Important:</strong> Misrepresenting your age or providing false information is strictly prohibited 
                      and may result in immediate account termination.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card id="user-accounts" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">3. User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">3.1 Account Registration</h3>
                <p className="text-gray-700 leading-relaxed">
                  You must register for an account to use certain features of our service. You agree to provide accurate, 
                  current, and complete information during registration and to update such information to keep it accurate, 
                  current, and complete.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900">3.2 Account Security</h3>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities 
                  that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>

                <h3 className="text-lg font-semibold text-gray-900">3.3 Account Verification</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may require verification of your identity through various means including phone number verification, 
                  email verification, and document verification for premium members.
                </p>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card id="user-conduct" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">4. User Conduct</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  You agree not to use the service to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Harass, threaten, or intimidate other users</li>
                  <li>Send spam or unsolicited commercial messages</li>
                  <li>Upload inappropriate or offensive content</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Impersonate another person or entity</li>
                  <li>Collect personal information from other users</li>
                  <li>Use automated systems or bots</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card id="content" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">5. Content Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">5.1 User Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  You retain ownership of the content you post, but grant us a license to use, display, and distribute 
                  your content on our platform. You are solely responsible for your content and the consequences of posting it.
                </p>

                <h3 className="text-lg font-semibold text-gray-900">5.2 Content Moderation</h3>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to monitor, review, and remove content that violates our community guidelines or 
                  these terms of service without prior notice.
                </p>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card id="privacy" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">6. Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
                  to understand our practices regarding your personal information.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    Our Privacy Policy is available at{" "}
                    <Link href="/privacy" className="underline font-medium">
                      matrimonyweb.com/privacy
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 7 */}
            <Card id="payments" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">7. Payments and Subscriptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">7.1 Premium Services</h3>
                <p className="text-gray-700 leading-relaxed">
                  Some features require payment. All fees are non-refundable except as expressly stated in our refund policy 
                  or as required by law.
                </p>

                <h3 className="text-lg font-semibold text-gray-900">7.2 Auto-Renewal</h3>
                <p className="text-gray-700 leading-relaxed">
                  Subscriptions automatically renew unless cancelled before the renewal date. You can cancel anytime 
                  through your account settings.
                </p>

                <h3 className="text-lg font-semibold text-gray-900">7.3 Refund Policy</h3>
                <p className="text-gray-700 leading-relaxed">
                  We offer a 7-day money-back guarantee for premium subscriptions. Refund requests must be submitted 
                  within 7 days of purchase.
                </p>
              </CardContent>
            </Card>

            {/* Section 8 */}
            <Card id="termination" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">8. Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Either party may terminate this agreement at any time. We may suspend or terminate your account if you 
                  violate these terms. Upon termination, your right to use the service ceases immediately.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to delete your account and all associated data after termination, subject to 
                  applicable legal requirements.
                </p>
              </CardContent>
            </Card>

            {/* Additional Sections */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">9. Disclaimer of Warranties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  The service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the service 
                  will be uninterrupted, secure, or error-free.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">10. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Our liability is limited to the maximum extent permitted by law. We are not liable for indirect, 
                  incidental, or consequential damages arising from your use of the service.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">11. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  We may modify these terms at any time. We will notify users of significant changes via email or 
                  platform notification. Continued use after changes constitutes acceptance of the new terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">12. Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700"><strong>Email:</strong> legal@matrimonyweb.com</p>
                  <p className="text-gray-700"><strong>Phone:</strong> +91 1800-123-4567</p>
                  <p className="text-gray-700"><strong>Address:</strong> WeWork, Prestige Atlanta, Koramangala, Bangalore 560034</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-600 to-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Questions About Our Terms?
          </h2>
          <p className="text-xl text-slate-100 mb-8 max-w-2xl mx-auto">
            Our legal team is here to help clarify any questions you may have about our terms of service.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">Contact Legal Team</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-pink-500" />
                <span className="text-xl font-bold text-white">MatrimonyWeb</span>
              </div>
              <p className="text-gray-400">
                Connecting hearts with trust and transparency.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety Guidelines</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/safety" className="hover:text-white">Report Issue</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/success-stories" className="hover:text-white">Success Stories</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 MatrimonyWeb. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
