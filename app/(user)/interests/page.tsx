"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Check,
  X,
  Clock,
  ArrowLeft,
} from "lucide-react";

interface Interest {
  _id: string;
  fromUserId: {
    _id: string;
    firstName: string;
    lastName: string;
    photos: string[];
  };
  toUserId: {
    _id: string;
    firstName: string;
    lastName: string;
    photos: string[];
  };
  message: string;
  status: "pending" | "accepted" | "declined";
  sentAt: Date;
}

export default function InterestsPage() {
  const router = useRouter();
  const [interests, setInterests] = useState<{
    received: Interest[];
    sent: Interest[];
  }>({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await fetch("/api/interests");
        if (response.ok) {
          const data = await response.json();
          setInterests(data);
        }
      } catch (error) {
        console.error("Error fetching interests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  const handleAcceptInterest = async (interestId: string) => {
    try {
      const response = await fetch(`/api/interests/${interestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "accepted" }),
      });

      if (response.ok) {
        setInterests((prev) => ({
          ...prev,
          received: prev.received.map((interest) =>
            interest._id === interestId
              ? { ...interest, status: "accepted" }
              : interest
          ),
        }));
      }
    } catch (error) {
      console.error("Error accepting interest:", error);
    }
  };

  const handleDeclineInterest = async (interestId: string) => {
    try {
      const response = await fetch(`/api/interests/${interestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "declined" }),
      });

      if (response.ok) {
        setInterests((prev) => ({
          ...prev,
          received: prev.received.map((interest) =>
            interest._id === interestId
              ? { ...interest, status: "declined" }
              : interest
          ),
        }));
      }
    } catch (error) {
      console.error("Error declining interest:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-500 text-white flex items-center gap-1">
            <Check className="w-3 h-3" />
            Accepted
          </Badge>
        );
      case "declined":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X className="w-3 h-3" />
            Declined
          </Badge>
        );
      default:
        return null;
    }
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
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Interests & Connections
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "received"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("received")}
          >
            Received ({interests.received.length})
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "sent"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("sent")}
          >
            Sent ({interests.sent.length})
          </button>
        </div>

        {/* Interest Lists */}
        <div className="space-y-6">
          {activeTab === "received" ? (
            interests.received.length > 0 ? (
              interests.received.map((interest) => (
                <Card key={interest._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={interest.fromUserId.photos?.[0]}
                            alt={`${interest.fromUserId.firstName} ${interest.fromUserId.lastName}`}
                          />
                          <AvatarFallback className="text-lg">
                            {interest.fromUserId.firstName.charAt(0)}
                            {interest.fromUserId.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {interest.fromUserId.firstName}{" "}
                              {interest.fromUserId.lastName}
                            </h3>
                            {getStatusBadge(interest.status)}
                          </div>
                          <p className="text-gray-600 mb-3">{interest.message}</p>
                          <p className="text-sm text-gray-500">
                            Sent on {formatDate(interest.sentAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {interest.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeclineInterest(interest._id)}
                              className="flex items-center gap-1"
                            >
                              <X className="w-4 h-4" />
                              Decline
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptInterest(interest._id)}
                              className="flex items-center gap-1"
                            >
                              <Check className="w-4 h-4" />
                              Accept
                            </Button>
                          </>
                        )}
                        {interest.status === "accepted" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              router.push(`/chat/${interest.fromUserId._id}`)
                            }
                            className="flex items-center gap-1"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Chat
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No interests received yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    When someone shows interest in your profile, it will appear here.
                  </p>
                  <Button onClick={() => router.push("/search")}>
                    Browse Profiles
                  </Button>
                </CardContent>
              </Card>
            )
          ) : interests.sent.length > 0 ? (
            interests.sent.map((interest) => (
              <Card key={interest._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={interest.toUserId.photos?.[0]}
                          alt={`${interest.toUserId.firstName} ${interest.toUserId.lastName}`}
                        />
                        <AvatarFallback className="text-lg">
                          {interest.toUserId.firstName.charAt(0)}
                          {interest.toUserId.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {interest.toUserId.firstName}{" "}
                            {interest.toUserId.lastName}
                          </h3>
                          {getStatusBadge(interest.status)}
                        </div>
                        <p className="text-gray-600 mb-3">{interest.message}</p>
                        <p className="text-sm text-gray-500">
                          Sent on {formatDate(interest.sentAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {interest.status === "accepted" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            router.push(`/chat/${interest.toUserId._id}`)
                          }
                          className="flex items-center gap-1"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Chat
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No interests sent yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Browse profiles and send interests to connect with people you like.
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
