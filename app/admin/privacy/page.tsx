"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Save,
  Edit,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
  Database,
  Cookie,
  UserCheck,
  AlertTriangle
} from "lucide-react";

interface PrivacySection {
  _id: string;
  title: string;
  content: string;
  category: 'data-collection' | 'data-usage' | 'data-sharing' | 'user-rights' | 'security' | 'cookies' | 'contact' | 'other';
  order: number;
  isVisible: boolean;
  lastUpdated: string;
}

interface DataCategory {
  _id: string;
  name: string;
  description: string;
  dataTypes: string[];
  purpose: string;
  retention: string;
  sharing: string[];
  userControl: string;
  isActive: boolean;
}

interface CookiePolicy {
  _id: string;
  category: 'essential' | 'functional' | 'analytics' | 'marketing';
  name: string;
  description: string;
  provider: string;
  duration: string;
  purpose: string;
  isActive: boolean;
}

interface PrivacySettings {
  _id: string;
  dataRetentionPeriod: number;
  automaticDeletionEnabled: boolean;
  consentRequired: boolean;
  cookieConsentRequired: boolean;
  privacyOfficerEmail: string;
  dpoEmail: string;
  lastReviewed: string;
  complianceFrameworks: string[];
}

export default function PrivacyPage() {
  const [sections, setSections] = useState<PrivacySection[]>([]);
  const [dataCategories, setDataCategories] = useState<DataCategory[]>([]);
  const [cookiePolicies, setCookiePolicies] = useState<CookiePolicy[]>([]);
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sections' | 'data' | 'cookies' | 'settings'>('sections');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [sectionsRes, dataRes, cookiesRes, settingsRes] = await Promise.all([
        fetch('/api/admin/legal/privacy/sections'),
        fetch('/api/admin/legal/privacy/data-categories'),
        fetch('/api/admin/legal/privacy/cookies'),
        fetch('/api/admin/legal/privacy/settings')
      ]);

      const sectionsData = await sectionsRes.json();
      const dataData = await dataRes.json();
      const cookiesData = await cookiesRes.json();
      const settingsData = await settingsRes.json();

      setSections(Array.isArray(sectionsData) ? sectionsData : []);
      setDataCategories(Array.isArray(dataData) ? dataData : []);
      setCookiePolicies(Array.isArray(cookiesData) ? cookiesData : []);
      setSettings(settingsData);
    } catch (error) {
      console.error("Failed to fetch privacy data:", error);
      setSections([]);
      setDataCategories([]);
      setCookiePolicies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSection = async (sectionId: string, data: Partial<PrivacySection>) => {
    try {
      await fetch(`/api/admin/legal/privacy/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchData();
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to save section:", error);
    }
  };

  const addSection = async () => {
    const title = prompt("Enter section title:");
    const category = prompt("Enter category (data-collection, data-usage, etc.):");
    if (!title || !category) return;

    try {
      await fetch('/api/admin/legal/privacy/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title,
          category,
          content: "",
          order: sections.length + 1
        }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to add section:", error);
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    try {
      await fetch(`/api/admin/legal/privacy/sections/${sectionId}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (error) {
      console.error("Failed to delete section:", error);
    }
  };

  const toggleVisibility = async (type: string, id: string, isVisible: boolean) => {
    try {
      await fetch(`/api/admin/legal/privacy/${type}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !isVisible }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    }
  };

  const updateSettings = async (data: Partial<PrivacySettings>) => {
    try {
      await fetch('/api/admin/legal/privacy/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data-collection': return <Database className="h-4 w-4" />;
      case 'security': return <Lock className="h-4 w-4" />;
      case 'cookies': return <Cookie className="h-4 w-4" />;
      case 'user-rights': return <UserCheck className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'essential': return 'bg-red-100 text-red-800';
      case 'functional': return 'bg-blue-100 text-blue-800';
      case 'analytics': return 'bg-green-100 text-green-800';
      case 'marketing': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading privacy policy data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Privacy Policy Management</h2>
          <p className="text-gray-600">Manage privacy policies, data categories, and GDPR compliance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Mode'}
          </Button>
        </div>
      </div>

      {/* Compliance Alert */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <div className="font-medium text-yellow-800">Compliance Notice</div>
              <div className="text-sm text-yellow-700">
                Ensure privacy policy is updated regularly and complies with GDPR, CCPA, and other applicable regulations.
                Last reviewed: {settings?.lastReviewed ? new Date(settings.lastReviewed).toLocaleDateString() : 'Never'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Policy Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sections.length}</div>
            <div className="text-sm text-gray-500">
              {sections.filter(s => s.isVisible).length} visible
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Data Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataCategories.length}</div>
            <div className="text-sm text-gray-500">
              {dataCategories.filter(d => d.isActive).length} active
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cookie Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cookiePolicies.length}</div>
            <div className="text-sm text-gray-500">
              {cookiePolicies.filter(c => c.isActive).length} active
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Retention Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{settings?.dataRetentionPeriod || 0}</div>
            <div className="text-sm text-gray-500">days</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'sections', label: 'Policy Sections' },
            { key: 'data', label: 'Data Categories' },
            { key: 'cookies', label: 'Cookie Policies' },
            { key: 'settings', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'sections' | 'data' | 'cookies' | 'settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Policy Sections Tab */}
      {activeTab === 'sections' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Privacy Policy Sections</CardTitle>
              {isEditing && (
                <Button onClick={addSection} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {sections.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No privacy policy sections found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getCategoryIcon(section.category)}
                          {editingItem === section._id ? (
                            <Input
                              defaultValue={section.title}
                              onBlur={(e) => saveSection(section._id, { title: e.target.value })}
                              className="flex-1"
                            />
                          ) : (
                            <h3 className="font-medium text-gray-900">{section.title}</h3>
                          )}
                          <Badge variant="outline">{section.category}</Badge>
                        </div>
                        {editingItem === section._id ? (
                          <div className="space-y-3">
                            <Textarea
                              defaultValue={section.content}
                              rows={4}
                              onBlur={(e) => saveSection(section._id, { content: e.target.value })}
                            />
                            <Button onClick={() => setEditingItem(null)} size="sm">
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {section.content || 'No content'}
                          </p>
                        )}
                        <div className="text-xs text-gray-400 mt-2">
                          Order: {section.order} | Updated: {new Date(section.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={section.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {section.isVisible ? 'Visible' : 'Hidden'}
                        </Badge>
                        {isEditing && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditingItem(editingItem === section._id ? null : section._id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleVisibility('sections', section._id, section.isVisible)}
                            >
                              {section.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteSection(section._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Data Categories Tab */}
      {activeTab === 'data' && (
        <Card>
          <CardHeader>
            <CardTitle>Data Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {dataCategories.length === 0 ? (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No data categories found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {dataCategories.map((category) => (
                  <div key={category._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                          <div>
                            <span className="font-medium">Purpose:</span> {category.purpose}
                          </div>
                          <div>
                            <span className="font-medium">Retention:</span> {category.retention}
                          </div>
                          <div>
                            <span className="font-medium">User Control:</span> {category.userControl}
                          </div>
                          <div>
                            <span className="font-medium">Data Types:</span> {category.dataTypes.join(', ')}
                          </div>
                        </div>
                      </div>
                      <Badge className={category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cookie Policies Tab */}
      {activeTab === 'cookies' && (
        <Card>
          <CardHeader>
            <CardTitle>Cookie Policies</CardTitle>
          </CardHeader>
          <CardContent>
            {cookiePolicies.length === 0 ? (
              <div className="text-center py-8">
                <Cookie className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No cookie policies found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cookiePolicies.map((cookie) => (
                  <div key={cookie._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{cookie.name}</h3>
                          <Badge className={getCategoryColor(cookie.category)}>
                            {cookie.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{cookie.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Provider:</span> {cookie.provider}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {cookie.duration}
                          </div>
                          <div>
                            <span className="font-medium">Purpose:</span> {cookie.purpose}
                          </div>
                        </div>
                      </div>
                      <Badge className={cookie.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {cookie.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && settings && (
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Data Retention Period (days)</div>
                  {isEditing ? (
                    <Input
                      type="number"
                      defaultValue={settings.dataRetentionPeriod}
                      onBlur={(e) => updateSettings({ dataRetentionPeriod: parseInt(e.target.value) })}
                    />
                  ) : (
                    <p className="text-gray-900">{settings.dataRetentionPeriod} days</p>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Privacy Officer Email</div>
                  {isEditing ? (
                    <Input
                      type="email"
                      defaultValue={settings.privacyOfficerEmail}
                      onBlur={(e) => updateSettings({ privacyOfficerEmail: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{settings.privacyOfficerEmail}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div>
                  <input
                    type="checkbox"
                    id="automaticDeletion"
                    checked={settings.automaticDeletionEnabled}
                    onChange={(e) => updateSettings({ automaticDeletionEnabled: e.target.checked })}
                    disabled={!isEditing}
                  />
                  <label htmlFor="automaticDeletion" className="ml-2 text-sm text-gray-900">
                    Enable automatic data deletion
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="consentRequired"
                    checked={settings.consentRequired}
                    onChange={(e) => updateSettings({ consentRequired: e.target.checked })}
                    disabled={!isEditing}
                  />
                  <label htmlFor="consentRequired" className="ml-2 text-sm text-gray-900">
                    Require user consent
                  </label>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Compliance Frameworks</div>
                <div className="flex flex-wrap gap-2">
                  {settings.complianceFrameworks.map((framework) => (
                    <Badge key={framework} variant="outline">{framework}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
