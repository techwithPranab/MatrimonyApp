#!/usr/bin/env tsx

import { config } from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';
import Profile from '../models/Profile';
import Subscription from '../models/Subscription';
import bcrypt from 'bcryptjs';

// Load environment variables
config({ path: '.env.local' });

const sampleUsers = [
  {
    email: 'demo@matrimonyweb.com',
    password: 'password123',
    profile: {
      firstName: 'Rahul',
      lastName: 'Sharma',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'male' as const,
      height: 175,
      maritalStatus: 'never_married' as const,
      hasChildren: false,
      languages: ['Hindi', 'English'],
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      religion: 'Hindu',
      community: 'Brahmin',
      education: 'Bachelors',
      educationDetails: 'B.Tech Computer Science',
      profession: 'Software Engineer',
      professionDetails: 'Senior Software Engineer at Tech Corp',
      annualIncome: 1200000,
      currency: 'INR',
      diet: 'vegetarian' as const,
      smoking: 'never' as const,
      drinking: 'occasionally' as const,
      aboutMe: 'Software engineer passionate about technology and music. Love traveling and exploring new cultures.',
      interests: ['Technology', 'Music', 'Travel', 'Photography'],
      partnerPreferences: {
        ageRange: { min: 24, max: 30 },
        heightRange: { min: 155, max: 170 },
        maritalStatus: ['never_married'],
        religions: ['Hindu'],
        communities: ['Brahmin', 'Kshatriya'],
        education: ['Bachelors', 'Masters'],
        professions: ['Engineer', 'Doctor', 'Teacher'],
        locations: ['Mumbai', 'Pune', 'Delhi'],
      },
      privacy: {
        showProfile: true,
        showPhotos: 'all' as const,
        showContact: 'mutual_interest' as const,
        allowMessages: true,
      },
      verification: {
        email: true,
        phone: false,
        governmentId: false,
        education: false,
        profession: false,
      },
      completenessScore: 85,
      isActive: true,
      isPremium: false,
      lastActiveAt: new Date(),
    },
  },
  {
    email: 'priya@matrimonyweb.com',
    password: 'password123',
    profile: {
      firstName: 'Priya',
      lastName: 'Patel',
      dateOfBirth: new Date('1992-08-22'),
      gender: 'female' as const,
      height: 162,
      maritalStatus: 'never_married' as const,
      hasChildren: false,
      languages: ['Hindi', 'English', 'Gujarati'],
      country: 'India',
      state: 'Gujarat',
      city: 'Ahmedabad',
      religion: 'Hindu',
      community: 'Patel',
      education: 'Masters',
      educationDetails: 'MBA Finance',
      profession: 'Finance Manager',
      professionDetails: 'Finance Manager at Corporate Bank',
      annualIncome: 800000,
      currency: 'INR',
      diet: 'vegetarian' as const,
      smoking: 'never' as const,
      drinking: 'never' as const,
      aboutMe: 'Finance professional with traditional values. Love cooking and spending time with family.',
      interests: ['Cooking', 'Reading', 'Dance', 'Family'],
      partnerPreferences: {
        ageRange: { min: 26, max: 35 },
        heightRange: { min: 170, max: 185 },
        maritalStatus: ['never_married'],
        religions: ['Hindu'],
        communities: ['Patel', 'Brahmin'],
        education: ['Bachelors', 'Masters'],
        professions: ['Engineer', 'Doctor', 'Business'],
        locations: ['Ahmedabad', 'Mumbai', 'Pune'],
      },
      privacy: {
        showProfile: true,
        showPhotos: 'connections' as const,
        showContact: 'premium' as const,
        allowMessages: true,
      },
      verification: {
        email: true,
        phone: true,
        governmentId: false,
        education: true,
        profession: false,
      },
      completenessScore: 90,
      isActive: true,
      isPremium: true,
      lastActiveAt: new Date(),
    },
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');
    
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Subscription.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create demo users
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = await User.create({
        email: userData.email,
        hashedPassword,
        emailVerified: new Date(),
      });

      await Profile.create({
        userId: user._id.toString(),
        ...userData.profile,
      });

      // Create subscription
      await Subscription.create({
        userId: user._id.toString(),
        stripeCustomerId: `cus_demo_${user._id}`,
        plan: userData.profile.isPremium ? 'premium' : 'free',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        entitlements: {
          contactViewQuota: userData.profile.isPremium ? 999 : 5,
          contactViewsUsed: 0,
          unlimitedChat: userData.profile.isPremium,
          profileBoosts: userData.profile.isPremium ? 5 : 0,
          profileBoostsUsed: 0,
          featuredPlacement: userData.profile.isPremium,
          advancedFilters: userData.profile.isPremium,
          videoCall: userData.profile.isPremium,
          prioritySupport: userData.profile.isPremium,
        },
      });

      console.log(`✅ Created user: ${userData.email}`);
    }

    console.log('🎉 Database seeded successfully!');
    console.log('📧 Demo accounts:');
    sampleUsers.forEach(user => {
      console.log(`   - ${user.email} / ${user.password}`);
    });
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the seed function
seed();
