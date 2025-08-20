"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Info, 
  Save,
  Edit,
  Eye,
  RefreshCw,
  Users,
  Target,
  Award,
  Heart,
  Globe,
  Image as ImageIcon
} from "lucide-react";

interface AboutSection {
  _id: string;
  title: string;
  content: string;
  order: number;
  isVisible: boolean;
  updatedAt: string;
}

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  linkedIn?: string;
  twitter?: string;
  email?: string;
  order: number;
  isVisible: boolean;
}

interface CompanyStats {
  _id: string;
  totalUsers: number;
  successfulMatches: number;
  yearsInService: number;
  citiesCovered: number;
  updatedAt: string;
}

interface AboutPageData {
  mission: string;
  vision: string;
  values: string[];
  story: string;
  achievements: string[];
  updatedAt: string;
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [aboutRes, sectionsRes, teamRes, statsRes] = await Promise.all([
        fetch('/api/admin/about'),
        fetch('/api/admin/about/sections'),
        fetch('/api/admin/about/team'),
        fetch('/api/admin/about/stats')
      ]);

      const aboutData = await aboutRes.json();
      const sectionsData = await sectionsRes.json();
      const teamData = await teamRes.json();
      const statsData = await statsRes.json();

      setAboutData(aboutData);
      setSections(Array.isArray(sectionsData) ? sectionsData : []);
      setTeamMembers(Array.isArray(teamData) ? teamData : []);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch about data:", error);
      setSections([]);
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAboutData = async (data: Partial<AboutPageData>) => {
    try {
      await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchData();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save about data:", error);
    }
  };

  const updateSection = async (sectionId: string, data: Partial<AboutSection>) => {
    try {
      await fetch(`/api/admin/about/sections/${sectionId}`, {
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

  const toggleSectionVisibility = async (sectionId: string, isVisible: boolean) => {
    try {
      await fetch(`/api/admin/about/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !isVisible }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to toggle section visibility:", error);
    }
  };

  const updateStats = async (data: Partial<CompanyStats>) => {
    try {
      await fetch('/api/admin/about/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to update stats:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading about page data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">About Page Management</h2>
          <p className="text-gray-600">Manage company information, team, and statistics</p>
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

      {/* Company Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Company Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 flex items-center justify-center">
                  <Users className="h-6 w-6 mr-2" />
                  {stats.totalUsers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Users</div>
                {isEditing && (
                  <Input
                    type="number"
                    defaultValue={stats.totalUsers}
                    className="mt-2"
                    onBlur={(e) => updateStats({ totalUsers: parseInt(e.target.value) })}
                  />
                )}
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 flex items-center justify-center">
                  <Heart className="h-6 w-6 mr-2" />
                  {stats.successfulMatches.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">Successful Matches</div>
                {isEditing && (
                  <Input
                    type="number"
                    defaultValue={stats.successfulMatches}
                    className="mt-2"
                    onBlur={(e) => updateStats({ successfulMatches: parseInt(e.target.value) })}
                  />
                )}
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {stats.yearsInService}+
                </div>
                <div className="text-sm text-gray-600 mt-1">Years of Service</div>
                {isEditing && (
                  <Input
                    type="number"
                    defaultValue={stats.yearsInService}
                    className="mt-2"
                    onBlur={(e) => updateStats({ yearsInService: parseInt(e.target.value) })}
                  />
                )}
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 flex items-center justify-center">
                  <Globe className="h-6 w-6 mr-2" />
                  {stats.citiesCovered}
                </div>
                <div className="text-sm text-gray-600 mt-1">Cities Covered</div>
                {isEditing && (
                  <Input
                    type="number"
                    defaultValue={stats.citiesCovered}
                    className="mt-2"
                    onBlur={(e) => updateStats({ citiesCovered: parseInt(e.target.value) })}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* About Content */}
      {aboutData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  defaultValue={aboutData.mission}
                  rows={4}
                  onBlur={(e) => saveAboutData({ mission: e.target.value })}
                />
              ) : (
                <p className="text-gray-700">{aboutData.mission}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  defaultValue={aboutData.vision}
                  rows={4}
                  onBlur={(e) => saveAboutData({ vision: e.target.value })}
                />
              ) : (
                <p className="text-gray-700">{aboutData.vision}</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Company Story */}
      {aboutData && (
        <Card>
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                defaultValue={aboutData.story}
                rows={6}
                onBlur={(e) => saveAboutData({ story: e.target.value })}
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{aboutData.story}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Values & Achievements */}
      {aboutData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  {aboutData.values.map((value) => (
                    <Input
                      key={value}
                      defaultValue={value}
                      onBlur={(e) => {
                        const index = aboutData.values.indexOf(value);
                        const newValues = [...aboutData.values];
                        newValues[index] = e.target.value;
                        saveAboutData({ values: newValues });
                      }}
                    />
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {aboutData.values.map((value) => (
                    <li key={value} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {value}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  {aboutData.achievements.map((achievement) => (
                    <Input
                      key={achievement}
                      defaultValue={achievement}
                      onBlur={(e) => {
                        const index = aboutData.achievements.indexOf(achievement);
                        const newAchievements = [...aboutData.achievements];
                        newAchievements[index] = e.target.value;
                        saveAboutData({ achievements: newAchievements });
                      }}
                    />
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {aboutData.achievements.map((achievement) => (
                    <li key={achievement} className="flex items-center text-gray-700">
                      <Award className="w-4 h-4 text-yellow-500 mr-3" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Sections</CardTitle>
        </CardHeader>
        <CardContent>
          {sections.length === 0 ? (
            <div className="text-center py-8">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No additional sections found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section._id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {editingSection === section._id ? (
                        <div className="space-y-3">
                          <Input
                            defaultValue={section.title}
                            onBlur={(e) => updateSection(section._id, { title: e.target.value })}
                          />
                          <Textarea
                            defaultValue={section.content}
                            rows={4}
                            onBlur={(e) => updateSection(section._id, { content: e.target.value })}
                          />
                          <Button onClick={() => setEditingSection(null)} size="sm">
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-medium text-gray-900">{section.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                            {section.content}
                          </p>
                          <div className="text-xs text-gray-400 mt-2">
                            Order: {section.order} | Updated: {new Date(section.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={section.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {section.isVisible ? 'Visible' : 'Hidden'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingSection(section._id)}
                        disabled={editingSection === section._id}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleSectionVisibility(section._id, section.isVisible)}
                      >
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

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {teamMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No team members found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div key={member._id} className="border rounded-lg p-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.position}</p>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-3">{member.bio}</p>
                    <div className="flex items-center justify-center space-x-2 mt-3">
                      <Badge className={member.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {member.isVisible ? 'Visible' : 'Hidden'}
                      </Badge>
                      <Badge variant="outline">Order: {member.order}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
