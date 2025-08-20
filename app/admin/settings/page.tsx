"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { 
  Save, 
  RefreshCw, 
  Shield, 
  Mail, 
  Globe,
  Eye,
  Lock
} from "lucide-react";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  profileApprovalRequired: boolean;
  maxPhotosPerProfile: number;
  minAgeRestriction: number;
  maxAgeRestriction: number;
  subscriptionRequired: boolean;
  autoMatchingEnabled: boolean;
  chatEnabled: boolean;
  videoCallEnabled: boolean;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  cookiePolicyUrl: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: string | number | boolean) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {settings && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    placeholder="Your Matrimony Site"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <Input
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                    placeholder="Find your perfect match..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site URL
                  </label>
                  <Input
                    value={settings.siteUrl}
                    onChange={(e) => updateSetting('siteUrl', e.target.value)}
                    placeholder="https://yoursite.com"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                    <p className="text-sm text-gray-500">Site will be unavailable to users</p>
                  </div>
                  <Badge 
                    variant={settings.maintenanceMode ? "destructive" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => updateSetting('maintenanceMode', !settings.maintenanceMode)}
                  >
                    {settings.maintenanceMode ? 'ON' : 'OFF'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <Input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateSetting('contactEmail', e.target.value)}
                    placeholder="contact@yoursite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Email
                  </label>
                  <Input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => updateSetting('supportEmail', e.target.value)}
                    placeholder="support@yoursite.com"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Email Verification</span>
                    <p className="text-sm text-gray-500">Require email verification for new users</p>
                  </div>
                  <Badge 
                    variant={settings.emailVerificationRequired ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => updateSetting('emailVerificationRequired', !settings.emailVerificationRequired)}
                  >
                    {settings.emailVerificationRequired ? 'Required' : 'Optional'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Registration</span>
                    <p className="text-sm text-gray-500">Allow new user registrations</p>
                  </div>
                  <Badge 
                    variant={settings.registrationEnabled ? "default" : "destructive"}
                    className="cursor-pointer"
                    onClick={() => updateSetting('registrationEnabled', !settings.registrationEnabled)}
                  >
                    {settings.registrationEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Profile Approval</span>
                    <p className="text-sm text-gray-500">Require admin approval for new profiles</p>
                  </div>
                  <Badge 
                    variant={settings.profileApprovalRequired ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => updateSetting('profileApprovalRequired', !settings.profileApprovalRequired)}
                  >
                    {settings.profileApprovalRequired ? 'Required' : 'Auto-Approve'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Age
                    </label>
                    <Input
                      type="number"
                      value={settings.minAgeRestriction}
                      onChange={(e) => updateSetting('minAgeRestriction', parseInt(e.target.value))}
                      min="18"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Age
                    </label>
                    <Input
                      type="number"
                      value={settings.maxAgeRestriction}
                      onChange={(e) => updateSetting('maxAgeRestriction', parseInt(e.target.value))}
                      min="18"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Photos Per Profile
                  </label>
                  <Input
                    type="number"
                    value={settings.maxPhotosPerProfile}
                    onChange={(e) => updateSetting('maxPhotosPerProfile', parseInt(e.target.value))}
                    min="1"
                    max="20"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Feature Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Feature Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Subscription Required</span>
                    <p className="text-sm text-gray-500">Require subscription to contact users</p>
                  </div>
                  <Badge 
                    variant={settings.subscriptionRequired ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => updateSetting('subscriptionRequired', !settings.subscriptionRequired)}
                  >
                    {settings.subscriptionRequired ? 'Required' : 'Optional'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Auto Matching</span>
                    <p className="text-sm text-gray-500">Enable AI-powered matching suggestions</p>
                  </div>
                  <Badge 
                    variant={settings.autoMatchingEnabled ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => updateSetting('autoMatchingEnabled', !settings.autoMatchingEnabled)}
                  >
                    {settings.autoMatchingEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Chat Feature</span>
                    <p className="text-sm text-gray-500">Allow users to chat with matches</p>
                  </div>
                  <Badge 
                    variant={settings.chatEnabled ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => updateSetting('chatEnabled', !settings.chatEnabled)}
                  >
                    {settings.chatEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Video Calls</span>
                    <p className="text-sm text-gray-500">Enable video calling feature</p>
                  </div>
                  <Badge 
                    variant={settings.videoCallEnabled ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => updateSetting('videoCallEnabled', !settings.videoCallEnabled)}
                  >
                    {settings.videoCallEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Legal Pages */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Legal & Policy Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Privacy Policy URL
                    </label>
                    <Input
                      value={settings.privacyPolicyUrl}
                      onChange={(e) => updateSetting('privacyPolicyUrl', e.target.value)}
                      placeholder="/privacy"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Terms of Service URL
                    </label>
                    <Input
                      value={settings.termsOfServiceUrl}
                      onChange={(e) => updateSetting('termsOfServiceUrl', e.target.value)}
                      placeholder="/terms"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cookie Policy URL
                    </label>
                    <Input
                      value={settings.cookiePolicyUrl}
                      onChange={(e) => updateSetting('cookiePolicyUrl', e.target.value)}
                      placeholder="/cookies"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-end pt-6">
          <div className="flex items-center space-x-3">
            <Button 
              onClick={fetchSettings} 
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !settings}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    
  );
}
