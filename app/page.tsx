import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, Zap, Star, ArrowRight, CheckCircle, Menu } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Modern Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Heart className="h-8 w-8 text-purple-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse-soft"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MatrimonyWeb
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/pricing" className="text-neutral-600 hover:text-purple-600 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/success-stories" className="text-neutral-600 hover:text-purple-600 transition-colors font-medium">
              Success Stories
            </Link>
            <Link href="/help" className="text-neutral-600 hover:text-purple-600 transition-colors font-medium">
              Help
            </Link>
          </nav>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" className="text-neutral-600 hover:text-purple-600" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
              asChild
            >
              <Link href="/sign-up">Join Free</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-neutral-600 hover:text-purple-600"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50"></div>
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="mb-6 sm:mb-8 text-3xl sm:text-4xl lg:text-6xl xl:text-7xl">
              Find Your Perfect{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Life Partner
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-neutral-600 leading-relaxed mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
              Join millions who found their soulmate on India&apos;s most trusted matrimony platform.
              Our AI-powered matching connects you with genuinely compatible profiles.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16 animate-slide-up px-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg touch-optimized" 
                asChild
              >
                <Link href="/sign-up" className="flex items-center justify-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-2 border-purple-200 text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg touch-optimized" 
                asChild
              >
                <Link href="/search">Browse Profiles</Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-neutral-600 animate-scale-in px-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>100% Verified Profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>5M+ Success Stories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl sm:text-5xl font-bold mb-2">10M+</div>
              <div className="text-purple-100 text-base sm:text-lg">Verified Profiles</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl sm:text-5xl font-bold mb-2">5M+</div>
              <div className="text-purple-100 text-base sm:text-lg">Success Stories</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl sm:text-5xl font-bold mb-2">50+</div>
              <div className="text-purple-100 text-base sm:text-lg">Communities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl">
              Why Choose <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">MatrimonyWeb</span>?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-neutral-600 leading-relaxed max-w-2xl mx-auto px-4">
              We combine traditional matchmaking with modern technology to create meaningful connections.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Card className="card-premium group animate-scale-in touch-optimized">
              <CardHeader className="text-center p-6 sm:p-8">
                <div className="mb-4 sm:mb-6 relative">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl mb-3 sm:mb-4">Verified Profiles</CardTitle>
                <CardDescription className="text-neutral-600 leading-relaxed text-sm sm:text-base">
                  Every profile is manually verified for authenticity and safety. Connect with confidence.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-premium group animate-scale-in touch-optimized">
              <CardHeader className="text-center p-6 sm:p-8">
                <div className="mb-4 sm:mb-6 relative">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-6 sm:h-8 w-6 sm:w-8 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl mb-3 sm:mb-4">AI Matching</CardTitle>
                <CardDescription className="text-neutral-600 leading-relaxed text-sm sm:text-base">
                  Advanced algorithms analyze compatibility across multiple dimensions for perfect matches.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-premium group animate-scale-in touch-optimized">
              <CardHeader className="text-center p-6 sm:p-8">
                <div className="mb-4 sm:mb-6 relative">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-6 sm:h-8 w-6 sm:w-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl mb-3 sm:mb-4">Diverse Community</CardTitle>
                <CardDescription className="text-neutral-600 leading-relaxed text-sm sm:text-base">
                  Members from 50+ communities, all religions, and diverse backgrounds worldwide.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-premium group animate-scale-in touch-optimized">
              <CardHeader className="text-center p-6 sm:p-8">
                <div className="mb-4 sm:mb-6 relative">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-6 sm:h-8 w-6 sm:w-8 text-pink-600" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl mb-3 sm:mb-4">Success Stories</CardTitle>
                <CardDescription className="text-neutral-600 leading-relaxed text-sm sm:text-base">
                  Over 5 million couples found their happiness through our trusted platform.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCA1NiA1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDU2IDAgTCAwIDAgMCA1NiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative container mx-auto text-center">
          <div className="max-w-3xl mx-auto text-white animate-fade-in px-4">
            <h2 className="mb-4 sm:mb-6 text-white text-3xl sm:text-4xl lg:text-5xl">
              Ready to Find Your Life Partner?
            </h2>
            <p className="text-lg sm:text-xl leading-relaxed mb-8 sm:mb-12 text-purple-100">
              Join thousands of successful couples who found love on MatrimonyWeb. Your perfect match is waiting.
            </p>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-white text-purple-600 hover:bg-purple-50 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 px-8 sm:px-12 py-4 text-lg font-semibold touch-optimized" 
              asChild
            >
              <Link href="/sign-up" className="flex items-center justify-center gap-2">
                Create Profile Now - Free!
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-300 py-12 sm:py-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Heart className="h-8 w-8 text-purple-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse-soft"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  MatrimonyWeb
                </span>
              </div>
              <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
                India&apos;s most trusted matrimony platform helping millions find their perfect life partner with advanced AI matching.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-neutral-400 hover:text-purple-400 transition-colors touch-optimized inline-block">About Us</Link></li>
                <li><Link href="/careers" className="text-neutral-400 hover:text-purple-400 transition-colors touch-optimized inline-block">Careers</Link></li>
                <li><Link href="/contact" className="text-neutral-400 hover:text-purple-400 transition-colors touch-optimized inline-block">Contact</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-neutral-400 hover:text-purple-400 transition-colors touch-optimized inline-block">Help Center</Link></li>
                <li><Link href="/safety" className="text-neutral-400 hover:text-purple-400 transition-colors touch-optimized inline-block">Safety</Link></li>
                <li><Link href="/terms" className="text-neutral-400 hover:text-purple-400 transition-colors touch-optimized inline-block">Terms</Link></li>
                <li><Link href="/privacy" className="text-neutral-400 hover:text-purple-400 transition-colors touch-optimized inline-block">Privacy</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Services</h3>
              <ul className="space-y-3">
                <li><Link href="/pricing" className="text-neutral-400 hover:text-purple-400 transition-colors touch-optimized inline-block">Premium Plans</Link></li>
                <li><span className="text-neutral-500">Mobile App (Coming Soon)</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-700 pt-6 sm:pt-8 text-center">
            <p className="text-neutral-400 text-sm sm:text-base">
              © 2024 MatrimonyWeb. All rights reserved. Made with ❤️ for lasting connections.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
