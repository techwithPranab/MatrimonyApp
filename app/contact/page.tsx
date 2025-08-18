import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Headphones,
  Building,
  Send,
  CheckCircle
} from "lucide-react";

export default function ContactPage() {
  const contactMethods = [
    {
      title: "Customer Support",
      description: "Get help with your account, billing, or technical issues",
      icon: Headphones,
      contact: "support@matrimonyweb.com",
      availability: "24/7 Available",
      action: "Email Support"
    },
    {
      title: "Sales Inquiries",
      description: "Learn about our premium plans and enterprise solutions",
      icon: Building,
      contact: "+91 1800-123-4567",
      availability: "Mon-Fri 9AM-6PM",
      action: "Call Sales"
    },
    {
      title: "Partnership",
      description: "Explore business partnerships and collaboration opportunities",
      icon: MessageCircle,
      contact: "partnerships@matrimonyweb.com",
      availability: "Response within 24 hours",
      action: "Send Email"
    }
  ];

  const offices = [
    {
      city: "Bangalore",
      address: "WeWork, Prestige Atlanta, 80 Feet Road, Koramangala",
      zipcode: "560034",
      state: "Karnataka",
      phone: "+91 80-4567-8901",
      type: "Headquarters"
    },
    {
      city: "Mumbai",
      address: "Lower Parel, Lodha Excelus, Apollo Mills Compound",
      zipcode: "400013",
      state: "Maharashtra", 
      phone: "+91 22-6789-0123",
      type: "Regional Office"
    },
    {
      city: "Delhi NCR",
      address: "Cyber City, DLF Phase 2, Sector 24",
      zipcode: "122002",
      state: "Haryana",
      phone: "+91 124-456-7890",
      type: "Regional Office"
    }
  ];

  const faqs = [
    {
      question: "How can I delete my account?",
      answer: "You can delete your account by going to Settings > Account Settings > Delete Account. Please note that this action is irreversible."
    },
    {
      question: "How do I report a fake profile?",
      answer: "Click the 'Report' button on any profile page, select the reason, and our team will investigate within 24 hours."
    },
    {
      question: "Can I get a refund for my premium subscription?",
      answer: "Yes, we offer a 7-day money-back guarantee for all premium plans. Contact our support team for assistance."
    },
    {
      question: "How do I change my contact information?",
      answer: "Go to your Profile Settings and update your contact information. You may need to verify new phone numbers or email addresses."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-900">MatrimonyWeb</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/help" className="text-gray-600 hover:text-gray-900">Help</Link>
            <Link href="/careers" className="text-gray-600 hover:text-gray-900">Careers</Link>
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
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
            <MessageCircle className="w-3 h-3 mr-1" />
            Get in Touch
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            We&apos;re Here to{" "}
            <span className="text-blue-500">Help You</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Have questions, need support, or want to share feedback? Our dedicated team is always 
            ready to assist you in your journey to finding love.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Can We Help?</h2>
            <p className="text-lg text-gray-600">Choose the best way to reach us based on your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <Card key={method.title} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-blue-100 to-green-100 w-fit">
                      <IconComponent className="h-8 w-8 text-blue-500" />
                    </div>
                    <CardTitle className="text-xl mb-2">{method.title}</CardTitle>
                    <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="font-semibold text-gray-900 mb-1">{method.contact}</p>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <Clock className="w-3 h-3 mr-1" />
                        {method.availability}
                      </Badge>
                    </div>
                    <Button className="w-full">{method.action}</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>

              <Card>
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <Input id="firstName" placeholder="Enter your first name" />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <Input id="lastName" placeholder="Enter your last name" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input id="phone" type="tel" placeholder="Enter your phone number" />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Input id="subject" placeholder="What is this regarding?" />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea 
                        id="message"
                        placeholder="Tell us how we can help you..."
                        rows={5}
                      />
                    </div>

                    <Button className="w-full" size="lg">
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Answers</h2>
              <p className="text-gray-600 mb-8">
                Find answers to common questions before reaching out.
              </p>

              <div className="space-y-4">
                {faqs.map((faq) => (
                  <Card key={faq.question}>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 text-sm ml-7">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/help">
                    View All FAQs
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Offices</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visit us at our locations across India or connect with our regional teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office) => (
              <Card key={office.city} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{office.city}</CardTitle>
                    <Badge variant="outline" className={
                      office.type === "Headquarters" 
                        ? "text-purple-600 border-purple-200" 
                        : "text-blue-600 border-blue-200"
                    }>
                      {office.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 font-medium">{office.address}</p>
                        <p className="text-gray-600 text-sm">{office.state} {office.zipcode}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <p className="text-gray-900">{office.phone}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <p className="text-gray-900">{office.city.toLowerCase()}@matrimonyweb.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-green-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our customer success team is here to help you succeed in your journey to finding love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Live Chat
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              <Phone className="mr-2 h-5 w-5" />
              Call Support
            </Button>
          </div>
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
                We&apos;re always here to help you find your perfect life partner.
              </p>
              <div className="space-y-2">
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  support@matrimonyweb.com
                </p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +91 1800-123-4567
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety Guidelines</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/success-stories" className="hover:text-white">Success Stories</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Use</Link></li>
                <li><Link href="/safety" className="hover:text-white">Community Guidelines</Link></li>
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
