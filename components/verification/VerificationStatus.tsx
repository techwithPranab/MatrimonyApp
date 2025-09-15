'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VerificationRequest {
  verificationType: string;
  status: string;
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

interface VerificationStatusProps {
  readonly verificationData: VerificationData | null;
  readonly onRefresh: () => void;
}

const VERIFICATION_TYPES = [
  {
    key: 'email' as const,
    label: 'Email Verification',
    description: 'Verify your email address',
    icon: '📧',
  },
  {
    key: 'phone' as const,
    label: 'Phone Verification',
    description: 'Verify your phone number',
    icon: '📱',
  },
  {
    key: 'governmentId' as const,
    label: 'Government ID',
    description: 'Upload government-issued ID for identity verification',
    icon: '🆔',
  },
  {
    key: 'education' as const,
    label: 'Education Verification',
    description: 'Verify your educational qualifications',
    icon: '🎓',
  },
  {
    key: 'profession' as const,
    label: 'Professional Verification',
    description: 'Verify your professional credentials',
    icon: '💼',
  },
];

export default function VerificationStatus({ verificationData, onRefresh }: VerificationStatusProps) {
  if (!verificationData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Loading verification status...
          </div>
        </CardContent>
      </Card>
    );
  }

  const { currentVerification } = verificationData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VERIFICATION_TYPES.map((type) => {
              const isVerified = currentVerification[type.key];
              const hasPendingRequest = verificationData.verificationRequests.some(
                (req: VerificationRequest) => req.verificationType === type.key.replace('Id', '_id') &&
                              ['pending', 'under_review'].includes(req.status)
              );

              let cardClassName = 'border-gray-200 bg-gray-50';
              if (isVerified) {
                cardClassName = 'border-green-200 bg-green-50';
              } else if (hasPendingRequest) {
                cardClassName = 'border-yellow-200 bg-yellow-50';
              }

              let badgeVariant: 'default' | 'secondary' | 'outline' = 'outline';
              if (isVerified) {
                badgeVariant = 'default';
              } else if (hasPendingRequest) {
                badgeVariant = 'secondary';
              }

              let badgeClassName = '';
              if (isVerified) {
                badgeClassName = 'bg-green-100 text-green-800';
              } else if (hasPendingRequest) {
                badgeClassName = 'bg-yellow-100 text-yellow-800';
              }

              let statusText = 'Not Verified';
              if (isVerified) {
                statusText = 'Verified';
              } else if (hasPendingRequest) {
                statusText = 'Pending';
              }

              return (
                <div
                  key={type.key}
                  className={`p-4 border rounded-lg ${cardClassName}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{type.label}</h3>
                      <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                    </div>
                    <Badge
                      variant={badgeVariant}
                      className={badgeClassName}
                    >
                      {statusText}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Verification Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-gray-600">
                {Object.values(currentVerification).filter(Boolean).length} / 5 verified
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(Object.values(currentVerification).filter(Boolean).length / 5) * 100}%`,
                }}
              ></div>
            </div>

            {Object.values(currentVerification).filter(Boolean).length === 5 && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Fully Verified!</h3>
                    <p className="text-sm text-green-700">
                      Congratulations! Your profile is fully verified and will be highlighted to potential matches.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
