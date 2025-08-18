"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Search,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";

interface Chat {
  _id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  channelId: string;
  isActive: boolean;
  otherUser: {
    _id: string;
    firstName: string;
    lastName: string;
    photos: string[];
    isOnline: boolean;
    lastSeen: Date;
  };
  unreadCount: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("/api/chats");
        if (response.ok) {
          const data = await response.json();
          setChats(data.chats);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const filteredChats = chats.filter((chat) =>
    `${chat.otherUser.firstName} ${chat.otherUser.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const formatLastSeen = (lastSeen: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(lastSeen).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatLastMessage = (message: string, timestamp: Date) => {
    if (!message) return "";
    const time = new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { message: message.length > 50 ? `${message.substring(0, 50)}...` : message, time };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2 md:hidden"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              {chats.length > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {chats.length} conversation{chats.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="space-y-4">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => {
              const lastMsg = chat.lastMessage
                ? formatLastMessage(chat.lastMessage, chat.lastMessageAt!)
                : null;

              return (
                <Card
                  key={chat._id}
                  className="group hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => router.push(`/chat/${chat.otherUser._id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={chat.otherUser.photos?.[0]}
                              alt={`${chat.otherUser.firstName} ${chat.otherUser.lastName}`}
                            />
                            <AvatarFallback>
                              {chat.otherUser.firstName.charAt(0)}
                              {chat.otherUser.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {chat.otherUser.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {chat.otherUser.firstName} {chat.otherUser.lastName}
                            </h3>
                            {lastMsg && (
                              <span className="text-xs text-gray-500 ml-2">
                                {lastMsg.time}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {lastMsg
                                ? lastMsg.message
                                : chat.otherUser.isOnline
                                ? "Online"
                                : `Last seen ${formatLastSeen(chat.otherUser.lastSeen)}`}
                            </p>
                            {chat.unreadCount > 0 && (
                              <Badge className="bg-blue-500 text-white text-xs ml-2">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle voice call
                          }}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle video call
                          }}
                        >
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle more options
                          }}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : searchQuery ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No conversations found
                </h3>
                <p className="text-gray-600">
                  No conversations match your search query &quot;{searchQuery}&quot;
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start a conversation by browsing profiles and sending interests.
                </p>
                <Button onClick={() => router.push("/search")}>
                  Browse Profiles
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
