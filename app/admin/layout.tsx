"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Shield, 
  CreditCard,
  Heart,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  UserCheck,
  FileText,
  HelpCircle,
  Mail,
  DollarSign,
  Lock,
  Info
} from 'lucide-react';

const sidebarGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    ]
  },
  {
    label: 'User Management',
    items: [
      { href: '/admin/users', icon: Users, label: 'Users' },
      { href: '/admin/profiles', icon: Shield, label: 'Profiles' },
      { href: '/admin/approvals', icon: UserCheck, label: 'Approvals' },
      { href: '/admin/admin-users', icon: Shield, label: 'Admin Users' },
    ]
  },
  {
    label: 'Content & Stories',
    items: [
      { href: '/admin/success-stories', icon: Heart, label: 'Success Stories' },
      { href: '/admin/support', icon: HelpCircle, label: 'Support' },
    ]
  },
  {
    label: 'Financial',
    items: [
      { href: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
      { href: '/admin/revenue', icon: DollarSign, label: 'Revenue' },
      { href: '/admin/payments', icon: CreditCard, label: 'Payments' },
      { href: '/admin/pricing', icon: DollarSign, label: 'Pricing' },
    ]
  },
  {
    label: 'Content Management',
    items: [
      { href: '/admin/careers', icon: Users, label: 'Careers' },
      { href: '/admin/help', icon: HelpCircle, label: 'Help Center' },
      { href: '/admin/contact', icon: Mail, label: 'Contact Info' },
      { href: '/admin/about', icon: Info, label: 'About Us' },
    ]
  },
  {
    label: 'Legal & Settings',
    items: [
      { href: '/admin/safety', icon: Shield, label: 'Safety' },
      { href: '/admin/terms', icon: FileText, label: 'Terms' },
      { href: '/admin/privacy', icon: Lock, label: 'Privacy' },
      { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ]
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Collapsible sidebar groups
  const [openGroups, setOpenGroups] = useState(() => sidebarGroups.map(() => true));

  const toggleGroup = (idx: number) => {
    setOpenGroups(groups => groups.map((open, i) => i === idx ? !open : open));
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for login page
      if (pathname === '/admin/login') {
        setIsAuthenticated(true);
        return;
      }

      try {
        const response = await fetch('/api/admin/auth/verify', {
          credentials: 'include',
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  // For login page, show without layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Get all items from all groups for finding current page title
  const allItems = sidebarGroups.flatMap(group => group.items);
  const currentPageTitle = allItems.find(item => item.href === pathname)?.label || 'Admin Panel';
  const showBackButton = pathname !== '/admin/dashboard';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-6">
            {sidebarGroups.map((group, idx) => (
              <div key={group.label}>
                <button
                  type="button"
                  className="flex items-center justify-between w-full px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-expanded={openGroups[idx]}
                  aria-controls={`sidebar-group-${idx}`}
                  onClick={() => toggleGroup(idx)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') toggleGroup(idx);
                  }}
                >
                  <span>{group.label}</span>
                  <span className="ml-2 text-gray-500">{openGroups[idx] ? '−' : '+'}</span>
                </button>
                {openGroups[idx] && (
                  <div id={`sidebar-group-${idx}`} className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActive
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <Icon className={`mr-3 h-5 w-5 ${
                            isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                          }`} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-500" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {showBackButton && (
                <button
                  onClick={handleGoBack}
                  className="ml-2 lg:ml-0 p-2 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              
              <h1 className="ml-2 text-xl font-semibold text-gray-900">
                {currentPageTitle}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
