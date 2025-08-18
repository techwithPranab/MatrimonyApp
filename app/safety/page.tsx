import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Phone, 
  MessageCircle,
  UserCheck,
  Flag,
  Camera,
  CreditCard,
  Users,
  CheckCircle
} from "lucide-react";

export default function SafetyPage() {
  const safetyTips = [
    {
      category: "Online Safety",
      icon: Shield,
      tips: [
        "Never share personal information like phone number, address, or financial details in initial conversations",
        "Be cautious of profiles that seem too good to be true or have very few photos",
        "Trust your instincts - if something feels wrong, it probably is",
        "Report suspicious behavior immediately using our report feature",
        "Keep conversations on our platform until you're comfortable meeting"
      ]
    },
    {
      category: "Meeting Safely",
      icon: Users,
      tips: [
        "Always meet in public places for first dates - restaurants, cafes, or public parks",
        "Inform friends or family about your meeting plans and location",
        "Arrange your own transportation to and from the meeting place",
        "Video chat before meeting in person to verify identity",
        "Stay sober and alert during your first few meetings"
      ]
    },
    {
      category: "Photo & Profile Safety",
      icon: Camera,
      tips: [
        "Use recent, authentic photos that clearly show your face",
        "Avoid sharing photos that reveal personal information like addresses or workplace",
        "Be honest in your profile description and avoid exaggerating",
        "Don't include contact information in your photos or bio",
        "Report fake or inappropriate profiles you encounter"
      ]
    },
    {
      category: "Financial Security",
      icon: CreditCard,
      tips: [
        "Never send money, gifts, or financial assistance to someone you haven't met",
        "Be wary of urgent requests for financial help or sob stories",
        "Don't share banking details, credit card information, or passwords",
        "Be suspicious of profiles asking about your financial status early on",
        "Report any requests for money or financial information immediately"
      ]
    }
  ];

  const redFlags = [
    {
      title: "Fake Profiles",
      description: "Professional-looking photos, limited profile information, or reluctance to video chat",
      icon: Eye,
      action: "Request verification or report suspicious profiles"
    },
    {
      title: "Romance Scams",
      description: "Professions of love very quickly, requests for money, or urgent financial situations",
      icon: AlertTriangle,
      action: "Never send money and report immediately"
    },
    {
      title: "Inappropriate Content",
      description: "Sexual content, harassment, or requests for intimate photos",
      icon: Flag,
      action: "Block the user and report to our safety team"
    },
    {
      title: "Identity Theft",
      description: "Requests for personal documents, SSN, or other sensitive information",
      icon: Lock,
      action: "Never share documents and report the profile"
    }
  ];

  const safetyFeatures = [
    {
      title: "Profile Verification",
      description: "We verify profiles through phone numbers, email, and photo verification",
      icon: UserCheck
    },
    {
      title: "24/7 Monitoring",
      description: "Our AI and human moderators monitor the platform around the clock",
      icon: Eye
    },
    {
      title: "Instant Reporting",
      description: "Easy-to-use reporting tools to flag suspicious behavior immediately",
      icon: Flag
    },
    {
      title: "Privacy Controls",
      description: "Advanced privacy settings to control who can see your profile and contact you",
      icon: Shield
    },
    {
      title: "Secure Messaging",
      description: "All messages are encrypted and monitored for inappropriate content",
      icon: MessageCircle
    },
    {
      title: "Background Checks",
      description: "Premium members can request background verification for added security",
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-900">MatrimonyWeb</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/help" className="text-gray-600 hover:text-gray-900">Help</Link>
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
          <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-100">
            <Shield className="w-3 h-3 mr-1" />
            Safety Center
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Safety is{" "}
            <span className="text-red-500">Our Priority</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We&apos;re committed to creating a safe, secure environment for finding love. Learn about our safety features, 
            get tips for safe online dating, and know how to report suspicious behavior.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="#safety-tips">Learn Safety Tips</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#report">Report an Issue</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How We Keep You Safe</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive safety measures work 24/7 to protect our community and ensure authentic connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safetyFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.title} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-red-100 to-orange-100 w-fit">
                      <IconComponent className="h-8 w-8 text-red-500" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section id="safety-tips" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Essential Safety Tips</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these guidelines to ensure a safe and positive experience while looking for your perfect match.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {safetyTips.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.category} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <IconComponent className="h-6 w-6 text-red-500" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {category.tips.map((tip) => (
                        <li key={tip.substring(0, 20)} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Red Flags */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Warning Signs & Red Flags</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn to identify suspicious behavior and protect yourself from potential scams or harmful users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {redFlags.map((flag) => {
              const IconComponent = flag.icon;
              return (
                <Card key={flag.title} className="border-l-4 border-red-500 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-red-100">
                        <IconComponent className="h-6 w-6 text-red-500" />
                      </div>
                      <CardTitle className="text-xl text-red-600">{flag.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{flag.description}</p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 font-medium text-sm">
                        <strong>What to do:</strong> {flag.action}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-red-100 w-fit">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-red-600">Emergency Situations</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-700 leading-relaxed">
                If you feel you are in immediate danger or have encountered criminal activity, 
                contact local emergency services immediately.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="font-semibold text-gray-900">Emergency Services</p>
                  <p className="text-red-600 text-xl font-bold">100 / 112</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">Women Helpline</p>
                  <p className="text-red-600 text-xl font-bold">1091</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">Cyber Crime</p>
                  <p className="text-red-600 text-xl font-bold">1930</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Reporting Section */}
      <section id="report" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Report Suspicious Activity</h2>
            <p className="text-xl text-gray-600">
              Help us maintain a safe community by reporting inappropriate behavior or suspicious profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Flag className="h-5 w-5 mr-2 text-red-500" />
                  How to Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">1</div>
                    <p className="text-gray-700 text-sm">Click the &quot;Report&quot; button on any profile or message</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">2</div>
                    <p className="text-gray-700 text-sm">Select the reason for reporting from the dropdown menu</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">3</div>
                    <p className="text-gray-700 text-sm">Provide additional details about the incident</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">4</div>
                    <p className="text-gray-700 text-sm">Submit the report - our team will investigate within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Contact Safety Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-sm mb-4">
                  For urgent safety concerns or detailed reports, contact our safety team directly:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">Safety Hotline</p>
                      <p className="text-gray-600 text-sm">+91 1800-SAFETY (24/7)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-gray-600 text-sm">safety@matrimonyweb.com</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  Contact Safety Team
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Additional Resources</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn more about online safety and get support from trusted organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">National Cyber Security</h3>
                <p className="text-gray-600 text-sm mb-4">Government resources for cyber safety and fraud prevention</p>
                <Button variant="outline" size="sm">Visit Website</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Women Safety Helpline</h3>
                <p className="text-gray-600 text-sm mb-4">24/7 support for women facing harassment or abuse</p>
                <Button variant="outline" size="sm">Get Help</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Mental Health Support</h3>
                <p className="text-gray-600 text-sm mb-4">Professional counseling for relationship and dating concerns</p>
                <Button variant="outline" size="sm">Find Support</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-500 to-orange-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stay Safe, Find Love
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            With our safety measures and your awareness, you can confidently look for your perfect match.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/sign-up">
              <Shield className="mr-2 h-5 w-5" />
              Join Safely Today
            </Link>
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
              <p className="text-gray-400 mb-4">
                Your safety is our top priority in helping you find love.
              </p>
              <div className="space-y-2">
                <p className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Safety Hotline: +91 1800-SAFETY
                </p>
                <p className="flex items-center text-sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  safety@matrimonyweb.com
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Safety Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/safety" className="hover:text-white">Safety Guidelines</Link></li>
                <li><Link href="/help" className="hover:text-white">Report a User</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Safety Team</Link></li>
                <li><Link href="/terms" className="hover:text-white">Community Rules</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Emergency Contacts</h3>
              <ul className="space-y-2">
                <li className="text-sm">Emergency Services: 100 / 112</li>
                <li className="text-sm">Women Helpline: 1091</li>
                <li className="text-sm">Cyber Crime: 1930</li>
                <li className="text-sm">Child Helpline: 1098</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 MatrimonyWeb. All rights reserved. | Safe. Secure. Trusted.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
