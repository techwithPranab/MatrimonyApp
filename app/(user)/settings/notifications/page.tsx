'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Bell, Mail, Smartphone, Users, MessageCircle, Heart, Eye, CreditCard, ShieldCheck, Settings } from 'lucide-react';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newMatches: boolean;
  messages: boolean;
  interests: boolean;
  profileViews: boolean;
  subscriptionUpdates: boolean;
  verificationUpdates: boolean;
  systemAnnouncements: boolean;
  marketingEmails: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    newMatches: true,
    messages: true,
    interests: true,
    profileViews: false,
    subscriptionUpdates: true,
    verificationUpdates: true,
    systemAnnouncements: true,
    marketingEmails: false,
    frequency: 'immediate',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/notifications');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Notification settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setFrequency = (frequency: NotificationSettings['frequency']) => {
    setSettings(prev => ({ ...prev, frequency }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Settings
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </h1>
            </div>
            <Button
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* General Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={() => toggleSetting('emailNotifications')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-green-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-600">
                    Receive push notifications on your device
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={() => toggleSetting('pushNotifications')}
              />
            </div>

            <div className="pt-4 border-t">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Notification Frequency</h3>
                <p className="text-sm text-gray-600 mb-4">
                  How often would you like to receive notifications?
                </p>
                <div className="flex gap-2">
                  <Button
                    variant={settings.frequency === 'immediate' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFrequency('immediate')}
                  >
                    Immediate
                  </Button>
                  <Button
                    variant={settings.frequency === 'daily' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFrequency('daily')}
                  >
                    Daily Digest
                  </Button>
                  <Button
                    variant={settings.frequency === 'weekly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFrequency('weekly')}
                  >
                    Weekly Summary
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matrimony Activity Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Matrimony Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-pink-500" />
                <div>
                  <h3 className="font-medium text-gray-900">New Matches</h3>
                  <p className="text-sm text-gray-600">
                    Get notified about new potential matches
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.newMatches}
                onCheckedChange={() => toggleSetting('newMatches')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Messages</h3>
                  <p className="text-sm text-gray-600">
                    Get notified about new messages
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.messages}
                onCheckedChange={() => toggleSetting('messages')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Interests</h3>
                  <p className="text-sm text-gray-600">
                    Get notified about interest requests and responses
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.interests}
                onCheckedChange={() => toggleSetting('interests')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-green-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Profile Views</h3>
                  <p className="text-sm text-gray-600">
                    Get notified when someone views your profile
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.profileViews}
                onCheckedChange={() => toggleSetting('profileViews')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account & System Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Account & System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-purple-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Subscription Updates</h3>
                  <p className="text-sm text-gray-600">
                    Get notified about subscription changes and renewals
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.subscriptionUpdates}
                onCheckedChange={() => toggleSetting('subscriptionUpdates')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Verification Updates</h3>
                  <p className="text-sm text-gray-600">
                    Get notified about document verification status
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.verificationUpdates}
                onCheckedChange={() => toggleSetting('verificationUpdates')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-orange-500" />
                <div>
                  <h3 className="font-medium text-gray-900">System Announcements</h3>
                  <p className="text-sm text-gray-600">
                    Important announcements and system updates
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.systemAnnouncements}
                onCheckedChange={() => toggleSetting('systemAnnouncements')}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Marketing Emails</h3>
                  <p className="text-sm text-gray-600">
                    Receive promotional emails and special offers
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={() => toggleSetting('marketingEmails')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">New Match Found!</h4>
                  <p className="text-sm text-gray-600">
                    You have a new potential match. Check it out now!
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              This is how your notifications will appear based on your current settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
