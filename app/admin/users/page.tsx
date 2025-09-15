"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  registrationDate: string;
  lastActiveAt: string;
  subscription: 'free' | 'premium' | 'gold';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  profileCompletion: number;
  totalViews: number;
  totalLikes: number;
  isActive: boolean;
  isSuspended: boolean;
  city?: string;
  state?: string;
  country?: string;
}

interface UserFilters {
  search: string;
  subscription: string;
  verificationStatus: string;
  isActive: string;
  isSuspended: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    subscription: '',
    verificationStatus: '',
    isActive: '',
    isSuspended: '',
    sortBy: 'registrationDate',
    sortOrder: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')),
      });

      const response = await fetch(`/api/admin/users?${queryParams}`, {
        headers: {
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN', // Replace with actual token
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalUsers(data.pagination?.totalUsers || 0);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Mock data for demonstration
      setUsers([
        {
          _id: '1',
          firstName: 'Rajesh',
          lastName: 'Kumar',
          email: 'rajesh.kumar@example.com',
          phone: '+91-9876543210',
          registrationDate: '2024-01-15T10:30:00Z',
          lastActiveAt: '2024-09-14T08:45:00Z',
          subscription: 'premium',
          verificationStatus: 'verified',
          profileCompletion: 95,
          totalViews: 1245,
          totalLikes: 87,
          isActive: true,
          isSuspended: false,
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
        },
        {
          _id: '2',
          firstName: 'Priya',
          lastName: 'Sharma',
          email: 'priya.sharma@example.com',
          phone: '+91-8765432109',
          registrationDate: '2024-02-20T14:20:00Z',
          lastActiveAt: '2024-09-13T19:30:00Z',
          subscription: 'gold',
          verificationStatus: 'verified',
          profileCompletion: 100,
          totalViews: 2156,
          totalLikes: 156,
          isActive: true,
          isSuspended: false,
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
        },
        // Add more mock users...
      ]);
      setTotalUsers(156);
      setTotalPages(8);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [filters]);

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'unsuspend' | 'verify' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        // Refresh users list
        fetchUsers(currentPage);
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  const getSubscriptionBadge = (subscription: string) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      premium: 'bg-blue-100 text-blue-800',
      gold: 'bg-yellow-100 text-yellow-800',
    };
    return colors[subscription as keyof typeof colors] || colors.free;
  };

  const getVerificationBadge = (status: string) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts, subscriptions, and verification status</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Users: {totalUsers.toLocaleString()}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              id="search-input"
              type="text"
              placeholder="Name or email..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="subscription-select" className="block text-sm font-medium text-gray-700 mb-1">Subscription</label>
            <select
              id="subscription-select"
              value={filters.subscription}
              onChange={(e) => handleFilterChange('subscription', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
              <option value="gold">Gold</option>
            </select>
          </div>

          <div>
            <label htmlFor="verification-select" className="block text-sm font-medium text-gray-700 mb-1">Verification</label>
            <select
              id="verification-select"
              value={filters.verificationStatus}
              onChange={(e) => handleFilterChange('verificationStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status-select"
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="registrationDate">Registration Date</option>
              <option value="lastActiveAt">Last Active</option>
              <option value="totalViews">Profile Views</option>
              <option value="totalLikes">Likes Received</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button onClick={() => fetchUsers(1)} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Subscription</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Verification</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Stats</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Last Active</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(() => {
                if (loading) {
                  return (
                    <tr>
                      <td colSpan={8} className="py-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      </td>
                    </tr>
                  );
                }
                
                if (users.length === 0) {
                  return (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-500">
                        No users found matching the filters.
                      </td>
                    </tr>
                  );
                }
                
                return users.map((user) => (
                  <tr key={user._id} className={`hover:bg-gray-50 ${user.isSuspended ? 'bg-red-50' : ''}`}>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Profile: {user.profileCompletion}%
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{user.email}</div>
                        {user.phone && (
                          <div className="text-gray-500">{user.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">
                        {user.city && user.state ? `${user.city}, ${user.state}` : 'Not specified'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getSubscriptionBadge(user.subscription)}>
                        {user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getVerificationBadge(user.verificationStatus)}>
                        {user.verificationStatus.charAt(0).toUpperCase() + user.verificationStatus.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{user.totalViews} views</div>
                        <div className="text-gray-500">{user.totalLikes} likes</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">
                        {new Date(user.lastActiveAt).toLocaleDateString()}
                      </div>
                      <div className={`text-xs ${user.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        {user.verificationStatus === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user._id, 'verify')}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user._id, 'reject')}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {!user.isSuspended ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user._id, 'suspend')}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user._id, 'unsuspend')}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            Unsuspend
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalUsers)} of {totalUsers} users
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => fetchUsers(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => fetchUsers(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              onClick={() => fetchUsers(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
