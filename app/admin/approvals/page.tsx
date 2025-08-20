"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Clock,
  User,
  FileText,
  AlertTriangle
} from "lucide-react";

interface ProfileData {
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  photos: string[];
  documents: string[];
  [key: string]: unknown;
}

interface PendingApproval {
  _id: string;
  userId: string;
  profileData: ProfileData;
  status: string;
  submissionType: string;
  priority: string;
  flags: string[];
  createdAt: string;
  verificationChecks: {
    emailVerified: boolean;
    phoneVerified: boolean;
    documentsVerified: boolean;
    photoVerified: boolean;
    manualReviewRequired: boolean;
  };
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    fetchApprovals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterType, filterPriority, searchTerm]);

  const fetchApprovals = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterType !== "all") params.append("type", filterType);
      if (filterPriority !== "all") params.append("priority", filterPriority);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/admin/approvals?${params}`);
      const data = await response.json();
      setApprovals(data.approvals || []);
    } catch (error) {
      console.error("Failed to fetch approvals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (approvalId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      const response = await fetch(`/api/admin/approvals/${approvalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });

      if (response.ok) {
        fetchApprovals(); // Refresh the list
      }
    } catch (error) {
      console.error(`Failed to ${action} approval:`, error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_registration': return User;
      case 'profile_update': return FileText;
      case 'photo_upload': return Eye;
      case 'document_upload': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">User Approvals</h1>
          <p className="text-gray-600">Review and approve pending user submissions</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
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
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="new_registration">New Registration</SelectItem>
                  <SelectItem value="profile_update">Profile Update</SelectItem>
                  <SelectItem value="photo_upload">Photo Upload</SelectItem>
                  <SelectItem value="document_upload">Document Upload</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <Button onClick={fetchApprovals} variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <span className="text-sm text-gray-600">
                {approvals.length} items found
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Approvals List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading approvals...</p>
          </div>
        ) : approvals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
              <p className="text-gray-600">All submissions have been reviewed.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => {
              const TypeIcon = getTypeIcon(approval.submissionType);
              return (
                <Card key={approval._id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-full bg-blue-100">
                          <TypeIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {typeof approval.profileData?.firstName === 'string' ? approval.profileData.firstName : ''} {typeof approval.profileData?.lastName === 'string' ? approval.profileData.lastName : ''}
                            </h3>
                            <Badge 
                              variant="secondary" 
                              className={`${getPriorityColor(approval.priority)} text-white`}
                            >
                              {approval.priority}
                            </Badge>
                            {approval.flags.length > 0 && (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Flagged
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <span className="font-medium">Type:</span> {approval.submissionType.replace('_', ' ')}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span> {approval.profileData?.email}
                            </div>
                            <div>
                              <span className="font-medium">Age:</span> {approval.profileData?.age || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Location:</span> {typeof approval.profileData?.city === 'string' ? approval.profileData.city : ''}
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-xs">
                            <Badge variant={approval.verificationChecks.emailVerified ? "default" : "secondary"}>
                              Email: {approval.verificationChecks.emailVerified ? "✓" : "✗"}
                            </Badge>
                            <Badge variant={approval.verificationChecks.phoneVerified ? "default" : "secondary"}>
                              Phone: {approval.verificationChecks.phoneVerified ? "✓" : "✗"}
                            </Badge>
                            <Badge variant={approval.verificationChecks.documentsVerified ? "default" : "secondary"}>
                              Docs: {approval.verificationChecks.documentsVerified ? "✓" : "✗"}
                            </Badge>
                            <Badge variant={approval.verificationChecks.photoVerified ? "default" : "secondary"}>
                              Photo: {approval.verificationChecks.photoVerified ? "✓" : "✗"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/admin/users/${approval.userId}`, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproval(approval._id, 'approve')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            const reason = prompt("Reason for rejection:");
                            if (reason) handleApproval(approval._id, 'reject', reason);
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
