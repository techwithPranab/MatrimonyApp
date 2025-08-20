import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import SupportTicket from "@/models/SupportTicket";
import UserApproval from "@/models/UserApproval";
import bcrypt from "bcryptjs";

const adminUsers = [
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
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    }],
    tags: ["photo-upload", "technical-issue"],
  },
  {
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
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    }],
    tags: ["payment", "subscription", "urgent"],
  },
  {
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
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    }],
    tags: ["abuse", "content-moderation", "urgent"],
  },
  {
    userId: "user4",
    subject: "Profile verification documents rejected",
    description: "My documents were rejected but I believe they are valid. Please review again.",
    category: "profile",
    priority: "medium",
    status: "resolved",
    resolvedBy: "admin-datamanager",
    resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    messages: [
      {
        senderId: "user4",
        senderType: "user",
        message: "My documents were rejected but I believe they are valid. Please review again.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      },
      {
        senderId: "admin-datamanager",
        senderType: "admin",
        message: "We've reviewed your documents again and they have been approved. Your profile is now verified.",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
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

async function seedAdminData() {
  await connectDB();
  
  console.log("🌱 Seeding admin data...");

  // Clear existing data
  await Admin.deleteMany({});
  await SupportTicket.deleteMany({});
  await UserApproval.deleteMany({});

  // Seed admin users
  console.log("👤 Creating admin users...");
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
  console.log("🎫 Creating support tickets...");
  for (const ticketData of sampleTickets) {
    const ticket = new SupportTicket(ticketData);
    await ticket.save();
    console.log(`✅ Created ticket: ${ticket.ticketNumber} - ${ticketData.subject}`);
  }

  // Seed user approvals
  console.log("📋 Creating user approvals...");
  for (const approvalData of sampleApprovals) {
    const approval = new UserApproval(approvalData);
    await approval.save();
    console.log(`✅ Created approval: ${approvalData.profileData.firstName} ${approvalData.profileData.lastName} (${approvalData.status})`);
  }

  console.log("🎉 Admin data seeding completed!");
  console.log("\n📧 Admin Login Credentials:");
  console.log("Super Admin: admin@matrimonyapp.com / admin123");
  console.log("Moderator: moderator@matrimonyapp.com / mod123");
  console.log("Support Agent: support@matrimonyapp.com / support123");
  console.log("Data Manager: datamanager@matrimonyapp.com / data123");
}

seedAdminData().catch((err) => {
  console.error("❌ Error seeding admin data:", err);
  process.exit(1);
});
