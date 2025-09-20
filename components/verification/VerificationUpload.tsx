'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, X } from 'lucide-react';

interface VerificationUploadProps {
  readonly onSuccess: () => void;
}

interface DocumentFile {
  file: File;
  url: string;
  name: string;
  type: string;
}

const VERIFICATION_TYPES = [
  {
    value: 'government_id',
    label: 'Government ID',
    description: 'Passport, Driver\'s License, Aadhaar Card, etc.',
    requiredFields: ['idType', 'idNumber', 'issuingAuthority'],
    optionalFields: ['expiryDate'],
  },
  {
    value: 'education',
    label: 'Education Verification',
    description: 'Degree certificates, transcripts, mark sheets',
    requiredFields: ['degree', 'institution', 'graduationYear'],
    optionalFields: ['grade'],
  },
  {
    value: 'profession',
    label: 'Professional Verification',
    description: 'Employment letter, business license, professional certificates',
    requiredFields: ['companyName', 'designation'],
    optionalFields: ['employmentType', 'experienceYears'],
  },
  {
    value: 'address',
    label: 'Address Proof',
    description: 'Utility bill, bank statement, rental agreement',
    requiredFields: ['addressLine1', 'postalCode'],
    optionalFields: ['addressLine2', 'addressProofType'],
  },
  {
    value: 'income',
    label: 'Income Proof',
    description: 'Salary slips, tax returns, bank statements',
    requiredFields: ['annualIncome', 'currency'],
    optionalFields: ['incomeProofType'],
  },
];

export default function VerificationUpload({ onSuccess }: VerificationUploadProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [formData, setFormData] = useState<Record<string, string | number | undefined>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedTypeConfig = VERIFICATION_TYPES.find(type => type.value === selectedType);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newDocuments: DocumentFile[] = [];
    for (const file of files) {
      // Create a temporary URL for preview
      const url = URL.createObjectURL(file);
      newDocuments.push({
        file,
        url,
        name: file.name,
        type: file.type,
      });
    }

    setDocuments(prev => [...prev, ...newDocuments]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => {
      const newDocs = [...prev];
      // Revoke the object URL to free memory
      URL.revokeObjectURL(newDocs[index].url);
      newDocs.splice(index, 1);
      return newDocs;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedType) {
      newErrors.type = 'Please select a verification type';
    }

    if (documents.length === 0) {
      newErrors.documents = 'Please upload at least one document';
    }

    if (selectedTypeConfig) {
      // Check required fields
      selectedTypeConfig.requiredFields.forEach(field => {
        if (!formData[field] || formData[field].toString().trim() === '') {
          newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Upload documents to UploadThing first
      const uploadPromises = documents.map(async (doc) => {
        const formDataUpload = new FormData();
        formDataUpload.append('file', doc.file);

        const response = await fetch('/api/uploadthing/verificationDocument', {
          method: 'POST',
          body: formDataUpload,
        });

        if (!response.ok) {
          throw new Error('Failed to upload document');
        }

        const result = await response.json();
        return {
          fileUrl: result.fileUrl || `https://uploadthing.com/f/${result.key}`,
          fileName: doc.name,
          fileType: doc.type,
        };
      });

      const uploadedDocuments = await Promise.all(uploadPromises);

      // Submit verification request
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationType: selectedType,
          documents: uploadedDocuments,
          submittedData: formData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit verification request');
      }

      // Reset form
      setSelectedType('');
      setDocuments([]);
      setFormData({});
      setErrors({});

      // Clean up object URLs
      documents.forEach(doc => URL.revokeObjectURL(doc.url));

      onSuccess();
      alert('Verification request submitted successfully! We will review your documents and get back to you within 2-3 business days.');
    } catch (error) {
      console.error('Error submitting verification request:', error);
      alert('Failed to submit verification request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents for Verification</CardTitle>
          <p className="text-sm text-gray-600">
            Submit documents to verify your profile information. All documents are kept secure and confidential.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Verification Type Selection */}
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">
                Verification Type *
              </legend>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select what you want to verify" />
                </SelectTrigger>
                <SelectContent>
                  {VERIFICATION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
              {selectedTypeConfig && (
                <p className="mt-2 text-sm text-gray-600">{selectedTypeConfig.description}</p>
              )}
            </fieldset>

            {/* Dynamic Form Fields */}
            {selectedTypeConfig && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Required Fields */}
                {selectedTypeConfig.requiredFields.map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} *
                    </label>
                    {field === 'idType' && (
                      <Select
                        value={String(formData[field] || '')}
                        onValueChange={(value) => handleInputChange(field, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="drivers_license">Driver&apos;s License</SelectItem>
                          <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                          <SelectItem value="pan">PAN Card</SelectItem>
                          <SelectItem value="voter_id">Voter ID</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {field === 'employmentType' && (
                      <Select
                        value={String(formData[field] || '')}
                        onValueChange={(value) => handleInputChange(field, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_time">Full Time</SelectItem>
                          <SelectItem value="part_time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="self_employed">Self Employed</SelectItem>
                          <SelectItem value="business_owner">Business Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {field === 'currency' && (
                      <Select
                        value={String(formData[field] || '')}
                        onValueChange={(value) => handleInputChange(field, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="AUD">AUD (A$)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {field === 'addressProofType' && (
                      <Select
                        value={String(formData[field] || '')}
                        onValueChange={(value) => handleInputChange(field, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select proof type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utility_bill">Utility Bill</SelectItem>
                          <SelectItem value="bank_statement">Bank Statement</SelectItem>
                          <SelectItem value="rental_agreement">Rental Agreement</SelectItem>
                          <SelectItem value="property_tax">Property Tax Receipt</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {field === 'incomeProofType' && (
                      <Select
                        value={String(formData[field] || '')}
                        onValueChange={(value) => handleInputChange(field, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select proof type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salary_slip">Salary Slip</SelectItem>
                          <SelectItem value="tax_return">Tax Return</SelectItem>
                          <SelectItem value="bank_statement">Bank Statement</SelectItem>
                          <SelectItem value="employment_letter">Employment Letter</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {field === 'expiryDate' && (
                      <Input
                        type="date"
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                      />
                    )}
                    {field === 'graduationYear' && (
                      <Input
                        type="number"
                        min="1950"
                        max={new Date().getFullYear()}
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, parseInt(e.target.value))}
                        placeholder="e.g., 2020"
                      />
                    )}
                    {field === 'experienceYears' && (
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, parseInt(e.target.value))}
                        placeholder="Years of experience"
                      />
                    )}
                    {field === 'annualIncome' && (
                      <Input
                        type="number"
                        min="0"
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, parseInt(e.target.value))}
                        placeholder="Annual income"
                      />
                    )}
                    {!['idType', 'employmentType', 'currency', 'addressProofType', 'incomeProofType', 'expiryDate', 'graduationYear', 'experienceYears', 'annualIncome'].includes(field) && (
                      <Input
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                      />
                    )}
                    {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
                  </div>
                ))}

                {/* Optional Fields */}
                {selectedTypeConfig.optionalFields.map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    {field === 'expiryDate' && (
                      <Input
                        type="date"
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                      />
                    )}
                    {field === 'graduationYear' && (
                      <Input
                        type="number"
                        min="1950"
                        max={new Date().getFullYear()}
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, parseInt(e.target.value))}
                        placeholder="e.g., 2020"
                      />
                    )}
                    {field === 'experienceYears' && (
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, parseInt(e.target.value))}
                        placeholder="Years of experience"
                      />
                    )}
                    {field === 'annualIncome' && (
                      <Input
                        type="number"
                        min="0"
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, parseInt(e.target.value))}
                        placeholder="Annual income"
                      />
                    )}
                    {!['expiryDate', 'graduationYear', 'experienceYears', 'annualIncome'].includes(field) && (
                      <Input
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Document Upload */}
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">
                Upload Documents *
              </legend>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload documents
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PNG, JPG, PDF up to 8MB each
                      </span>
                    </label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              </div>
              {errors.documents && <p className="mt-1 text-sm text-red-600">{errors.documents}</p>}

              {/* Document Preview */}
              {documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Uploaded Documents:</h4>
                  {documents.map((doc, index) => (
                    <div key={doc.name + index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-900">{doc.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(doc.file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </fieldset>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading || !selectedType}>
                {loading ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Information */}
      <Card>
        <CardContent className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Verification Process
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Documents are reviewed within 2-3 business days</li>
                    <li>You will receive an email notification with the result</li>
                    <li>All documents are encrypted and stored securely</li>
                    <li>Only authorized personnel can access your documents</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
