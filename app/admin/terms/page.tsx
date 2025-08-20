"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Save,
  Edit,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Clock,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface TermsSection {
  _id: string;
  title: string;
  content: string;
  order: number;
  isVisible: boolean;
  subsections?: TermsSubsection[];
  createdAt: string;
  updatedAt: string;
}

interface TermsSubsection {
  _id: string;
  title: string;
  content: string;
  order: number;
}

interface TermsDocument {
  _id: string;
  title: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  isActive: boolean;
  sections: TermsSection[];
  metadata: {
    updatedBy: string;
    changeNotes: string;
  };
}

export default function TermsPage() {
  const [termsDocument, setTermsDocument] = useState<TermsDocument | null>(null);
  const [versions, setVersions] = useState<TermsDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [currentRes, versionsRes] = await Promise.all([
        fetch('/api/admin/legal/terms/current'),
        fetch('/api/admin/legal/terms/versions')
      ]);

      const currentData = await currentRes.json();
      const versionsData = await versionsRes.json();

      setTermsDocument(currentData);
      setVersions(Array.isArray(versionsData) ? versionsData : []);
    } catch (error) {
      console.error("Failed to fetch terms data:", error);
      setVersions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTermsDocument = async (data: Partial<TermsDocument>) => {
    try {
      await fetch('/api/admin/legal/terms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchData();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save terms document:", error);
    }
  };

  const createNewVersion = async () => {
    const version = prompt("Enter version number:");
    const changeNotes = prompt("Enter change notes:");
    if (!version || !changeNotes) return;

    try {
      await fetch('/api/admin/legal/terms/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          version, 
          metadata: { changeNotes } 
        }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to create new version:", error);
    }
  };

  const addSection = async () => {
    const title = prompt("Enter section title:");
    if (!title) return;

    try {
      await fetch('/api/admin/legal/terms/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title,
          content: "",
          order: (termsDocument?.sections.length || 0) + 1
        }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to add section:", error);
    }
  };

  const updateSection = async (sectionId: string, data: Partial<TermsSection>) => {
    try {
      await fetch(`/api/admin/legal/terms/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchData();
      setEditingSection(null);
    } catch (error) {
      console.error("Failed to update section:", error);
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    try {
      await fetch(`/api/admin/legal/terms/sections/${sectionId}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (error) {
      console.error("Failed to delete section:", error);
    }
  };

  const toggleSectionVisibility = async (sectionId: string, isVisible: boolean) => {
    try {
      await fetch(`/api/admin/legal/terms/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !isVisible }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to toggle section visibility:", error);
    }
  };

  const toggleSectionExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading terms and conditions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Terms & Conditions Management</h2>
          <p className="text-gray-600">Manage legal terms, conditions, and policies</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={() => setShowVersionHistory(!showVersionHistory)} variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            {showVersionHistory ? 'Hide' : 'Show'} Versions
          </Button>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={createNewVersion}>
            <Plus className="h-4 w-4 mr-2" />
            New Version
          </Button>
          <Button onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Mode'}
          </Button>
        </div>
      </div>

      {/* Current Document Info */}
      {termsDocument && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Current Terms Document
              </CardTitle>
              <Badge className={termsDocument.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {termsDocument.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Title</div>
                {isEditing ? (
                  <Input
                    defaultValue={termsDocument.title}
                    onBlur={(e) => saveTermsDocument({ title: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{termsDocument.title}</p>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Version</div>
                {isEditing ? (
                  <Input
                    defaultValue={termsDocument.version}
                    onBlur={(e) => saveTermsDocument({ version: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{termsDocument.version}</p>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Effective Date</div>
                {isEditing ? (
                  <Input
                    type="date"
                    defaultValue={termsDocument.effectiveDate}
                    onBlur={(e) => saveTermsDocument({ effectiveDate: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">
                    {new Date(termsDocument.effectiveDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date(termsDocument.lastUpdated).toLocaleString()} 
              {termsDocument.metadata.updatedBy && ` by ${termsDocument.metadata.updatedBy}`}
            </div>
            {termsDocument.metadata.changeNotes && (
              <div className="text-sm text-gray-600 mt-2">
                Change notes: {termsDocument.metadata.changeNotes}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Version History */}
      {showVersionHistory && (
        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
          </CardHeader>
          <CardContent>
            {versions.length === 0 ? (
              <p className="text-gray-500">No version history available</p>
            ) : (
              <div className="space-y-3">
                {versions.map((version) => (
                  <div key={version._id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          Version {version.version}
                        </div>
                        <div className="text-sm text-gray-600">
                          Effective: {new Date(version.effectiveDate).toLocaleDateString()}
                        </div>
                        {version.metadata.changeNotes && (
                          <div className="text-sm text-gray-500 mt-1">
                            {version.metadata.changeNotes}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={version.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {version.isActive ? 'Active' : 'Archived'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Document Sections</CardTitle>
            {isEditing && (
              <Button onClick={addSection} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!termsDocument || termsDocument.sections.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No sections found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {termsDocument.sections.map((section) => (
                <div key={section._id} className="border rounded-lg">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSectionExpanded(section._id)}
                        >
                          {expandedSections.has(section._id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        <div className="flex-1">
                          {editingSection === section._id ? (
                            <Input
                              defaultValue={section.title}
                              onBlur={(e) => updateSection(section._id, { title: e.target.value })}
                              className="mb-2"
                            />
                          ) : (
                            <h3 className="font-medium text-gray-900">{section.title}</h3>
                          )}
                          <div className="text-sm text-gray-500">
                            Order: {section.order} | Updated: {new Date(section.updatedAt).toLocaleDateString()}
                          </div>
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
                              onClick={() => setEditingSection(editingSection === section._id ? null : section._id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleSectionVisibility(section._id, section.isVisible)}
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

                    {expandedSections.has(section._id) && (
                      <div className="mt-4 pl-8">
                        {editingSection === section._id ? (
                          <div className="space-y-3">
                            <Textarea
                              defaultValue={section.content}
                              rows={6}
                              onBlur={(e) => updateSection(section._id, { content: e.target.value })}
                            />
                            <Button onClick={() => setEditingSection(null)} size="sm">
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Actions */}
      {termsDocument && (
        <Card>
          <CardHeader>
            <CardTitle>Document Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => saveTermsDocument({ isActive: !termsDocument.isActive })}
                variant={termsDocument.isActive ? "destructive" : "default"}
              >
                {termsDocument.isActive ? 'Deactivate' : 'Activate'} Document
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview Public View
              </Button>
              <Button variant="outline">
                Export to PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
