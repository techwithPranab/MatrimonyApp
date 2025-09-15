'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';

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

interface VerificationHistoryProps {
  readonly verificationRequests: VerificationRequest[];
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-800' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
  expired: { label: 'Expired', color: 'bg-gray-100 text-gray-800' },
};

const TYPE_LABELS = {
  government_id: 'Government ID',
  education: 'Education',
  profession: 'Professional',
  address: 'Address Proof',
  income: 'Income Proof',
};

export default function VerificationHistory({ verificationRequests }: VerificationHistoryProps) {
  if (verificationRequests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No verification requests yet</h3>
            <p>You haven&apos;t submitted any verification requests. Upload documents to get verified.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewDocument = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const handleDownloadDocument = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {verificationRequests.map((request) => {
        const statusConfig = STATUS_CONFIG[request.status];
        const typeLabel = TYPE_LABELS[request.verificationType as keyof typeof TYPE_LABELS] || request.verificationType;

        return (
          <Card key={request._id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{typeLabel} Verification</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Requested on {formatDate(request.requestedAt)}
                  </p>
                </div>
                <Badge className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Status Timeline */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Submitted</span>
                    <span className="text-gray-500">{formatDate(request.requestedAt)}</span>
                  </div>

                  {request.reviewedAt && (
                    <>
                      <div className="w-8 h-px bg-gray-300"></div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          request.status === 'approved' ? 'bg-green-500' :
                          request.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-gray-600">
                          {request.status === 'approved' ? 'Approved' :
                           request.status === 'rejected' ? 'Rejected' : 'Reviewed'}
                        </span>
                        <span className="text-gray-500">{formatDate(request.reviewedAt)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Submitted Data */}
                {Object.keys(request.submittedData).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted Information:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {Object.entries(request.submittedData).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                          </span>
                          <span className="text-gray-900">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Documents:</h4>
                  <div className="space-y-2">
                    {request.documents.map((doc, index) => (
                      <div key={doc.fileName + index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDocument(doc.fileUrl)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc.fileUrl, doc.fileName)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Notes */}
                {request.reviewNotes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Review Notes:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {request.reviewNotes}
                    </p>
                  </div>
                )}

                {/* Rejection Reason */}
                {request.rejectionReason && (
                  <div>
                    <h4 className="text-sm font-medium text-red-700 mb-2">Rejection Reason:</h4>
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                      {request.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Resubmit Option for Rejected Requests */}
                {request.status === 'rejected' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Request Rejected</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          You can resubmit this verification request with corrected documents.
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Resubmit Request
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
