'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PrivacySettings {
  profileVisibility: 'public' | 'members' | 'premium' | 'private';
  showLastSeen: boolean;
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  dataProcessingConsent: boolean;
  marketingConsent: boolean;
  analyticsConsent: boolean;
  dataRetentionPeriod: 1 | 2 | 5 | 'indefinite';
}

interface PrivacyReport {
  userId: string;
  accountCreated: string;
  lastActive: string;
  privacySettings: Partial<PrivacySettings>;
  consentHistory: Record<string, unknown>;
  dataProcessingActivities: string[];
  dataSharedWith: string[];
  retentionPolicy: string | number;
}

export default function PrivacyPage() {
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'members',
    showLastSeen: true,
    showOnlineStatus: true,
    allowDirectMessages: true,
    dataProcessingConsent: true,
    marketingConsent: false,
    analyticsConsent: true,
    dataRetentionPeriod: 'indefinite',
  });
  
  const [privacyReport, setPrivacyReport] = useState<PrivacyReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadPrivacyReport = useCallback(async () => {
    try {
      const response = await fetch('/api/privacy/settings');
      if (response.ok) {
        const data = await response.json();
        setPrivacyReport(data.data);
        if (data.data.privacySettings) {
          setSettings({ ...settings, ...data.data.privacySettings });
        }
      }
    } catch (error) {
      console.error('Error loading privacy report:', error);
    }
  }, [settings]);

  useEffect(() => {
    loadPrivacyReport();
  }, [loadPrivacyReport]);

  const updateSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/privacy/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_settings', settings }),
      });

      if (response.ok) {
        setMessage('Privacy settings updated successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      setMessage('Error updating privacy settings');
      setTimeout(() => setMessage(''), 3000);
    }
    setIsLoading(false);
  };

  const recordConsent = async (consentType: 'data_processing' | 'marketing' | 'analytics', granted: boolean) => {
    try {
      await fetch('/api/privacy/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'record_consent', consentType, granted }),
      });
      
      setSettings({ ...settings, [`${consentType}Consent`]: granted });
      setMessage('Consent preference updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating consent preference:', error);
      setMessage('Error updating consent preference');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const exportData = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(`/api/privacy/export?format=${format}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-data-export.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setMessage('Data export downloaded successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      setMessage('Error exporting data');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const requestDeletion = async (deletionType: 'all' | 'profile' | 'messages' | 'interests') => {
    if (!confirm(`Are you sure you want to delete your ${deletionType}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('/api/privacy/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'request_deletion', 
          deletionType,
          reason: 'User requested deletion'
        }),
      });

      if (response.ok) {
        setMessage('Deletion request submitted successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error submitting deletion request:', error);
      setMessage('Error submitting deletion request');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy & Data Controls</h1>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {message}
        </div>
      )}

      {/* Privacy Settings */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Privacy Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="profileVisibility" className="block text-sm font-medium mb-2">Profile Visibility</label>
            <select
              id="profileVisibility"
              value={settings.profileVisibility}
              onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value as PrivacySettings['profileVisibility'] })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="public">Public (visible to everyone)</option>
              <option value="members">Members only</option>
              <option value="premium">Premium members only</option>
              <option value="private">Private (hidden from search)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.showLastSeen}
                onChange={(e) => setSettings({ ...settings, showLastSeen: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Show when last seen</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.showOnlineStatus}
                onChange={(e) => setSettings({ ...settings, showOnlineStatus: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Show online status</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.allowDirectMessages}
                onChange={(e) => setSettings({ ...settings, allowDirectMessages: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Allow direct messages</span>
            </label>
          </div>

          <div>
            <label htmlFor="dataRetentionPeriod" className="block text-sm font-medium mb-2">Data Retention Period</label>
            <select
              id="dataRetentionPeriod"
              value={settings.dataRetentionPeriod}
              onChange={(e) => setSettings({ ...settings, dataRetentionPeriod: e.target.value as PrivacySettings['dataRetentionPeriod'] })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>1 year</option>
              <option value={2}>2 years</option>
              <option value={5}>5 years</option>
              <option value="indefinite">Indefinite</option>
            </select>
          </div>

          <Button onClick={updateSettings} disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? 'Updating...' : 'Update Settings'}
          </Button>
        </div>
      </Card>

      {/* Consent Management */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Consent Management</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <h3 className="font-medium">Data Processing</h3>
              <p className="text-sm text-gray-600">Process your data for matchmaking and core services</p>
            </div>
            <Button
              onClick={() => recordConsent('data_processing', !settings.dataProcessingConsent)}
              variant={settings.dataProcessingConsent ? "default" : "outline"}
              size="sm"
            >
              {settings.dataProcessingConsent ? 'Granted' : 'Grant'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <h3 className="font-medium">Marketing Communications</h3>
              <p className="text-sm text-gray-600">Receive promotional emails and offers</p>
            </div>
            <Button
              onClick={() => recordConsent('marketing', !settings.marketingConsent)}
              variant={settings.marketingConsent ? "default" : "outline"}
              size="sm"
            >
              {settings.marketingConsent ? 'Granted' : 'Grant'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <h3 className="font-medium">Analytics</h3>
              <p className="text-sm text-gray-600">Help improve our services through usage analytics</p>
            </div>
            <Button
              onClick={() => recordConsent('analytics', !settings.analyticsConsent)}
              variant={settings.analyticsConsent ? "default" : "outline"}
              size="sm"
            >
              {settings.analyticsConsent ? 'Granted' : 'Grant'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Export */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Export</h2>
        <p className="text-gray-600 mb-4">
          Download a copy of all your data in your preferred format.
        </p>
        
        <div className="flex gap-4">
          <Button onClick={() => exportData('json')} variant="outline">
            Export as JSON
          </Button>
          <Button onClick={() => exportData('csv')} variant="outline">
            Export as CSV
          </Button>
        </div>
      </Card>

      {/* Account Deletion */}
      <Card className="p-6 mb-8 border-red-200">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Account Deletion</h2>
        <p className="text-gray-600 mb-4">
          Delete specific parts of your account or your entire account permanently.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={() => requestDeletion('profile')} 
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Delete Profile Only
          </Button>
          <Button 
            onClick={() => requestDeletion('messages')} 
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Delete Messages
          </Button>
          <Button 
            onClick={() => requestDeletion('interests')} 
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Delete Interests
          </Button>
          <Button 
            onClick={() => requestDeletion('all')} 
            variant="destructive"
          >
            Delete Entire Account
          </Button>
        </div>
      </Card>

      {/* Privacy Report */}
      {privacyReport && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Privacy Report</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Account Information</h3>
              <p className="text-sm text-gray-600">Created: {new Date(privacyReport.accountCreated).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Last Active: {privacyReport.lastActive !== 'Never' ? new Date(privacyReport.lastActive).toLocaleDateString() : 'Never'}</p>
              <p className="text-sm text-gray-600">Retention Policy: {privacyReport.retentionPolicy}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Data Processing Activities</h3>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {privacyReport.dataProcessingActivities.map((activity, index) => (
                  <li key={`activity-${activity.slice(0, 20)}-${index}`}>{activity}</li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-medium mb-2">Data Shared With</h3>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {privacyReport.dataSharedWith.map((entity, index) => (
                  <li key={`entity-${entity.slice(0, 20)}-${index}`}>{entity}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
