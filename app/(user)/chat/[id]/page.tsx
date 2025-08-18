"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// ...existing code...
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Image as ImageIcon,
  Smile,
  Paperclip,
} from "lucide-react";

interface Message {
  _id: string;
  content: string;
  senderId: string;
  receiverId: string;
  messageType: "text" | "image" | "file";
  timestamp: Date;
  isRead: boolean;
}

interface ChatUser {
  _id: string;
  firstName: string;
  lastName: string;
  photos: string[];
  isOnline: boolean;
  lastSeen: Date;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        // Fetch chat user info
        const userResponse = await fetch(`/api/users/${params.id}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setChatUser(userData.user);
        }

        // Fetch messages
        const messagesResponse = await fetch(`/api/chats/${params.id}`);
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData.messages);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id && session) {
      fetchChatData();
    }
  }, [params.id, session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch("/api/chats/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: params.id,
          content: newMessage,
          messageType: "text",
        }),
      });

      if (response.ok) {
        const messageData = await response.json();
        setMessages((prev) => [...prev, messageData.message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!chatUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-600 mb-4">The user you&apos;re trying to chat with doesn&apos;t exist.</p>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={chatUser.photos?.[0]} 
                alt={`${chatUser.firstName} ${chatUser.lastName}`}
              />
              <AvatarFallback>
                {chatUser.firstName.charAt(0)}{chatUser.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900">
                {chatUser.firstName} {chatUser.lastName}
              </h2>
              <div className="flex items-center gap-2">
                {chatUser.isOnline ? (
                  <Badge variant="secondary" className="text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Online
                  </Badge>
                ) : (
                  <p className="text-xs text-gray-500">
                    Last seen {formatLastSeen(chatUser.lastSeen)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage 
                  src={chatUser.photos?.[0]} 
                  alt={`${chatUser.firstName} ${chatUser.lastName}`}
                />
                <AvatarFallback className="text-lg">
                  {chatUser.firstName.charAt(0)}{chatUser.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start a conversation with {chatUser.firstName}
            </h3>
            <p className="text-gray-600 mb-4">
              Send a message to break the ice and get to know each other better.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === session?.user?.id;
            return (
              <div
                key={message._id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end gap-2 max-w-xs lg:max-w-md">
                  {!isOwnMessage && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage 
                        src={chatUser.photos?.[0]} 
                        alt={`${chatUser.firstName} ${chatUser.lastName}`}
                      />
                      <AvatarFallback className="text-xs">
                        {chatUser.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      isOwnMessage
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-gray-900 border rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t px-4 py-3">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm">
            <ImageIcon className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="border-0 focus-visible:ring-0 bg-gray-50"
              disabled={sending}
            />
          </div>
          <Button type="button" variant="ghost" size="sm">
            <Smile className="w-4 h-4" />
          </Button>
          <Button 
            type="submit" 
            size="sm" 
            disabled={!newMessage.trim() || sending}
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
