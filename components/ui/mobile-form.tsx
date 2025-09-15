'use client';

import React from 'react';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Textarea } from './textarea';
import { Button } from './button';
import { ChevronDown } from 'lucide-react';

interface MobileFormFieldProps {
  readonly label: string;
  readonly required?: boolean;
  readonly error?: string;
  readonly children: React.ReactNode;
}

function MobileFormField({ label, required, error, children }: MobileFormFieldProps) {
  return (
    <div className="mobile-form-field mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface MobileFormProps {
  readonly title: string;
  readonly onSubmit: (event: React.FormEvent) => void;
  readonly isLoading?: boolean;
  readonly children: React.ReactNode;
  readonly submitText?: string;
}

export function MobileForm({ 
  title, 
  onSubmit, 
  isLoading = false, 
  children, 
  submitText = 'Submit' 
}: MobileFormProps) {
  return (
    <div className="mobile-form bg-white min-h-screen">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <h1 className="text-xl font-semibold text-gray-900 text-center">{title}</h1>
      </div>
      
      <form onSubmit={onSubmit} className="px-4 py-6 pb-safe">
        {children}
        
        <div className="mt-8">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full touch-optimized h-12 text-base font-medium"
          >
            {isLoading ? 'Processing...' : submitText}
          </Button>
        </div>
      </form>
    </div>
  );
}

interface MobileInputProps {
  readonly name: string;
  readonly type?: string;
  readonly placeholder?: string;
  readonly value?: string;
  readonly onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly required?: boolean;
  readonly autoComplete?: string;
  readonly inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'decimal' | 'search';
}

export function MobileInput(props: MobileInputProps) {
  return (
    <Input
      {...props}
      className="h-12 text-base border-2 focus:border-blue-500 focus:ring-0 rounded-lg"
    />
  );
}

interface MobileSelectProps {
  readonly name: string;
  readonly placeholder?: string;
  readonly value?: string;
  readonly onValueChange?: (value: string) => void;
  readonly required?: boolean;
  readonly children: React.ReactNode;
}

export function MobileSelect({ 
  name, 
  placeholder, 
  value, 
  onValueChange, 
  required, 
  children 
}: MobileSelectProps) {
  return (
    <Select name={name} value={value} onValueChange={onValueChange} required={required}>
      <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500 focus:ring-0 rounded-lg">
        <SelectValue placeholder={placeholder} />
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        {children}
      </SelectContent>
    </Select>
  );
}

interface MobileTextareaProps {
  readonly name: string;
  readonly placeholder?: string;
  readonly value?: string;
  readonly onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readonly required?: boolean;
  readonly rows?: number;
  readonly maxLength?: number;
}

export function MobileTextarea({ rows = 4, maxLength, ...props }: MobileTextareaProps) {
  return (
    <div className="relative">
      <Textarea
        {...props}
        rows={rows}
        maxLength={maxLength}
        className="min-h-24 text-base border-2 focus:border-blue-500 focus:ring-0 rounded-lg resize-none"
      />
      {maxLength && props.value && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {props.value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}

// Re-export the MobileFormField for convenience
export { MobileFormField };

// Example usage component
export function ExampleMobileForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <MobileForm title="Profile Settings" onSubmit={handleSubmit}>
      <MobileFormField label="Full Name" required>
        <MobileInput
          name="name"
          placeholder="Enter your full name"
          autoComplete="name"
          required
        />
      </MobileFormField>

      <MobileFormField label="Email">
        <MobileInput
          name="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          inputMode="email"
        />
      </MobileFormField>

      <MobileFormField label="Age">
        <MobileSelect name="age" placeholder="Select your age">
          <SelectItem value="21">21</SelectItem>
          <SelectItem value="22">22</SelectItem>
          <SelectItem value="23">23</SelectItem>
        </MobileSelect>
      </MobileFormField>

      <MobileFormField label="About You">
        <MobileTextarea
          name="bio"
          placeholder="Tell us about yourself..."
          maxLength={500}
        />
      </MobileFormField>
    </MobileForm>
  );
}
