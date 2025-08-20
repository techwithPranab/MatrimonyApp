"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  UserPlus, 
  Search,
  Shield,
  Edit,
  Trash2,
  Settings,
  Clock,
  Eye
} from "lucide-react";

type AdminRole = 'super_admin' | 'data_manager' | 'support_agent' | 'moderator';

interface Admin {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  permissions: string[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  loginHistory: {
    timestamp: string;
    ipAddress: string;
    userAgent: string;
    location?: string;
  }[];
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: ''
  });
  const [newAdmin, setNewAdmin] = useState<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: AdminRole;
    permissions: string[];
  }>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'support_agent',
    permissions: []
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '20',
          ...Object.fromEntries(Object.entries(filters).filter(([key, v]) => v))
        });

        const response = await fetch(`/api/admin/admins?${params}`);
        const data = await response.json();
        setAdmins(data.admins || []);
        setTotalPages(data.pagination?.pages || 1);
      } catch (error) {
        console.error("Failed to fetch admin users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmins();
  }, [currentPage, filters]);

  const fetchAdmins = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`/api/admin/admins?${params}`);
      const data = await response.json();
      
      setAdmins(data.admins || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error("Failed to fetch admin users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAdmin = async () => {
    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewAdmin({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          role: 'support_agent',
          permissions: []
        });
        fetchAdmins();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create admin');
      }
    } catch (error) {
      console.error("Failed to create admin:", error);
      alert('Failed to create admin');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'data_manager': return 'bg-blue-100 text-blue-800';
      case 'support_agent': return 'bg-green-100 text-green-800';
      case 'moderator': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'data_manager': return 'Data Manager';
      case 'support_agent': return 'Support Agent';
      case 'moderator': return 'Moderator';
      default: return role;
    }
  };

  // Collapsible state (move above conditional)
  const [openSummary, setOpenSummary] = useState(true);
  const [openFilters, setOpenFilters] = useState(true);
  const [openTable, setOpenTable] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-600">Manage admin users and permissions</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Admin
        </Button>
      </div>

      {/* Collapsible Summary Cards */}
      <Card>
        <CardHeader className="flex items-center justify-between cursor-pointer select-none" onClick={() => setOpenSummary(!openSummary)}>
          <CardTitle className="flex items-center">
            {openSummary ? <Eye className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2 opacity-30" />}
            Summary
          </CardTitle>
          <span className="text-xs text-gray-500">{openSummary ? "Hide" : "Show"}</span>
        </CardHeader>
        {openSummary && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Admins
                    </CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {admins.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Active Admins
                    </CardTitle>
                    <Shield className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {admins.filter(admin => admin.isActive).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Super Admins
                    </CardTitle>
                    <Settings className="h-4 w-4 text-red-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {admins.filter(admin => admin.role === 'super_admin').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Recent Logins
                    </CardTitle>
                    <Clock className="h-4 w-4 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {admins.filter(admin => admin.lastLoginAt && 
                      new Date(admin.lastLoginAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Collapsible Filters */}
      <Card>
        <CardHeader className="flex items-center justify-between cursor-pointer select-none" onClick={() => setOpenFilters(!openFilters)}>
          <CardTitle className="flex items-center">
            {openFilters ? <Eye className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2 opacity-30" />}
            Filters
          </CardTitle>
          <span className="text-xs text-gray-500">{openFilters ? "Hide" : "Show"}</span>
        </CardHeader>
        {openFilters && (
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search admins..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
              <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="data_manager">Data Manager</SelectItem>
                  <SelectItem value="support_agent">Support Agent</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Collapsible Admin Table */}
      <Card>
        <CardHeader className="flex items-center justify-between cursor-pointer select-none" onClick={() => setOpenTable(!openTable)}>
          <CardTitle className="flex items-center">
            {openTable ? <Eye className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2 opacity-30" />}
            Admin Table
          </CardTitle>
          <span className="text-xs text-gray-500">{openTable ? "Hide" : "Show"}</span>
        </CardHeader>
        {openTable && (
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Last Login</th>
                    <th className="text-left p-3">Created</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium">
                          {admin.firstName} {admin.lastName}
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">
                        {admin.email}
                      </td>
                      <td className="p-3">
                        <Badge className={getRoleColor(admin.role)}>
                          {getRoleName(admin.role)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {admin.lastLoginAt 
                          ? new Date(admin.lastLoginAt).toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Admin</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  value={newAdmin.firstName}
                  onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                />
                <Input
                  placeholder="Last Name"
                  value={newAdmin.lastName}
                  onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                />
              </div>
              <Input
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              />
              <Input
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              />
              <Select value={newAdmin.role} onValueChange={(value: AdminRole) => setNewAdmin({ ...newAdmin, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="support_agent">Support Agent</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="data_manager">Data Manager</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={createAdmin}>
                Create Admin
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
