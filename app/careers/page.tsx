import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  MapPin, 
  Clock, 
  Briefcase, 
  DollarSign, 
  Star, 
  Zap,
  Globe,
  Shield,
  Laptop,
  Coffee,
  Gift,
  GraduationCap
} from "lucide-react";

export default function CareersPage() {
  const benefits = [
    {
      title: "Flexible Work Options",
      description: "Work from home, office, or anywhere in the world",
      icon: Globe
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs",
      icon: Shield
    },
    {
      title: "Learning & Development",
      description: "Annual learning budget and skill development programs",
      icon: GraduationCap
    },
    {
      title: "Modern Equipment",
      description: "Latest MacBooks, monitors, and ergonomic workspace setup",
      icon: Laptop
    },
    {
      title: "Team Events",
      description: "Regular team outings, celebrations, and fun activities",
      icon: Coffee
    },
    {
      title: "Performance Bonuses",
      description: "Quarterly bonuses and annual performance rewards",
      icon: Gift
    }
  ];

  const openings = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "4-6 years",
      salary: "₹15-25 LPA",
      skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"],
      description: "Join our core engineering team to build scalable solutions that connect millions of hearts. Work on cutting-edge features including AI matching algorithms, real-time chat systems, and mobile applications."
    },
    {
      id: 2,
      title: "AI/ML Engineer",
      department: "Data Science",
      location: "Mumbai, India",
      type: "Full-time",
      experience: "3-5 years",
      salary: "₹18-28 LPA",
      skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Recommendation Systems"],
      description: "Shape the future of matchmaking with advanced AI algorithms. Work on recommendation systems, natural language processing, and machine learning models that power our matching engine."
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "Delhi NCR, India",
      type: "Full-time",
      experience: "5-8 years",
      salary: "₹20-35 LPA",
      skills: ["Product Strategy", "User Research", "Analytics", "Agile", "Roadmap Planning"],
      description: "Lead product strategy and development for our core platform. Work closely with engineering, design, and business teams to deliver features that delight our users."
    },
    {
      id: 4,
      title: "UX/UI Designer",
      department: "Design",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "3-5 years",
      salary: "₹12-20 LPA",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Mobile Design"],
      description: "Create beautiful, intuitive experiences for millions of users. Design user journeys that make finding love feel magical and effortless."
    },
    {
      id: 5,
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Remote",
      type: "Full-time",
      experience: "3-6 years",
      salary: "₹14-22 LPA",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Monitoring"],
      description: "Build and maintain scalable infrastructure that supports millions of users. Ensure high availability, security, and performance of our platform."
    },
    {
      id: 6,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Chennai, India",
      type: "Full-time",
      experience: "2-4 years",
      salary: "₹8-15 LPA",
      skills: ["Customer Support", "CRM", "Communication", "Problem Solving", "Analytics"],
      description: "Help our users succeed in their journey to find love. Provide exceptional support and build relationships that turn users into advocates."
    }
  ];

  const values = [
    {
      title: "Put Love First",
      description: "Every decision we make is guided by our mission to help people find meaningful relationships."
    },
    {
      title: "Embrace Diversity",
      description: "We celebrate different perspectives, backgrounds, and experiences that make our team stronger."
    },
    {
      title: "Move Fast & Break Things",
      description: "We iterate quickly, learn from failures, and continuously improve our products and processes."
    },
    {
      title: "Own Your Impact",
      description: "Take ownership of your work, be accountable for results, and always strive for excellence."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
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
          <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">
            <Briefcase className="w-3 h-3 mr-1" />
            Join Our Team
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Build the Future of{" "}
            <span className="text-purple-500">Love & Relationships</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Join a passionate team of innovators, designers, and engineers who are revolutionizing 
            how people find their life partners. At MatrimonyWeb, your work directly impacts millions 
            of lives and creates countless love stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="#openings">View Open Positions</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#culture">Learn About Our Culture</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why MatrimonyWeb?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re not just building a product; we&apos;re creating a platform that changes lives and brings 
              happiness to millions of families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 w-fit">
                  <Heart className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle>Meaningful Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Your code, designs, and ideas help millions find their soulmates and create beautiful families.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 w-fit">
                  <Zap className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle>Cutting-Edge Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Work with the latest technologies, AI/ML models, and innovative solutions at scale.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-green-100 to-blue-100 w-fit">
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle>Amazing Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Collaborate with passionate, talented individuals from diverse backgrounds and experiences.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Benefits & Perks</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in taking care of our team members so they can do their best work and live their best lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={benefit.title} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100">
                        <IconComponent className="h-6 w-6 text-purple-500" />
                      </div>
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section id="culture" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Culture & Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These values guide our daily decisions and shape the way we work together as a team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <Card key={value.title} className="border-l-4 border-purple-500">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-bold">{index + 1}</span>
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Open Positions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our growing team and help us build the future of online matchmaking.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {openings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{job.department}</Badge>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          <Clock className="w-3 h-3 mr-1" />
                          {job.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {job.experience}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {job.salary}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{job.description}</p>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Key Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill} className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full">Apply Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Don&apos;t see the right role for you?</p>
            <Button variant="outline" size="lg">
              Send Us Your Resume
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-500 to-pink-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join our mission to connect hearts and create meaningful relationships around the world.
          </p>
          <Button size="lg" variant="secondary">
            <Heart className="mr-2 h-5 w-5" />
            Apply Today
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
                Building the future of love and relationships.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Careers</h3>
              <ul className="space-y-2">
                <li><Link href="#openings" className="hover:text-white">Open Positions</Link></li>
                <li><Link href="#culture" className="hover:text-white">Culture</Link></li>
                <li><Link href="/contact" className="hover:text-white">HR Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety</Link></li>
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
