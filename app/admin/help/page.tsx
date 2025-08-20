"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface HelpArticle {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface SupportTicket {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  message: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assignedTo?: string;
  responses: Array<{
    id: string;
    message: string;
    respondedBy: string;
    respondedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function HelpPage() {
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'articles' | 'faqs' | 'tickets'>('articles');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [articlesRes, faqsRes, ticketsRes] = await Promise.all([
        fetch('/api/admin/help/articles'),
        fetch('/api/admin/help/faqs'),
        fetch('/api/admin/help/tickets')
      ]);

      const articlesData = await articlesRes.json();
      const faqsData = await faqsRes.json();
      const ticketsData = await ticketsRes.json();

      setArticles(Array.isArray(articlesData) ? articlesData : []);
      setFaqs(Array.isArray(faqsData) ? faqsData : []);
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
    } catch (error) {
      console.error("Failed to fetch help data:", error);
      setArticles([]);
      setFaqs([]);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    // Form creation logic would go here
    console.log("Create new", activeTab);
  };

  const handleEdit = (item: HelpArticle | FAQItem | SupportTicket) => {
    // Edit form logic would go here
    console.log("Edit", activeTab, item);
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      await fetch(`/api/admin/help/${type}/${id}`, {
        method: 'DELETE'
      });
      fetchData();
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    }
  };

  const togglePublished = async (id: string, type: string, isPublished: boolean) => {
    try {
      await fetch(`/api/admin/help/${type}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished })
      });
      fetchData();
    } catch (error) {
      console.error(`Failed to update ${type}:`, error);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      await fetch(`/api/admin/help/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
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

  const filteredData = (): (HelpArticle | FAQItem | SupportTicket)[] => {
    switch (activeTab) {
      case 'articles':
        return articles.filter(article => 
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'faqs':
        return faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'tickets':
        return tickets.filter(ticket => 
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading help center data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Help Center Management</h2>
          <p className="text-gray-600">Manage articles, FAQs, and support tickets</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create {activeTab.slice(0, -1)}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <div className="text-sm text-gray-500">
              {articles.filter(a => a.isPublished).length} published
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faqs.length}</div>
            <div className="text-sm text-gray-500">
              {faqs.filter(f => f.isPublished).length} published
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {tickets.filter(t => t.status === 'open').length}
            </div>
            <div className="text-sm text-gray-500">
              {tickets.filter(t => t.status === 'pending').length} pending
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {articles.reduce((sum, a) => sum + a.views, 0)}
            </div>
            <div className="text-sm text-gray-500">article views</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['articles', 'faqs', 'tickets'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'articles' | 'faqs' | 'tickets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({filteredData().length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData().length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No {activeTab} found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'articles' && (
                <div className="grid gap-4">
                  {(filteredData() as HelpArticle[]).map((article) => (
                    <div key={article._id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{article.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {article.content.substring(0, 150)}...
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Category: {article.category}</span>
                            <span>Views: {article.views}</span>
                            <span>Helpful: {article.helpful}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={article.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {article.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(article)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => togglePublished(article._id, 'articles', article.isPublished)}
                          >
                            {article.isPublished ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(article._id, 'articles')}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'faqs' && (
                <div className="grid gap-4">
                  {(filteredData() as FAQItem[]).map((faq) => (
                    <div key={faq._id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{faq.question}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {faq.answer.substring(0, 150)}...
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Category: {faq.category}</span>
                            <span>Order: {faq.order}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={faq.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {faq.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(faq)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => togglePublished(faq._id, 'faqs', faq.isPublished)}
                          >
                            {faq.isPublished ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(faq._id, 'faqs')}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'tickets' && (
                <div className="grid gap-4">
                  {(filteredData() as SupportTicket[]).map((ticket) => (
                    <div key={ticket._id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            From: {ticket.userName} ({ticket.userEmail})
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {ticket.message.substring(0, 150)}...
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {ticket.responses.length} responses
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={ticket.status}
                            onChange={(e) => updateTicketStatus(ticket._id, e.target.value)}
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="open">Open</option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
