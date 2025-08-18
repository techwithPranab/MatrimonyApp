import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  Award, 
  Globe, 
  Shield, 
  Zap, 
  Target, 
  Eye, 
  Star,
  MapPin,
  Calendar,
  Trophy
} from "lucide-react";

export default function AboutUsPage() {
  const stats = [
    { number: "10M+", label: "Active Users", icon: Users },
    { number: "5L+", label: "Success Stories", icon: Heart },
    { number: "50+", label: "Cities", icon: MapPin },
    { number: "4+", label: "Years of Excellence", icon: Calendar }
  ];

  const values = [
    {
      title: "Trust & Authenticity",
      description: "We verify every profile to ensure genuine connections and maintain the highest standards of authenticity.",
      icon: Shield
    },
    {
      title: "Privacy & Security",
      description: "Your personal information is protected with bank-level security. You control who sees your profile and when.",
      icon: Eye
    },
    {
      title: "Innovation",
      description: "Our AI-powered matching system continuously learns and improves to find you the most compatible matches.",
      icon: Zap
    },
    {
      title: "Inclusivity",
      description: "We celebrate diversity and welcome people from all communities, backgrounds, and walks of life.",
      icon: Globe
    }
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "CEO & Founder",
      experience: "15+ years in Technology",
      image: "/api/placeholder/150/150",
      bio: "Former tech executive turned entrepreneur with a passion for bringing people together through technology."
    },
    {
      name: "Rajesh Kumar",
      role: "CTO",
      experience: "12+ years in AI/ML",
      image: "/api/placeholder/150/150",
      bio: "AI expert who developed our revolutionary matching algorithm that has connected millions of hearts."
    },
    {
      name: "Anjali Patel",
      role: "Head of Customer Success",
      experience: "10+ years in Customer Experience",
      image: "/api/placeholder/150/150",
      bio: "Relationship expert dedicated to ensuring every member finds their perfect match and achieves happiness."
    },
    {
      name: "Vikram Singh",
      role: "Head of Safety & Security",
      experience: "8+ years in Cybersecurity",
      image: "/api/placeholder/150/150",
      bio: "Security specialist ensuring our platform remains safe and trustworthy for all members."
    }
  ];

  const achievements = [
    {
      title: "Best Matrimony Platform 2023",
      organization: "Digital India Awards",
      icon: Trophy
    },
    {
      title: "Most Trusted Dating App",
      organization: "User Choice Awards 2023",
      icon: Star
    },
    {
      title: "Excellence in AI Innovation",
      organization: "Tech Innovation Summit 2023",
      icon: Award
    },
    {
      title: "Top 50 Startups in India",
      organization: "Forbes India 2022",
      icon: Target
    }
  ];

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
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
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
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Heart className="w-3 h-3 mr-1" />
            Our Story
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connecting Hearts,{" "}
            <span className="text-pink-500">Creating Families</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Founded in 2020, MatrimonyWeb has revolutionized how people find their life partners. 
            We combine traditional matchmaking wisdom with cutting-edge AI technology to create 
            meaningful, lasting relationships.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 w-fit">
                    <IconComponent className="h-8 w-8 text-pink-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600">
              From a simple idea to India&apos;s most trusted matrimony platform
            </p>
          </div>

          <div className="space-y-12">
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge className="mb-4 bg-pink-100 text-pink-700">2020</Badge>
                    <h3 className="text-2xl font-bold mb-4">The Beginning</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Started by a team of relationship experts and technologists who believed that 
                      finding love shouldn&apos;t be left to chance. We set out to create a platform that 
                      would understand compatibility beyond just basic preferences.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg p-8 flex items-center justify-center">
                    <Heart className="h-24 w-24 text-pink-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg p-8 flex items-center justify-center md:order-1">
                    <Zap className="h-24 w-24 text-blue-500" />
                  </div>
                  <div className="md:order-2">
                    <Badge className="mb-4 bg-blue-100 text-blue-700">2022</Badge>
                    <h3 className="text-2xl font-bold mb-4">AI Revolution</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Launched our groundbreaking AI matching system that analyzes over 150 compatibility 
                      factors. This innovation increased successful matches by 300% and became the gold 
                      standard in the industry.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge className="mb-4 bg-green-100 text-green-700">2024</Badge>
                    <h3 className="text-2xl font-bold mb-4">Leading the Future</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Today, we&apos;re India&apos;s most trusted matrimony platform with over 10 million users 
                      and 500,000+ success stories. We continue to innovate with features like video 
                      calling, virtual events, and enhanced safety measures.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-200 to-blue-200 rounded-lg p-8 flex items-center justify-center">
                    <Trophy className="h-24 w-24 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape the experience we create for our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const IconComponent = value.icon;
              return (
                <Card key={value.title} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 w-fit">
                      <IconComponent className="h-8 w-8 text-blue-500" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Leadership</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate leaders dedicated to helping millions find their perfect life partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <Card key={member.name} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                    <Users className="h-12 w-12 text-pink-500" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="font-semibold text-blue-600">{member.role}</CardDescription>
                  <Badge variant="outline" className="mx-auto w-fit">
                    {member.experience}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Awards & Recognition</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Industry recognition for our innovation, trust, and excellence in bringing people together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={achievement.title} className="bg-white/10 backdrop-blur-sm border-white/20 text-white text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-4 rounded-full bg-white/20 w-fit">
                      <IconComponent className="h-8 w-8 text-yellow-300" />
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription className="text-blue-100">{achievement.organization}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="border-2 border-pink-200">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 w-fit">
                  <Target className="h-12 w-12 text-pink-500" />
                </div>
                <CardTitle className="text-2xl text-pink-600">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed text-center">
                  To create a world where finding your life partner is joyful, safe, and successful. 
                  We leverage technology and human insight to make meaningful connections that lead 
                  to lifelong happiness.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 w-fit">
                  <Eye className="h-12 w-12 text-blue-500" />
                </div>
                <CardTitle className="text-2xl text-blue-600">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed text-center">
                  To be the global leader in relationship technology, helping 100 million people 
                  find their perfect match by 2030. We envision a future where true love is just 
                  a click away.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Be Part of Our Story?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Join millions of happy members who found their perfect match with MatrimonyWeb.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/sign-up">
              <Heart className="mr-2 h-5 w-5" />
              Start Your Journey
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
              <p className="text-gray-400">
                Connecting hearts and creating families since 2020.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/success-stories" className="hover:text-white">Success Stories</Link></li>
              </ul>
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
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="hover:text-white">Premium Plans</Link></li>
                <li><Link href="/mobile" className="hover:text-white">Mobile App</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 MatrimonyWeb. All rights reserved. Made with ❤️ in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
