
// DEBUG: Set MONGODB_URI manually for troubleshooting - MUST be first
process.env.MONGODB_URI = 'mongodb://localhost:27017/matrimony-web-dev';

// Load environment variables FIRST, before any other imports
import { config } from 'dotenv';
config({ path: '.env.local' });

import bcrypt from 'bcryptjs';
import connectDB from './lib/db';
import User from './models/User';
import Profile from './models/Profile';
import Subscription from './models/Subscription';
import Admin from './models/Admin';
import SupportTicket from './models/SupportTicket';
import UserApproval from './models/UserApproval';

// --- Sample Users (from seed.ts) ---
const sampleUsers = [
  // ...existing sampleUsers from seed.ts...
  {
    email: 'demo@matrimonyweb.com',
    password: 'password123',
    profile: {
      firstName: 'Rahul',
      lastName: 'Sharma',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'male',
      height: 175,
      maritalStatus: 'never_married',
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
      diet: 'vegetarian',
      smoking: 'never',
      drinking: 'occasionally',
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
        showPhotos: 'all',
        showContact: 'mutual_interest',
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
      gender: 'female',
      height: 162,
      maritalStatus: 'never_married',
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
      diet: 'vegetarian',
      smoking: 'never',
      drinking: 'never',
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
        showPhotos: 'connections',
        showContact: 'premium',
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

// --- Admin Users, Support Tickets, User Approvals (from seedAdminData.ts) ---
const adminUsers = [
  // ...existing adminUsers from seedAdminData.ts...
  {
    email: "admin@matrimonyapp.com",
    password: "admin123",
    firstName: "Super",
    lastName: "Admin",
    role: "super_admin",
    twoFactorEnabled: false,
  },
  {
    email: "moderator@matrimonyapp.com",
    password: "mod123",
    firstName: "Content",
    lastName: "Moderator",
    role: "moderator",
    twoFactorEnabled: false,
  },
  {
    email: "support@matrimonyapp.com",
    password: "support123",
    firstName: "Support",
    lastName: "Agent",
    role: "support_agent",
    twoFactorEnabled: false,
  },
  {
    email: "datamanager@matrimonyapp.com",
    password: "data123",
    firstName: "Data",
    lastName: "Manager",
    role: "data_manager",
    twoFactorEnabled: false,
  }
];

const sampleTickets = [
  {
    ticketNumber: "TKT-1001",
    userId: "user1",
    subject: "Unable to upload profile photo",
    description: "I'm getting an error when trying to upload my profile picture. The file is under 5MB and in JPG format.",
    category: "technical",
    priority: "medium",
    status: "open",
    messages: [{
      senderId: "user1",
      senderType: "user",
      message: "I'm getting an error when trying to upload my profile picture. The file is under 5MB and in JPG format.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    }],
    tags: ["photo-upload", "technical-issue"],
  },
  {
    ticketNumber: "TKT-1002",
    userId: "user2",
    subject: "Premium subscription payment failed",
    description: "My payment for premium subscription failed but amount was deducted from my account.",
    category: "billing",
    priority: "high",
    status: "open",
    messages: [{
      senderId: "user2",
      senderType: "user",
      message: "My payment for premium subscription failed but amount was deducted from my account. Transaction ID: TXN123456789",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    }],
    tags: ["payment", "subscription", "urgent"],
  },
  {
    ticketNumber: "TKT-1003",
    userId: "user3",
    subject: "Inappropriate profile reported",
    description: "User with profile ID PROF789 has uploaded inappropriate content.",
    category: "abuse",
    priority: "urgent",
    status: "in_progress",
    assignedTo: "admin-moderator",
    messages: [{
      senderId: "user3",
      senderType: "user",
      message: "User with profile ID PROF789 has uploaded inappropriate content. Please take immediate action.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    }],
    tags: ["abuse", "content-moderation", "urgent"],
  },
  {
    ticketNumber: "TKT-1004",
    userId: "user4",
    subject: "Profile verification documents rejected",
    description: "My documents were rejected but I believe they are valid. Please review again.",
    category: "profile",
    priority: "medium",
    status: "resolved",
    resolvedBy: "admin-datamanager",
    resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    messages: [
      {
        senderId: "user4",
        senderType: "user",
        message: "My documents were rejected but I believe they are valid. Please review again.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        senderId: "admin-datamanager",
        senderType: "admin",
        message: "We've reviewed your documents again and they have been approved. Your profile is now verified.",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      }
    ],
    tags: ["verification", "documents"],
  }
];

const sampleApprovals = [
  {
    userId: "user5",
    profileData: {
      firstName: "Rajesh",
      lastName: "Kumar",
      email: "rajesh.kumar@email.com",
      age: 28,
      city: "Mumbai",
      profession: "Software Engineer",
      gender: "male"
    },
    status: "pending",
    submissionType: "new_registration",
    priority: "medium",
    verificationChecks: {
      emailVerified: true,
      phoneVerified: true,
      documentsVerified: false,
      photoVerified: false,
      manualReviewRequired: true,
    },
    documents: [
      {
        type: "government_id",
        url: "/documents/rajesh_id.jpg",
        status: "pending"
      },
      {
        type: "photo",
        url: "/photos/rajesh_profile.jpg", 
        status: "pending"
      }
    ],
    flags: [],
  },
  {
    userId: "user6",
    profileData: {
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya.sharma@email.com",
      age: 25,
      city: "Delhi",
      profession: "Teacher",
      gender: "female"
    },
    status: "pending",
    submissionType: "photo_upload",
    priority: "high",
    verificationChecks: {
      emailVerified: true,
      phoneVerified: true,
      documentsVerified: true,
      photoVerified: false,
      manualReviewRequired: true,
    },
    documents: [
      {
        type: "photo",
        url: "/photos/priya_new.jpg",
        status: "pending"
      }
    ],
    flags: ["manual_review_requested"],
  },
  {
    userId: "user7",
    profileData: {
      firstName: "Amit",
      lastName: "Patel",
      email: "suspicious.email@temp.com",
      age: 35,
      city: "Ahmedabad",
      profession: "Business",
      gender: "male"
    },
    status: "in_review",
    submissionType: "new_registration",
    priority: "urgent",
    verificationChecks: {
      emailVerified: false,
      phoneVerified: false,
      documentsVerified: false,
      photoVerified: false,
      manualReviewRequired: true,
    },
    documents: [],
    flags: ["suspicious_email", "incomplete_profile", "potential_fake"],
  }
];

// --- Bulk Profiles (from seedProfiles.ts) ---
const maleNames = [
  "Amit", "Rahul", "Sourav", "Vikram", "Rohit", "Ankit", "Sandeep", "Manish", "Pranab", "Arjun",
  "Kunal", "Sumit", "Deepak", "Raj", "Abhishek", "Nikhil", "Vivek", "Saurabh", "Harsh", "Aditya",
  "Shubham", "Pankaj", "Aakash", "Varun", "Yash", "Rajat", "Gaurav", "Siddharth", "Mayank", "Tarun",
  "Dev", "Parth", "Rishi", "Aman", "Dhruv", "Kartik", "Sanket", "Rajat", "Nitin", "Rakesh",
  "Satyam", "Shivam", "Anshul", "Ravindra", "Vikas", "Praveen", "Ashish", "Suraj", "Mohit", "Jatin"
];
const femaleNames = [
  "Priya", "Neha", "Pooja", "Riya", "Ankita", "Shreya", "Sneha", "Aishwarya", "Sakshi", "Simran",
  "Kritika", "Isha", "Rashmi", "Swati", "Divya", "Nikita", "Megha", "Komal", "Ritu", "Tanya",
  "Sonam", "Payal", "Bhavna", "Aarti", "Preeti", "Monika", "Kajal", "Nidhi", "Shweta", "Pallavi",
  "Deepika", "Manisha", "Radhika", "Surbhi", "Anjali", "Kirti", "Mansi", "Sheetal", "Vaishali", "Juhi",
  "Ruchi", "Sonal", "Ekta", "Namrata", "Trisha", "Rupali", "Chhavi", "Meenakshi", "Shilpa", "Vidhi"
];
function getRandomInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function getRandomCity() { const cities = ["Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"]; return cities[getRandomInt(0, cities.length - 1)]; }
function getRandomProfession() { const professions = ["Engineer", "Doctor", "Teacher", "Designer", "Developer", "Manager", "Artist", "Writer", "Consultant", "Entrepreneur"]; return professions[getRandomInt(0, professions.length - 1)]; }
function getRandomDateOfBirth() { const start = new Date(1990, 0, 1).getTime(); const end = new Date(2003, 0, 1).getTime(); return new Date(getRandomInt(start, end)); }
function getRandomHeight() { return getRandomInt(150, 190); }
function getRandomMaritalStatus() { const statuses = ["never_married", "divorced", "widowed", "separated"]; return statuses[getRandomInt(0, statuses.length - 1)]; }
function getRandomLanguages() { const languages = ["Hindi", "English", "Bengali", "Tamil", "Marathi"]; return [languages[getRandomInt(0, languages.length - 1)]]; }
function getRandomReligion() { const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist"]; return religions[getRandomInt(0, religions.length - 1)]; }
function getRandomCommunity() { const communities = ["Brahmin", "Kshatriya", "Vaishya", "Other"]; return communities[getRandomInt(0, communities.length - 1)]; }
function getRandomEducation() { const education = ["Bachelor's", "Master's", "PhD", "Diploma"]; return education[getRandomInt(0, education.length - 1)]; }
function getRandomDiet() { const diets = ["vegetarian", "non_vegetarian", "vegan", "occasionally_non_veg"]; return diets[getRandomInt(0, diets.length - 1)]; }
function getRandomSmoking() { const smoking = ["never", "occasionally", "regularly"]; return smoking[getRandomInt(0, smoking.length - 1)]; }
function getRandomDrinking() { const drinking = ["never", "occasionally", "regularly"]; return drinking[getRandomInt(0, drinking.length - 1)]; }
function getRandomPhotos(gender: string, idx: number) { return [{ url: `/avatars/${gender}${(idx % 10) + 1}.png`, isDefault: true, uploadedAt: new Date() }]; }
function getDefaultPartnerPreferences() { return { ageRange: { min: 22, max: 35 }, heightRange: { min: 150, max: 190 }, maritalStatus: ["Never married"], religion: ["Hindu"], community: [], education: ["Bachelor's", "Master's"], profession: [], smoking: ["Never"], drinking: ["Never", "Socially"], diet: ["Vegetarian"], location: { country: "India", state: "", city: "" } }; }
function getDefaultPrivacy() { return { showProfile: true, showPhotos: "all", showContact: "mutual_interest", allowMessages: true }; }
function getDefaultVerification() { return { email: true, phone: false, governmentId: false, education: false, profession: false }; }

async function seedAll() {
  await connectDB();
  console.log('🌱 Starting consolidated database seed...');

  // Clear all collections
  await Promise.all([
    User.deleteMany({}),
    Profile.deleteMany({}),
    Subscription.deleteMany({}),
    Admin.deleteMany({}),
    SupportTicket.deleteMany({}),
    UserApproval.deleteMany({}),
  ]);
  console.log('🗑️  Cleared all collections');

  // Seed demo users, profiles, subscriptions
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
    await Subscription.create({
      userId: user._id.toString(),
      stripeCustomerId: `cus_demo_${user._id}`,
      plan: userData.profile.isPremium ? 'premium' : 'free',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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

  // Seed admin users
  for (const adminData of adminUsers) {
    const hashedPassword = await bcrypt.hash(adminData.password, 12);
    const admin = new Admin({
      ...adminData,
      password: hashedPassword,
      isActive: true,
    });
    await admin.save();
    console.log(`✅ Created admin: ${adminData.email} (${adminData.role})`);
  }

  // Seed support tickets
  for (const ticketData of sampleTickets) {
    const ticket = new SupportTicket(ticketData);
    await ticket.save();
    console.log(`✅ Created ticket: ${ticket.ticketNumber || ''} - ${ticketData.subject}`);
  }

  // Seed user approvals
  for (const approvalData of sampleApprovals) {
    const approval = new UserApproval(approvalData);
    await approval.save();
    console.log(`✅ Created approval: ${approvalData.profileData.firstName} ${approvalData.profileData.lastName} (${approvalData.status})`);
  }

  // Seed bulk profiles (100)
  const profiles = [];
  for (let i = 0; i < 50; i++) {
    profiles.push({
      userId: `male${i + 1}`,
      firstName: maleNames[i],
      lastName: "Kumar",
      name: `${maleNames[i]} Kumar`,
      dateOfBirth: getRandomDateOfBirth(),
      gender: "male",
      height: getRandomHeight(),
      maritalStatus: getRandomMaritalStatus(),
      hasChildren: false,
      languages: getRandomLanguages(),
      country: "India",
      state: "Delhi",
      city: getRandomCity(),
      religion: getRandomReligion(),
      community: getRandomCommunity(),
      education: getRandomEducation(),
      profession: getRandomProfession(),
      currency: "INR",
      diet: getRandomDiet(),
      smoking: getRandomSmoking(),
      drinking: getRandomDrinking(),
      aboutMe: `Hi, I'm ${maleNames[i]} from ${getRandomCity()}.`,
      interests: ["Music", "Travel", "Sports"],
      photos: getRandomPhotos("male", i),
      partnerPreferences: getDefaultPartnerPreferences(),
      privacy: getDefaultPrivacy(),
      verification: getDefaultVerification(),
      completenessScore: 80,
      isActive: true,
      isPremium: false,
      lastActiveAt: new Date(),
    });
  }
  for (let i = 0; i < 50; i++) {
    profiles.push({
      userId: `female${i + 1}`,
      firstName: femaleNames[i],
      lastName: "Sharma",
      name: `${femaleNames[i]} Sharma`,
      dateOfBirth: getRandomDateOfBirth(),
      gender: "female",
      height: getRandomHeight(),
      maritalStatus: getRandomMaritalStatus(),
      hasChildren: false,
      languages: getRandomLanguages(),
      country: "India",
      state: "Delhi",
      city: getRandomCity(),
      religion: getRandomReligion(),
      community: getRandomCommunity(),
      education: getRandomEducation(),
      profession: getRandomProfession(),
      currency: "INR",
      diet: getRandomDiet(),
      smoking: getRandomSmoking(),
      drinking: getRandomDrinking(),
      aboutMe: `Hi, I'm ${femaleNames[i]} from ${getRandomCity()}.`,
      interests: ["Music", "Travel", "Cooking"],
      photos: getRandomPhotos("female", i),
      partnerPreferences: getDefaultPartnerPreferences(),
      privacy: getDefaultPrivacy(),
      verification: getDefaultVerification(),
      completenessScore: 80,
      isActive: true,
      isPremium: false,
      lastActiveAt: new Date(),
    });
  }
  for (const profile of profiles) {
    await Profile.create(profile);
  }
  console.log("Seeded 100 profiles (50 male, 50 female)");

  console.log('🎉 All data seeded successfully!');
  console.log('📧 Demo accounts:');
  sampleUsers.forEach(user => {
    console.log(`   - ${user.email} / ${user.password}`);
  });
  console.log("Super Admin: admin@matrimonyapp.com / admin123");
  console.log("Moderator: moderator@matrimonyapp.com / mod123");
  console.log("Support Agent: support@matrimonyapp.com / support123");
  console.log("Data Manager: datamanager@matrimonyapp.com / data123");
}

seedAll().catch((err) => {
  console.error('❌ Error seeding all data:', err);
  process.exit(1);
});
