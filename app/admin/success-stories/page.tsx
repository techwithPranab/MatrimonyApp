"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Search, 
  Filter, 
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Calendar,
  Star
} from "lucide-react";

interface SuccessStory {
  id: string;
  coupleNames: string;
  title: string;
  story: string;
  weddingDate: string;
  location: string;
  images: string[];
  isPublished: boolean;
  isFeatured: boolean;
  userId1: string;
  userId2: string;
  matrimonyId1: string;
  matrimonyId2: string;
  submittedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    fetchSuccessStories();
  }, []);

  const fetchSuccessStories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/success-stories");
      const data = await response.json();
      if (Array.isArray(data)) {
        setStories(data);
      } else if (Array.isArray(data.stories)) {
        setStories(data.stories);
      } else {
        setStories([]);
      }
    } catch (error) {
      console.error("Failed to fetch success stories:", error);
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishStory = async (storyId: string, isPublished: boolean) => {
    try {
      await fetch(`/api/admin/success-stories/${storyId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished }),
      });
      fetchSuccessStories();
    } catch (error) {
      console.error("Failed to update story status:", error);
    }
  };

  const handleFeatureStory = async (storyId: string, isFeatured: boolean) => {
    try {
      await fetch(`/api/admin/success-stories/${storyId}/feature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured }),
      });
      fetchSuccessStories();
    } catch (error) {
      console.error("Failed to update featured status:", error);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm("Are you sure you want to delete this success story?")) return;
    
    try {
      await fetch(`/api/admin/success-stories/${storyId}`, {
        method: 'DELETE',
      });
      fetchSuccessStories();
    } catch (error) {
      console.error("Failed to delete story:", error);
    }
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = 
      story.coupleNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === "all" ||
      (selectedStatus === "published" && story.isPublished) ||
      (selectedStatus === "draft" && !story.isPublished) ||
      (selectedStatus === "featured" && story.isFeatured);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (story: SuccessStory) => {
    if (story.isFeatured) {
      return <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>;
    }
    if (story.isPublished) {
      return <Badge className="bg-green-100 text-green-800">Published</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading success stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Success Stories Management</h2>
          <p className="text-gray-600">Manage and moderate user success stories</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={fetchSuccessStories} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Story
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by couple names, title, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stories</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="featured">Featured</option>
            </select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stories.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stories.filter(s => s.isPublished).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stories.filter(s => s.isFeatured).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stories.filter(s => !s.isPublished).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Stories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Success Stories ({filteredStories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStories.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No success stories found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Couple</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Wedding Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Submitted</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStories.map((story) => (
                    <tr key={story.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{story.coupleNames}</div>
                          <div className="text-sm text-gray-500">
                            {story.matrimonyId1} & {story.matrimonyId2}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs">
                          <div className="font-medium text-gray-900 truncate">{story.title}</div>
                          <div className="text-sm text-gray-500 truncate">
                            {story.story.substring(0, 50)}...
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(story.weddingDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">{story.location}</div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(story)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-500">
                          {new Date(story.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleFeatureStory(story.id, !story.isFeatured)}
                            className={story.isFeatured ? "text-yellow-600" : "text-gray-600"}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handlePublishStory(story.id, !story.isPublished)}
                            className={story.isPublished ? "text-green-600" : "text-blue-600"}
                          >
                            {story.isPublished ? "Unpublish" : "Publish"}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteStory(story.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
