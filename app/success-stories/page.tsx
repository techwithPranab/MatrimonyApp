import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, MapPin, Quote, Star } from "lucide-react";

export default function SuccessStoriesPage() {
  const stories = [
    {
      id: 1,
      names: "Priya & Rahul",
      location: "Mumbai, Maharashtra",
      marriageDate: "December 2023",
      image: "/api/placeholder/300/300",
      story: "We met through MatrimonyWeb in January 2023. What started as a simple conversation about our shared love for photography turned into deep conversations about life, dreams, and values. Six months later, Rahul proposed during a beautiful sunset photography session. We're grateful to MatrimonyWeb for bringing us together!",
      occupation: "Software Engineer & Photographer",
      quote: "MatrimonyWeb made finding my soulmate feel effortless and natural.",
      rating: 5
    },
    {
      id: 2,
      names: "Anjali & Vikram",
      location: "Delhi, NCR",
      marriageDate: "March 2024",
      image: "/api/placeholder/300/300",
      story: "After years of searching, we almost gave up hope. Then MatrimonyWeb's AI matching system connected us. Our families had similar values, and we discovered we lived just 10 minutes apart! Our first meeting at a local café turned into a 4-hour conversation. We knew we were meant to be together.",
      occupation: "Doctor & Business Analyst",
      quote: "The AI matching system is incredibly accurate. It found my perfect match!",
      rating: 5
    },
    {
      id: 3,
      names: "Sneha & Arjun",
      location: "Bangalore, Karnataka",
      marriageDate: "August 2023",
      image: "/api/placeholder/300/300",
      story: "Being introverts, we were hesitant about online platforms. But MatrimonyWeb's approach felt genuine and respectful. We connected over our shared passion for books and classical music. Our virtual dates during the pandemic brought us closer, and we realized we complement each other perfectly.",
      occupation: "Teacher & IT Consultant",
      quote: "Even introverts can find love here. The platform respects your pace.",
      rating: 5
    },
    {
      id: 4,
      names: "Kavya & Siddharth",
      location: "Chennai, Tamil Nadu",
      marriageDate: "November 2023",
      image: "/api/placeholder/300/300",
      story: "We were both focused on our careers and had given up on finding love. MatrimonyWeb's detailed profiles helped us understand each other's ambitions and goals. We're both entrepreneurs now, supporting each other's dreams while building our life together.",
      occupation: "Marketing Director & Startup Founder",
      quote: "Found a life partner who shares my entrepreneurial dreams!",
      rating: 5
    },
    {
      id: 5,
      names: "Meera & Aditya",
      location: "Pune, Maharashtra",
      marriageDate: "February 2024",
      image: "/api/placeholder/300/300",
      story: "After a difficult breakup, I thought I'd never find love again. Aditya's genuine profile and heartfelt messages restored my faith. We took things slow, became best friends first, and then fell in love. Our families adore each other, and we're planning our dream honeymoon to Europe!",
      occupation: "Graphic Designer & Finance Manager",
      quote: "Sometimes the best love stories begin with friendship.",
      rating: 5
    },
    {
      id: 6,
      names: "Divya & Karthik",
      location: "Hyderabad, Telangana",
      marriageDate: "June 2024",
      image: "/api/placeholder/300/300",
      story: "We're both from traditional families but with modern outlooks. MatrimonyWeb helped us find the perfect balance. Our families connected even before we did! What we love most is how the platform verified all profiles, giving us confidence in our choice.",
      occupation: "Lawyer & Architect",
      quote: "Trust and authenticity - that's what MatrimonyWeb delivers.",
      rating: 5
    }
  ];

  const stats = [
    { number: "50,000+", label: "Success Stories", icon: Heart },
    { number: "95%", label: "Satisfaction Rate", icon: Star },
    { number: "18", label: "Average Months to Marriage", icon: Calendar },
    { number: "500+", label: "Cities Covered", icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
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
            <Heart className="w-3 h-3 mr-1" />
            Real Love Stories
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Love Stories That{" "}
            <span className="text-pink-500">Inspire Hearts</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover how thousands of couples found their perfect match through MatrimonyWeb. 
            Their journey to love could be your inspiration.
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
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 w-fit">
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

      {/* Success Stories */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Beautiful Love Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every love story is unique and special. Here are some of our favorite success stories 
              from couples who found their happily ever after.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                    <Heart className="h-16 w-16 text-pink-500" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-white text-pink-600">
                    Married
                  </Badge>
                </div>
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {story.names}
                    </CardTitle>
                    <div className="flex">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={`${story.id}-star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <CardDescription className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {story.location}
                  </CardDescription>
                  <CardDescription className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Married {story.marriageDate}
                  </CardDescription>
                  <CardDescription className="text-sm text-gray-500">
                    {story.occupation}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <Quote className="h-5 w-5 text-pink-400 mb-2" />
                    <p className="text-pink-600 font-medium italic text-sm mb-4">
                      &quot;{story.quote}&quot;
                    </p>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                    {story.story}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Write Your Own Love Story
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-12">
            What Our Happy Couples Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-pink-200 mb-4 mx-auto" />
                <p className="text-lg mb-4">
                  &quot;The AI matching was spot on. We connected on so many levels instantly!&quot;
                </p>
                <div className="flex justify-center mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="font-semibold">Ravi & Sunita</p>
                <p className="text-pink-200 text-sm">Married 6 months ago</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-pink-200 mb-4 mx-auto" />
                <p className="text-lg mb-4">
                  &quot;Safe, authentic profiles. Our families trusted the platform completely.&quot;
                </p>
                <div className="flex justify-center mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="font-semibold">Neha & Amit</p>
                <p className="text-pink-200 text-sm">Married 1 year ago</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-pink-200 mb-4 mx-auto" />
                <p className="text-lg mb-4">
                  &quot;Found my soulmate within 3 months. Best decision we ever made!&quot;
                </p>
                <div className="flex justify-center mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="font-semibold">Pooja & Manish</p>
                <p className="text-pink-200 text-sm">Married 8 months ago</p>
              </CardContent>
            </Card>
          </div>
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
            Creating beautiful love stories since 2020
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
