import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const basicProfileSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(['male', 'female']),
  height: z.number().min(120, { message: 'Height must be at least 120 cm' }).max(250, { message: 'Height must be less than 250 cm' }),
  maritalStatus: z.enum(['never_married', 'divorced', 'widowed', 'separated']),
});

export const locationSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
});

export const religionSchema = z.object({
  religion: z.string().min(1, 'Religion is required'),
  community: z.string().min(1, 'Community is required'),
  subCommunity: z.string().optional(),
});

export const educationSchema = z.object({
  education: z.string().min(1, 'Education is required'),
  educationDetails: z.string().optional(),
  profession: z.string().min(1, 'Profession is required'),
  professionDetails: z.string().optional(),
  annualIncome: z.number().min(0, 'Income must be a positive number').optional(),
  currency: z.string().default('USD'),
});

export const lifestyleSchema = z.object({
  diet: z.enum(['vegetarian', 'non_vegetarian', 'vegan', 'occasionally_non_veg']),
  smoking: z.enum(['never', 'occasionally', 'regularly']),
  drinking: z.enum(['never', 'occasionally', 'regularly']),
  languages: z.array(z.string()).min(1, { message: 'Please select at least one language' }),
  interests: z.array(z.string()).optional(),
});

export const partnerPreferencesSchema = z.object({
  ageRange: z.object({
    min: z.number().min(18, 'Minimum age must be at least 18').max(100, 'Age must be less than 100'),
    max: z.number().min(18, 'Maximum age must be at least 18').max(100, 'Age must be less than 100'),
  }).refine((data) => data.min <= data.max, {
    message: 'Minimum age must be less than or equal to maximum age',
    path: ['min'],
  }),
  heightRange: z.object({
    min: z.number().min(120, 'Minimum height must be at least 120 cm').max(250, 'Height must be less than 250 cm'),
    max: z.number().min(120, 'Maximum height must be at least 120 cm').max(250, 'Height must be less than 250 cm'),
  }).refine((data) => data.min <= data.max, {
    message: 'Minimum height must be less than or equal to maximum height',
    path: ['min'],
  }),
  maritalStatus: z.array(z.string()).min(1, 'Please select at least one marital status'),
  religions: z.array(z.string()).min(1, 'Please select at least one religion'),
  communities: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
  professions: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  diet: z.array(z.string()).optional(),
  smoking: z.array(z.string()).optional(),
  drinking: z.array(z.string()).optional(),
});

export const searchFiltersSchema = z.object({
  ageRange: z.object({
    min: z.number().min(18).max(100).optional(),
    max: z.number().min(18).max(100).optional(),
  }).optional(),
  heightRange: z.object({
    min: z.number().min(120).max(250).optional(),
    max: z.number().min(120).max(250).optional(),
  }).optional(),
  religion: z.array(z.string()).optional(),
  community: z.array(z.string()).optional(),
  maritalStatus: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
  profession: z.array(z.string()).optional(),
  location: z.object({
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
  }).optional(),
  diet: z.array(z.string()).optional(),
  smoking: z.array(z.string()).optional(),
  drinking: z.array(z.string()).optional(),
  hasPhotos: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  lastActiveWithin: z.number().optional(), // days
});

export const messageSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  content: z.string().min(1, 'Message content is required').max(2000, 'Message must be less than 2000 characters'),
  messageType: z.enum(['text', 'image']).default('text'),
});

export const interestSchema = z.object({
  toUserId: z.string().min(1, 'Target user ID is required'),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;
export type BasicProfileData = z.infer<typeof basicProfileSchema>;
export type LocationData = z.infer<typeof locationSchema>;
export type ReligionData = z.infer<typeof religionSchema>;
export type EducationData = z.infer<typeof educationSchema>;
export type LifestyleData = z.infer<typeof lifestyleSchema>;
export type PartnerPreferencesData = z.infer<typeof partnerPreferencesSchema>;
export type SearchFilters = z.infer<typeof searchFiltersSchema>;
export type MessageData = z.infer<typeof messageSchema>;
export type InterestData = z.infer<typeof interestSchema>;
