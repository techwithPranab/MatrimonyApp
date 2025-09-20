'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VerificationUpload from '@/components/verification/VerificationUpload';
import VerificationStatus from '@/components/verification/VerificationStatus';
import VerificationHistory from '@/components/verification/VerificationHistory';

interface VerificationRequest {
  _id: string;
  verificationType: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired';
  documents: {
    fileUrl: string;
    fileName: string;
    fileType: string;
    uploadedAt: string;
  }[];
  submittedData: Record<string, string | number | boolean | Date | null>;
  reviewNotes?: string;
  rejectionReason?: string;
  requestedAt: string;
  reviewedAt?: string;
  createdAt: string;
}

interface VerificationData {
  currentVerification: {
    email: boolean;
    phone: boolean;
    governmentId: boolean;
    education: boolean;
    profession: boolean;
  };
  verificationRequests: VerificationRequest[];
  profileId: string;
}

export default function VerificationPage() {
  const { status } = useSession();
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('status');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchVerificationData();
    }
  }, [status]);

  const fetchVerificationData = async () => {
    try {
      const response = await fetch('/api/verification');
      if (response.ok) {
        const data = await response.json();
        setVerificationData(data);
      }
    } catch (error) {
      console.error('Error fetching verification data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in to access verification features.</p>
        </div>
      </div>
    );
  }

  const verifiedCount = verificationData ?
    Object.values(verificationData.currentVerification).filter(Boolean).length : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Verification</h1>
        <p className="text-gray-600">
          Verify your profile to build trust and increase your chances of finding the right match.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-3 py-1">
            {verifiedCount}/5 Verified
          </Badge>
          <span className="text-sm text-gray-500">
            Complete verification to get a verified badge on your profile
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="status">Verification Status</TabsTrigger>
          <TabsTrigger value="upload">Upload Documents</TabsTrigger>
          <TabsTrigger value="history">Request History</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <VerificationStatus
            verificationData={verificationData}
          />
        </TabsContent>

        <TabsContent value="upload">
          <VerificationUpload
            onSuccess={fetchVerificationData}
          />
        </TabsContent>

        <TabsContent value="history">
          <VerificationHistory
            verificationRequests={verificationData?.verificationRequests || []}
          />
        </TabsContent>
      </Tabs>

      {/* Benefits Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Why Verify Your Profile?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Build Trust</h3>
              <p className="text-sm text-gray-600">
                Verified profiles show authenticity and help build trust with potential matches.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Higher Visibility</h3>
              <p className="text-sm text-gray-600">
                Verified profiles appear higher in search results and get more interest.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Enhanced Security</h3>
              <p className="text-sm text-gray-600">
                Verification helps ensure a safer and more secure matchmaking experience.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
