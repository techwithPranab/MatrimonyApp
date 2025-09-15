"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Flag,
  AlertTriangle,
  MessageSquare,
  User,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

interface ModerationItem {
  _id: string;
  userId: {
    name: string;
    email: string;
    profilePicture?: string;
  };
  contentType: 'profile' | 'message' | 'photo' | 'success_story';
  contentId: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  priority: number;
  violations: Array<{
    ruleId: string;
    ruleName: string;
    severity: string;
    action: string;
  }>;
  metadata?: Record<string, unknown>;
  reviewedBy?: {
    name: string;
    email: string;
  };
  reviewedAt?: string;
  createdAt: string;
}

export default function ModerationPage() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterContentType, setFilterContentType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, flagged: 0 });

  const fetchModerationItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterContentType !== "all") params.append("contentType", filterContentType);
      if (searchTerm) params.append("search", searchTerm);
      params.append("page", currentPage.toString());

      const response = await fetch(`/api/moderation?${params}`);
      const data = await response.json();
      setItems(data.items || []);
      setTotalPages(data.pagination?.pages || 1);
      setStats(data.stats || { pending: 0, approved: 0, rejected: 0, flagged: 0 });
    } catch (error) {
      console.error("Failed to fetch moderation items:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, filterContentType, currentPage, searchTerm]);

  useEffect(() => {
    fetchModerationItems();
  }, [fetchModerationItems]);

  const handleModerationAction = async (itemId: string, action: 'approve' | 'reject' | 'flag') => {
    try {
      const response = await fetch(`/api/moderation/${itemId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        fetchModerationItems(); // Refresh the list
      }
    } catch (error) {
      console.error(`Failed to ${action} item:`, error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'profile': return <User className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'photo': return <ImageIcon className="h-4 w-4" />;
      case 'success_story': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 5) return 'text-red-600';
    if (priority >= 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
          <p className="text-gray-600">Review and moderate user-generated content</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Check className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <X className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Flag className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Flagged</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.flagged}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by user or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterContentType} onValueChange={setFilterContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="profile">Profile</SelectItem>
                  <SelectItem value="message">Message</SelectItem>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="success_story">Success Story</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Button onClick={fetchModerationItems} variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <span className="text-sm text-gray-600">
                {items.length} items found
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Moderation Items List */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading moderation items...</p>
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Check className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items to moderate</h3>
              <p className="text-gray-600">All content has been reviewed.</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && items.length > 0 && (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item._id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                            {item.userId.name.charAt(0)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {item.userId.name}
                            </h3>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              {getContentTypeIcon(item.contentType)}
                              <span className="text-sm text-gray-600 capitalize">
                                {item.contentType.replace('_', ' ')}
                              </span>
                            </div>
                            <span className={`text-sm font-medium ${getPriorityColor(item.priority)}`}>
                              Priority: {item.priority}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-3">
                            {item.userId.email} • {new Date(item.createdAt).toLocaleDateString()}
                          </p>

                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-gray-900 whitespace-pre-wrap">
                              {item.content.length > 200 ? `${item.content.substring(0, 200)}...` : item.content}
                            </p>
                          </div>

                          {item.violations.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-red-700 mb-2">Violations:</h4>
                              <div className="space-y-1">
                                {item.violations.map((violation) => (
                                  <div key={violation.ruleId} className="flex items-center space-x-2 text-sm">
                                    <Badge variant="destructive" className="text-xs">
                                      {violation.severity}
                                    </Badge>
                                    <span className="text-gray-700">{violation.ruleName}</span>
                                    <span className="text-gray-500">({violation.action})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {item.reviewedBy && (
                            <p className="text-xs text-gray-500">
                              Reviewed by {item.reviewedBy.name} on {new Date(item.reviewedAt!).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/admin/moderation/${item._id}`, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {item.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleModerationAction(item._id, 'approve')}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleModerationAction(item._id, 'reject')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-orange-500 text-orange-600 hover:bg-orange-50"
                              onClick={() => handleModerationAction(item._id, 'flag')}
                            >
                              <Flag className="h-4 w-4 mr-1" />
                              Flag
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
