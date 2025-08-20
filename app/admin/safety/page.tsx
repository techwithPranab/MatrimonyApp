"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Save,
  Edit,
  Plus,
  Eye,
  RefreshCw,
  AlertTriangle,
  Flag,
  UserX,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare
} from "lucide-react";

interface SafetyGuideline {
  _id: string;
  title: string;
  content: string;
  category: 'dating' | 'online' | 'meeting' | 'financial' | 'reporting' | 'general';
  priority: 'high' | 'medium' | 'low';
  isVisible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface SafetyReport {
  _id: string;
  reporterId: string;
  reporterEmail: string;
  reportedUserId: string;
  reportedUserEmail: string;
  reportType: 'harassment' | 'fake-profile' | 'inappropriate-content' | 'spam' | 'fraud' | 'other';
  description: string;
  evidence: string[];
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  resolution?: string;
  actionTaken?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlockedUser {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  reason: string;
  blockedBy: string;
  blockedAt: string;
  isActive: boolean;
  duration?: string;
  expiresAt?: string;
}

interface SafetySettings {
  _id: string;
  autoModerationEnabled: boolean;
  reportThreshold: number;
  autoBlockThreshold: number;
  requirePhotoVerification: boolean;
  requirePhoneVerification: boolean;
  allowAnonymousReports: boolean;
  safetyOfficerEmail: string;
  emergencyContacts: string[];
  updatedAt: string;
}

export default function SafetyPage() {
  const [guidelines, setGuidelines] = useState<SafetyGuideline[]>([]);
  const [reports, setReports] = useState<SafetyReport[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [settings, setSettings] = useState<SafetySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'guidelines' | 'reports' | 'blocked' | 'settings'>('guidelines');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [guidelinesRes, reportsRes, blockedRes, settingsRes] = await Promise.all([
        fetch('/api/admin/safety/guidelines'),
        fetch('/api/admin/safety/reports'),
        fetch('/api/admin/safety/blocked-users'),
        fetch('/api/admin/safety/settings')
      ]);

      const guidelinesData = await guidelinesRes.json();
      const reportsData = await reportsRes.json();
      const blockedData = await blockedRes.json();
      const settingsData = await settingsRes.json();

      setGuidelines(Array.isArray(guidelinesData) ? guidelinesData : []);
      setReports(Array.isArray(reportsData) ? reportsData : []);
      setBlockedUsers(Array.isArray(blockedData) ? blockedData : []);
      setSettings(settingsData);
    } catch (error) {
      console.error("Failed to fetch safety data:", error);
      setGuidelines([]);
      setReports([]);
      setBlockedUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, status: string, resolution?: string) => {
    try {
      await fetch(`/api/admin/safety/reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolution }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to update report status:", error);
    }
  };

  const blockUser = async (userId: string, reason: string, duration?: string) => {
    try {
      await fetch('/api/admin/safety/block-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason, duration }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to block user:", error);
    }
  };

  const unblockUser = async (blockId: string) => {
    try {
      await fetch(`/api/admin/safety/blocked-users/${blockId}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (error) {
      console.error("Failed to unblock user:", error);
    }
  };

  const saveGuideline = async (guidelineId: string, data: Partial<SafetyGuideline>) => {
    try {
      await fetch(`/api/admin/safety/guidelines/${guidelineId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchData();
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to save guideline:", error);
    }
  };

  const addGuideline = async () => {
    const title = prompt("Enter guideline title:");
    const category = prompt("Enter category (dating, online, meeting, etc.):");
    if (!title || !category) return;

    try {
      await fetch('/api/admin/safety/guidelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title,
          category,
          content: "",
          priority: 'medium',
          order: guidelines.length + 1
        }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to add guideline:", error);
    }
  };

  const updateSettings = async (data: Partial<SafetySettings>) => {
    try {
      await fetch('/api/admin/safety/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'harassment': return <Flag className="h-4 w-4" />;
      case 'fake-profile': return <UserX className="h-4 w-4" />;
      case 'fraud': return <AlertTriangle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const filteredReports = reports.filter(report => 
    report.reporterEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reportedUserEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading safety data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Safety & Security Management</h2>
          <p className="text-gray-600">Manage safety guidelines, reports, and user protection</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Safety Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guidelines.length}</div>
            <div className="text-sm text-gray-500">
              {guidelines.filter(g => g.isVisible).length} published
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {reports.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-500">
              {reports.filter(r => r.priority === 'urgent').length} urgent
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Blocked Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {blockedUsers.filter(b => b.isActive).length}
            </div>
            <div className="text-sm text-gray-500">
              active blocks
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Auto Moderation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="text-sm text-gray-500">
              {settings?.autoModerationEnabled ? 'Enabled' : 'Disabled'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'guidelines', label: 'Safety Guidelines' },
            { key: 'reports', label: 'Safety Reports' },
            { key: 'blocked', label: 'Blocked Users' },
            { key: 'settings', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'guidelines' | 'reports' | 'blocked' | 'settings')}
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

      {/* Safety Guidelines Tab */}
      {activeTab === 'guidelines' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Safety Guidelines</CardTitle>
              {isEditing && (
                <Button onClick={addGuideline} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guideline
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {guidelines.length === 0 ? (
              <div className="text-center py-8">
                <ShieldCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No safety guidelines found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {guidelines.map((guideline) => (
                  <div key={guideline._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {editingItem === guideline._id ? (
                            <Input
                              defaultValue={guideline.title}
                              onBlur={(e) => saveGuideline(guideline._id, { title: e.target.value })}
                              className="flex-1"
                            />
                          ) : (
                            <h3 className="font-medium text-gray-900">{guideline.title}</h3>
                          )}
                          <Badge variant="outline">{guideline.category}</Badge>
                          <Badge className={getPriorityColor(guideline.priority)}>
                            {guideline.priority}
                          </Badge>
                        </div>
                        {editingItem === guideline._id ? (
                          <div className="space-y-3">
                            <Textarea
                              defaultValue={guideline.content}
                              rows={4}
                              onBlur={(e) => saveGuideline(guideline._id, { content: e.target.value })}
                            />
                            <Button onClick={() => setEditingItem(null)} size="sm">
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {guideline.content || 'No content'}
                          </p>
                        )}
                        <div className="text-xs text-gray-400 mt-2">
                          Order: {guideline.order} | Updated: {new Date(guideline.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={guideline.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {guideline.isVisible ? 'Visible' : 'Hidden'}
                        </Badge>
                        {isEditing && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditingItem(editingItem === guideline._id ? null : guideline._id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => saveGuideline(guideline._id, { isVisible: !guideline.isVisible })}
                            >
                              {guideline.isVisible ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
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

      {/* Safety Reports Tab */}
      {activeTab === 'reports' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Safety Reports</CardTitle>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredReports.length === 0 ? (
              <div className="text-center py-8">
                <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No safety reports found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getCategoryIcon(report.reportType)}
                          <h3 className="font-medium text-gray-900 capitalize">
                            {report.reportType.replace('-', ' ')}
                          </h3>
                          <Badge className={getPriorityColor(report.priority)}>
                            {report.priority}
                          </Badge>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Reporter:</span> {report.reporterEmail} | 
                          <span className="font-medium ml-2">Reported User:</span> {report.reportedUserEmail}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{report.description}</p>
                        {report.resolution && (
                          <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
                            <span className="font-medium">Resolution:</span> {report.resolution}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-2 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={report.status}
                          onChange={(e) => updateReportStatus(report._id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="investigating">Investigating</option>
                          <option value="resolved">Resolved</option>
                          <option value="dismissed">Dismissed</option>
                        </select>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {report.status !== 'resolved' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              const reason = prompt("Enter reason for blocking:");
                              if (reason) blockUser(report.reportedUserId, reason);
                            }}
                            className="text-red-600"
                          >
                            Block User
                          </Button>
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

      {/* Blocked Users Tab */}
      {activeTab === 'blocked' && (
        <Card>
          <CardHeader>
            <CardTitle>Blocked Users</CardTitle>
          </CardHeader>
          <CardContent>
            {blockedUsers.length === 0 ? (
              <div className="text-center py-8">
                <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No blocked users found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {blockedUsers.map((user) => (
                  <div key={user._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{user.userName}</h3>
                        <div className="text-sm text-gray-600">
                          Email: {user.userEmail}
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          <span className="font-medium">Reason:</span> {user.reason}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          Blocked: {new Date(user.blockedAt).toLocaleDateString()} by {user.blockedBy}
                          {user.expiresAt && (
                            <span> | Expires: {new Date(user.expiresAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={user.isActive ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                          {user.isActive ? 'Blocked' : 'Expired'}
                        </Badge>
                        {user.isActive && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => unblockUser(user._id)}
                            className="text-green-600"
                          >
                            Unblock
                          </Button>
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

      {/* Settings Tab */}
      {activeTab === 'settings' && settings && (
        <Card>
          <CardHeader>
            <CardTitle>Safety Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Report Threshold</div>
                  {isEditing ? (
                    <Input
                      type="number"
                      defaultValue={settings.reportThreshold}
                      onBlur={(e) => updateSettings({ reportThreshold: parseInt(e.target.value) })}
                    />
                  ) : (
                    <p className="text-gray-900">{settings.reportThreshold} reports</p>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Auto Block Threshold</div>
                  {isEditing ? (
                    <Input
                      type="number"
                      defaultValue={settings.autoBlockThreshold}
                      onBlur={(e) => updateSettings({ autoBlockThreshold: parseInt(e.target.value) })}
                    />
                  ) : (
                    <p className="text-gray-900">{settings.autoBlockThreshold} reports</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="autoModeration"
                    checked={settings.autoModerationEnabled}
                    onChange={(e) => updateSettings({ autoModerationEnabled: e.target.checked })}
                    disabled={!isEditing}
                  />
                  <label htmlFor="autoModeration" className="text-sm text-gray-900">
                    Enable automatic moderation
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="photoVerification"
                    checked={settings.requirePhotoVerification}
                    onChange={(e) => updateSettings({ requirePhotoVerification: e.target.checked })}
                    disabled={!isEditing}
                  />
                  <label htmlFor="photoVerification" className="text-sm text-gray-900">
                    Require photo verification
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="phoneVerification"
                    checked={settings.requirePhoneVerification}
                    onChange={(e) => updateSettings({ requirePhoneVerification: e.target.checked })}
                    disabled={!isEditing}
                  />
                  <label htmlFor="phoneVerification" className="text-sm text-gray-900">
                    Require phone verification
                  </label>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Safety Officer Email</div>
                {isEditing ? (
                  <Input
                    type="email"
                    defaultValue={settings.safetyOfficerEmail}
                    onBlur={(e) => updateSettings({ safetyOfficerEmail: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{settings.safetyOfficerEmail}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
