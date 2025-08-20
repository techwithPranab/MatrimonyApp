"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  MapPin,
  Briefcase,
  User,
  Camera,
  Shield,
  ArrowLeft,
  Share,
  MoreVertical,
  Flag,
} from "lucide-react";

interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  height: number;
  weight: number;
  religion: string;
  community: string;
  education: string;
  profession: string;
  city: string;
  state: string;
  country: string;
  photos: string[];
  bio: string;
  maritalStatus: string;
  dateOfBirth: string;
  motherTongue: string;
  diet: string;
  smoking: string;
  drinking: string;
  interests: string[];
  familyInfo: {
    fatherOccupation: string;
    motherOccupation: string;
    siblings: number;
    familyType: string;
    familyValues: string;
  };
  partnerPreferences: {
    ageRange: { min: number; max: number };
    heightRange: { min: number; max: number };
    education: string[];
    profession: string[];
    location: string[];
    maritalStatus: string[];
  };
  verification: {
    email: boolean;
    phone: boolean;
    governmentId: boolean;
  };
  lastActiveAt: Date;
  createdAt: Date;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
        } else {
          router.push("/search");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push("/search");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProfile();
    }
  }, [params.id, router]);

  const formatHeight = (height: number) => {
    const feet = Math.floor(height / 30.48);
    const inches = Math.round((height % 30.48) / 2.54);
    return `${feet}'${inches}"`;
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSendInterest = async () => {
    try {
      const response = await fetch("/api/interests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId: profile?._id,
          message: "I'm interested in getting to know you better!",
        }),
      });

      if (response.ok) {
        alert("Interest sent successfully!");
      }
    } catch (error) {
      console.error("Error sending interest:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h2>
          <p className="text-gray-600 mb-4">The profile you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push("/search")}>Back to Search</Button>
        </div>
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
                {profile.firstName} {profile.lastName?.charAt(0)}.
              </h1>
              <div className="flex items-center gap-2">
                {profile.verification.email && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Photo Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden relative">
                  {profile.photos && profile.photos.length > 0 ? (
                    <>
                      <Image
                        src={profile.photos[currentPhotoIndex]}
                        alt={`${profile.firstName}`}
                        width={400}
                        height={500}
                        className="w-full h-full object-cover"
                      />
                      {profile.photos.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {profile.photos.map((photo, index) => (
                            <button
                              key={`photo-${index}-${photo}`}
                              className={`w-2 h-2 rounded-full ${
                                index === currentPhotoIndex ? "bg-white" : "bg-white/50"
                              }`}
                              onClick={() => setCurrentPhotoIndex(index)}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-24 h-24 text-gray-400" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bio Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>About {profile.firstName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {profile.bio || "No bio available"}
                </p>
              </CardContent>
            </Card>

            {/* Family Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Family Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Father&apos;s Occupation</p>
                    <p className="text-gray-900">{profile.familyInfo?.fatherOccupation || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mother&apos;s Occupation</p>
                    <p className="text-gray-900">{profile.familyInfo?.motherOccupation || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Siblings</p>
                    <p className="text-gray-900">{profile.familyInfo?.siblings || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Family Type</p>
                    <p className="text-gray-900">{profile.familyInfo?.familyType || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Info Sidebar */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-gray-900">{calculateAge(profile.dateOfBirth)} years</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Height</p>
                  <p className="text-gray-900">{formatHeight(profile.height)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Marital Status</p>
                  <p className="text-gray-900">{profile.maritalStatus}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Mother Tongue</p>
                  <p className="text-gray-900">{profile.motherTongue}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Religion</p>
                  <p className="text-gray-900">{profile.religion}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Community</p>
                  <p className="text-gray-900">{profile.community}</p>
                </div>
              </CardContent>
            </Card>

            {/* Professional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Education</p>
                  <p className="text-gray-900">{profile.education}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Profession</p>
                  <p className="text-gray-900">{profile.profession}</p>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900">
                  {profile.city}, {profile.state}, {profile.country}
                </p>
              </CardContent>
            </Card>

            {/* Lifestyle */}
            <Card>
              <CardHeader>
                <CardTitle>Lifestyle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Diet</p>
                  <p className="text-gray-900">{profile.diet}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Smoking</p>
                  <p className="text-gray-900">{profile.smoking}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Drinking</p>
                  <p className="text-gray-900">{profile.drinking}</p>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full" onClick={handleSendInterest}>
                <Heart className="w-4 h-4 mr-2" />
                Send Interest
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/chat/${profile._id}`)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full">
                <Flag className="w-4 h-4 mr-2" />
                Report Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
