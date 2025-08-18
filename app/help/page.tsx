import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Shield, 
  Users, 
  Star,
  ChevronRight,
  BookOpen,
  Video
} from "lucide-react";

export default function HelpPage() {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: Users,
      faqs: [
        {
          question: "How do I create a profile on MatrimonyWeb?",
          answer: "Creating a profile is simple! Click 'Join Free' on our homepage, provide your basic details, upload a photo, and fill in your preferences. Our guided setup will help you create an attractive profile in under 10 minutes."
        },
        {
          question: "Is it really free to join?",
          answer: "Yes! Creating a profile and basic browsing is completely free. You can view profiles, send limited interests, and use basic search filters without any charges."
        },
        {
          question: "How does the matching system work?",
          answer: "Our AI-powered matching system analyzes your preferences, interests, values, and behavior patterns to suggest highly compatible profiles. The more you use the platform, the better our recommendations become."
        }
      ]
    },
    {
      title: "Profile & Privacy",
      icon: Shield,
      faqs: [
        {
          question: "How do I make my profile more attractive?",
          answer: "Add clear, recent photos, write a compelling bio highlighting your interests and values, complete all sections including family details, and regularly update your profile to keep it fresh."
        },
        {
          question: "Can I control who sees my profile?",
          answer: "Absolutely! You can set privacy controls to hide your profile from certain users, make your photos private, and control who can contact you directly."
        },
        {
          question: "How do you verify profiles?",
          answer: "We have a comprehensive verification process including photo verification, phone number confirmation, and document verification for premium members. Look for the verified badge on profiles."
        }
      ]
    },
    {
      title: "Messaging & Communication",
      icon: MessageCircle,
      faqs: [
        {
          question: "How do I start a conversation?",
          answer: "You can send an interest to show you're interested, and if they accept, you can start chatting. Premium members can send direct messages. Always be respectful and genuine in your first message."
        },
        {
          question: "What should I write in my first message?",
          answer: "Keep it personal and genuine. Mention something specific from their profile that caught your attention. Avoid generic messages and be respectful. A thoughtful first message increases your chances of getting a response."
        },
        {
          question: "Can I video call other members?",
          answer: "Yes! Premium members can schedule video calls through our secure platform. This helps you get to know each other better before meeting in person."
        }
      ]
    },
    {
      title: "Safety & Security",
      icon: Shield,
      faqs: [
        {
          question: "How do you ensure user safety?",
          answer: "We have multiple safety measures including profile verification, photo moderation, 24/7 customer support, and the ability to report suspicious behavior. Never share personal information like phone numbers or addresses in initial conversations."
        },
        {
          question: "What should I do if I encounter fake profiles?",
          answer: "Report any suspicious profiles immediately using the 'Report' button. Our team investigates all reports within 24 hours and takes appropriate action."
        },
        {
          question: "Tips for safe online dating?",
          answer: "Meet in public places, inform friends/family about your meetings, trust your instincts, take time to know the person online first, and never send money or share financial information."
        }
      ]
    }
  ];

  const supportOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      availability: "24/7 Available",
      action: "Start Chat"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our relationship experts",
      icon: Phone,
      availability: "Mon-Fri 9AM-9PM",
      action: "Call Now"
    },
    {
      title: "Email Support",
      description: "Send us your questions and get detailed responses",
      icon: Mail,
      availability: "Response within 4 hours",
      action: "Send Email"
    }
  ];

  const resources = [
    {
      title: "Video Tutorials",
      description: "Step-by-step guides for using MatrimonyWeb",
      icon: Video,
      count: "15+ videos"
    },
    {
      title: "Success Stories",
      description: "Learn from couples who found love here",
      icon: Heart,
      count: "50+ stories"
    },
    {
      title: "Safety Guide",
      description: "Complete guide to safe online dating",
      icon: Shield,
      count: "Essential reading"
    },
    {
      title: "Profile Tips",
      description: "How to create an attractive profile",
      icon: Star,
      count: "Expert advice"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-900">MatrimonyWeb</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/success-stories" className="text-gray-600 hover:text-gray-900">Success Stories</Link>
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
            <HelpCircle className="w-3 h-3 mr-1" />
            Help Center
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            How Can We{" "}
            <span className="text-blue-500">Help You?</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find answers to your questions, get support, and learn how to make the most of your MatrimonyWeb experience.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for help articles, guides, or ask a question..."
                className="pl-10 pr-4 py-3 text-lg"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get Instant Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {supportOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card key={option.title} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 w-fit">
                      <IconComponent className="h-8 w-8 text-blue-500" />
                    </div>
                    <CardTitle className="text-xl">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <Clock className="w-3 h-3 mr-1" />
                        {option.availability}
                      </Badge>
                    </div>
                    <Button className="w-full">
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find quick answers to the most common questions about using MatrimonyWeb.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {faqCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.title} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <IconComponent className="h-6 w-6 text-blue-500" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {category.faqs.map((faq) => (
                      <details key={faq.question} className="group border-b last:border-b-0">
                        <summary className="p-6 cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform" />
                        </summary>
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Helpful Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive guides and resources to make the most of your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource) => {
              const IconComponent = resource.icon;
              return (
                <Card key={resource.title} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 w-fit group-hover:scale-110 transition-transform">
                      <IconComponent className="h-8 w-8 text-pink-500" />
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {resource.count}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Still Need Help?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our relationship experts are here to help you succeed. Contact us for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Live Chat
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              <Link href="/contact" className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
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
              <p className="text-gray-400">
                Your trusted partner in finding the perfect life companion.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Help</h3>
              <ul className="space-y-2">
                <li><Link href="/help-center" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety Tips</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Support</Link></li>
                <li><Link href="/success-stories" className="hover:text-white">Success Stories</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link href="/sign-up" className="hover:text-white">Create Account</Link></li>
                <li><Link href="/sign-in" className="hover:text-white">Sign In</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Upgrade Plan</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Settings</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/contact" className="hover:text-white">Report Abuse</Link></li>
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
