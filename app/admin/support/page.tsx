"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

interface SupportTicket {
  _id: string;
  ticketNumber: string;
  userId: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignedTo?: string;
  assignedAt?: Date;
  createdAt: Date;
  messages: {
    senderId: string;
    senderType: 'user' | 'admin';
    message: string;
    timestamp: Date;
    isInternal?: boolean;
  }[];
  tags: string[];
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [replyMessage, setReplyMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterCategory, filterPriority, searchTerm]);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterCategory !== "all") params.append("category", filterCategory);
      if (filterPriority !== "all") params.append("priority", filterPriority);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/admin/support?${params}`);
      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketAction = async (ticketId: string, action: string, data?: Record<string, unknown>) => {
    try {
      const response = await fetch(`/api/admin/support/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data }),
      });

      if (response.ok) {
        fetchTickets();
        if (selectedTicket && selectedTicket._id === ticketId) {
          const updatedTicket = await response.json();
          setSelectedTicket(updatedTicket.ticket);
        }
      }
    } catch (error) {
      console.error(`Failed to ${action} ticket:`, error);
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      await handleTicketAction(selectedTicket._id, 'reply', {
        message: replyMessage,
        isInternal
      });
      setReplyMessage("");
      setIsInternal(false);
    } catch (error) {
      console.error("Failed to send reply:", error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      case 'escalated': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return Clock;
      case 'in_progress': return AlertTriangle;
      case 'resolved': return CheckCircle;
      case 'closed': return XCircle;
      case 'escalated': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600">Manage customer support requests and inquiries</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="escalated">Escalated</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="profile">Profile</SelectItem>
                      <SelectItem value="matching">Matching</SelectItem>
                      <SelectItem value="abuse">Abuse</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
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
                  <Button onClick={fetchTickets} variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                  <span className="text-sm text-gray-600">
                    {tickets.length} tickets found
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Tickets List */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading tickets...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => {
                  const StatusIcon = getStatusIcon(ticket.status);
                  return (
                    <Card 
                      key={ticket._id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTicket?._id === ticket._id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 rounded-full bg-blue-100">
                              <StatusIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                                <Badge 
                                  variant="secondary" 
                                  className={`${getPriorityColor(ticket.priority)} text-white text-xs`}
                                >
                                  {ticket.priority}
                                </Badge>
                                <Badge 
                                  variant="secondary" 
                                  className={`${getStatusColor(ticket.status)} text-white text-xs`}
                                >
                                  {ticket.status}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {ticket.description}
                              </p>
                              
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>{ticket.ticketNumber}</span>
                                <span>{ticket.category}</span>
                                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                <span>{ticket.messages.length} messages</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ticket Details */}
          <div className="lg:col-span-1">
            {selectedTicket ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedTicket.subject}</span>
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(selectedTicket.status)} text-white`}
                    >
                      {selectedTicket.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ticket Info */}
                  <div className="space-y-2 text-sm">
                    <div><strong>Ticket:</strong> {selectedTicket.ticketNumber}</div>
                    <div><strong>Category:</strong> {selectedTicket.category}</div>
                    <div><strong>Priority:</strong> {selectedTicket.priority}</div>
                    <div><strong>Created:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTicketAction(selectedTicket._id, 'assign')}
                    >
                      Assign to Me
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTicketAction(selectedTicket._id, 'in_progress')}
                    >
                      In Progress
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleTicketAction(selectedTicket._id, 'resolve')}
                    >
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleTicketAction(selectedTicket._id, 'escalate')}
                    >
                      Escalate
                    </Button>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <h4 className="font-medium">Messages</h4>
                    {selectedTicket.messages.map((message) => (
                      <div 
                        key={message.timestamp.toString() + message.senderId} 
                        className={`p-3 rounded-lg text-sm ${
                          message.senderType === 'admin' 
                            ? 'bg-blue-50 ml-4' 
                            : 'bg-gray-50 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">
                            {message.senderType === 'admin' ? 'Admin' : 'User'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p>{message.message}</p>
                        {message.isInternal && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            Internal Note
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={isInternal}
                          onChange={(e) => setIsInternal(e.target.checked)}
                        />
                        <span>Internal note</span>
                      </label>
                      <Button
                        onClick={handleReply}
                        disabled={!replyMessage.trim()}
                        size="sm"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Ticket</h3>
                  <p className="text-gray-600">Choose a ticket from the list to view details and respond.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
