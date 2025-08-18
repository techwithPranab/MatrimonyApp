"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MessageCircle, MapPin, Calendar, GraduationCap, Briefcase, Camera, Search, Filter, SlidersHorizontal } from "lucide-react";

interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  height: number;
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
  compatibilityScore: number;
  matchReasons: string[];
  lastActiveAt: Date;
}

export default function SearchPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    ageRange: { min: 21, max: 35 },
    heightRange: { min: 150, max: 180 },
    religion: [] as string[],
    community: [] as string[],
    maritalStatus: [] as string[],
    education: [] as string[],
    profession: [] as string[],
    location: { country: "", state: "", city: "" },
    diet: [] as string[],
    smoking: [] as string[],
    drinking: [] as string[],
    hasPhotos: true,
    isVerified: false,
    page: 1,
    limit: 20,
    sortBy: "lastActiveAt",
    sortOrder: "desc",
  });

  const searchProfiles = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/profiles/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchFilters),
      });

      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatHeight = (height: number) => {
    const feet = Math.floor(height / 30.48);
    const inches = Math.round((height % 30.48) / 2.54);
    return `${feet}'${inches}"`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Find Your Match</h1>
              <Badge variant="secondary" className="text-sm">
                {profiles.length} profiles found
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
              <Button onClick={searchProfiles} disabled={loading} className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Search Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Age Range */}
                  <div>
                    <label htmlFor="age-min" className="text-sm font-medium text-gray-700 mb-2 block">
                      Age Range
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="age-min"
                        type="number"
                        placeholder="Min"
                        value={searchFilters.ageRange.min}
                        onChange={(e) =>
                          setSearchFilters({
                            ...searchFilters,
                            ageRange: { ...searchFilters.ageRange, min: parseInt(e.target.value) },
                          })
                        }
                      />
                      <Input
                        id="age-max"
                        type="number"
                        placeholder="Max"
                        value={searchFilters.ageRange.max}
                        onChange={(e) =>
                          setSearchFilters({
                            ...searchFilters,
                            ageRange: { ...searchFilters.ageRange, max: parseInt(e.target.value) },
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Religion */}
                  <div>
                    <label htmlFor="religion-select" className="text-sm font-medium text-gray-700 mb-2 block">
                      Religion
                    </label>
                    <Select>
                      <SelectTrigger id="religion-select">
                        <SelectValue placeholder="Select religion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hindu">Hindu</SelectItem>
                        <SelectItem value="muslim">Muslim</SelectItem>
                        <SelectItem value="christian">Christian</SelectItem>
                        <SelectItem value="sikh">Sikh</SelectItem>
                        <SelectItem value="buddhist">Buddhist</SelectItem>
                        <SelectItem value="jain">Jain</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location-city" className="text-sm font-medium text-gray-700 mb-2 block">
                      Location
                    </label>
                    <div className="space-y-2">
                      <Input
                        id="location-city"
                        placeholder="City"
                        value={searchFilters.location.city}
                        onChange={(e) =>
                          setSearchFilters({
                            ...searchFilters,
                            location: { ...searchFilters.location, city: e.target.value },
                          })
                        }
                      />
                      <Input
                        id="location-state"
                        placeholder="State"
                        value={searchFilters.location.state}
                        onChange={(e) =>
                          setSearchFilters({
                            ...searchFilters,
                            location: { ...searchFilters.location, state: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 mb-2 block">
                      Sort By
                    </label>
                    <Select
                      value={searchFilters.sortBy}
                      onValueChange={(value) =>
                        setSearchFilters({ ...searchFilters, sortBy: value })
                      }
                    >
                      <SelectTrigger id="sort-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lastActiveAt">Last Active</SelectItem>
                        <SelectItem value="createdAt">Recently Joined</SelectItem>
                        <SelectItem value="age">Age</SelectItem>
                        <SelectItem value="height">Height</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Profile Grid */}
          <div className="flex-1">
            {loading && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <Card key={`loading-card-${i}`} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-t-lg" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-3 bg-gray-200 rounded mb-4" />
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded" />
                        <div className="h-3 bg-gray-200 rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {!loading && profiles.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {profiles.map((profile) => (
                  <Card
                    key={profile._id}
                    className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => router.push(`/profile/${profile._id}`)}
                  >
                    <div className="relative">
                      <div className="aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden">
                        {profile.photos && profile.photos.length > 0 ? (
                          <img
                            src={profile.photos[0]}
                            alt={profile.firstName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-500 text-white">
                          {profile.compatibilityScore}% Match
                        </Badge>
                      </div>
                      <div className="absolute top-3 left-3 flex gap-1">
                        {profile.photos && profile.photos.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Camera className="w-3 h-3 mr-1" />
                            {profile.photos.length}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {profile.firstName} {profile.lastName?.charAt(0)}.
                          </h3>
                          <p className="text-gray-600 text-sm flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {profile.age} years • {formatHeight(profile.height)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          {profile.education}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {profile.profession}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {profile.city}, {profile.state}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        <Badge variant="outline" className="text-xs">
                          {profile.religion}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {profile.community}
                        </Badge>
                        {profile.matchReasons?.map((reason) => (
                          <Badge key={reason} variant="secondary" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle interest
                          }}
                        >
                          <Heart className="w-4 h-4" />
                          Interest
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/chat/${profile._id}`);
                          }}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {!loading && profiles.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search filters to find more matches.
                </p>
                <Button onClick={searchProfiles}>Search Again</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
