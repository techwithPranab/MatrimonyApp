import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Eye, Lock, Database, Calendar, AlertCircle } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-900">MatrimonyWeb</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link>
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
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            <Shield className="w-3 h-3 mr-1" />
            Privacy Policy
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Privacy is{" "}
            <span className="text-green-500">Our Priority</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We are committed to protecting your personal information and being transparent about how we collect, 
            use, and share your data. This policy explains our privacy practices in detail.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Last updated: January 15, 2024
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              GDPR Compliant
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Highlights */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy at a Glance</h2>
            <p className="text-lg text-gray-600">Key points about how we protect your privacy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-green-100 to-blue-100 w-fit">
                  <Lock className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle>Data Encryption</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">All your personal data is encrypted using industry-standard 256-bit SSL encryption both in transit and at rest.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 w-fit">
                  <Eye className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle>Privacy Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">You have complete control over your privacy settings and can choose what information to share and with whom.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 w-fit">
                  <Database className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle>Data Minimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">We only collect data that is necessary for providing our services and delete it when no longer needed.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy Policy Sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="#information-collection" className="text-green-600 hover:underline text-sm">Information Collection</Link>
                <Link href="#data-usage" className="text-green-600 hover:underline text-sm">How We Use Data</Link>
                <Link href="#data-sharing" className="text-green-600 hover:underline text-sm">Data Sharing</Link>
                <Link href="#your-rights" className="text-green-600 hover:underline text-sm">Your Rights</Link>
                <Link href="#data-security" className="text-green-600 hover:underline text-sm">Data Security</Link>
                <Link href="#cookies" className="text-green-600 hover:underline text-sm">Cookies</Link>
                <Link href="#data-retention" className="text-green-600 hover:underline text-sm">Data Retention</Link>
                <Link href="#contact-privacy" className="text-green-600 hover:underline text-sm">Contact Us</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            {/* Section 1 */}
            <Card id="information-collection" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">1.1 Information You Provide</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you create an account, we collect information such as:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Personal details (name, age, gender, location)</li>
                  <li>Contact information (email, phone number)</li>
                  <li>Profile information (photos, bio, preferences)</li>
                  <li>Family and educational background</li>
                  <li>Professional information</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">1.2 Automatically Collected Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  We automatically collect certain information when you use our service:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages viewed, time spent, features used)</li>
                  <li>Location data (with your permission)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card id="data-usage" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We use your information for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Service Provision:</strong> To provide and maintain our matchmaking services</li>
                  <li><strong>Matching:</strong> To suggest compatible profiles using our AI algorithms</li>
                  <li><strong>Communication:</strong> To facilitate communication between members</li>
                  <li><strong>Safety:</strong> To verify identities and maintain platform safety</li>
                  <li><strong>Improvement:</strong> To analyze and improve our services</li>
                  <li><strong>Customer Support:</strong> To provide customer service and support</li>
                  <li><strong>Marketing:</strong> To send relevant updates and promotional content (with consent)</li>
                  <li><strong>Legal Compliance:</strong> To comply with legal obligations</li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <p className="text-blue-800 text-sm">
                      <strong>Legal Basis:</strong> We process your data based on consent, legitimate interests, 
                      contractual necessity, and legal compliance as required by applicable privacy laws.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card id="data-sharing" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">3. How We Share Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">3.1 With Other Users</h3>
                <p className="text-gray-700 leading-relaxed">
                  Based on your privacy settings, we share profile information with other users for matchmaking purposes. 
                  You control what information is visible to others.
                </p>

                <h3 className="text-lg font-semibold text-gray-900">3.2 With Service Providers</h3>
                <p className="text-gray-700 leading-relaxed">
                  We share data with trusted third-party service providers who help us operate our platform, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Cloud hosting providers (AWS, Google Cloud)</li>
                  <li>Payment processors (Stripe, Razorpay)</li>
                  <li>Email service providers (SendGrid)</li>
                  <li>Analytics providers (Google Analytics)</li>
                  <li>Customer support tools (Zendesk)</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">3.3 Legal Requirements</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may disclose your information when required by law, to protect our rights, or to ensure user safety.
                </p>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card id="your-rights" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">4. Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  You have the following rights regarding your personal data:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Portability:</strong> Export your data in a common format</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                  <li><strong>Objection:</strong> Object to certain data processing activities</li>
                  <li><strong>Withdraw Consent:</strong> Revoke previously given consent</li>
                </ul>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>How to Exercise Your Rights:</strong> Contact us at privacy@matrimonyweb.com or 
                    use the privacy controls in your account settings. We will respond within 30 days.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card id="data-security" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">5. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We implement comprehensive security measures to protect your data:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Encryption:</strong> 256-bit SSL encryption for data in transit and at rest</li>
                  <li><strong>Access Controls:</strong> Strict access controls and authentication</li>
                  <li><strong>Regular Audits:</strong> Security audits and vulnerability assessments</li>
                  <li><strong>Employee Training:</strong> Regular privacy and security training for staff</li>
                  <li><strong>Incident Response:</strong> Comprehensive breach response procedures</li>
                  <li><strong>Infrastructure:</strong> Secure cloud infrastructure with industry leaders</li>
                </ul>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                    <p className="text-amber-800 text-sm">
                      <strong>Security Reminder:</strong> While we implement strong security measures, please use 
                      strong passwords and never share your login credentials with others.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card id="cookies" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">6. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze site usage and performance</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Deliver targeted advertising (with consent)</li>
                </ul>

                <p className="text-gray-700 leading-relaxed">
                  You can control cookies through your browser settings or our cookie preference center. 
                  Note that disabling certain cookies may affect site functionality.
                </p>
              </CardContent>
            </Card>

            {/* Section 7 */}
            <Card id="data-retention" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">7. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We retain your data for as long as necessary to provide our services and comply with legal obligations:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Active Accounts:</strong> Data retained while account is active</li>
                  <li><strong>Inactive Accounts:</strong> Deleted after 2 years of inactivity</li>
                  <li><strong>Communication Records:</strong> Retained for safety and legal compliance</li>
                  <li><strong>Payment Data:</strong> Retained as required by financial regulations</li>
                  <li><strong>Legal Hold:</strong> Data may be retained longer if required by law</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 8 */}
            <Card id="contact-privacy" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">8. Contact Our Privacy Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  If you have questions about this privacy policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700"><strong>Privacy Officer:</strong> privacy@matrimonyweb.com</p>
                  <p className="text-gray-700"><strong>Phone:</strong> +91 1800-123-4567</p>
                  <p className="text-gray-700"><strong>Address:</strong> Privacy Team, MatrimonyWeb Pvt Ltd</p>
                  <p className="text-gray-700">WeWork, Prestige Atlanta, Koramangala, Bangalore 560034</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>EU Residents:</strong> You have the right to lodge a complaint with your local 
                    data protection authority if you believe we have not addressed your privacy concerns adequately.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500 to-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Privacy Questions?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Our privacy team is here to help you understand and control your data.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">Contact Privacy Team</Link>
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
                Your privacy is our priority in helping you find love.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Privacy</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Your Rights</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="hover:text-white">Data Access Request</Link></li>
                <li><Link href="/contact" className="hover:text-white">Delete My Data</Link></li>
                <li><Link href="/contact" className="hover:text-white">Privacy Concerns</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 MatrimonyWeb. All rights reserved. | Privacy-first matchmaking.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
