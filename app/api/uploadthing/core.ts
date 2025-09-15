import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Profile from "@/models/Profile";

const f = createUploadthing();

export const ourFileRouter = {
  // Profile photos - allow authenticated users to upload profile images
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Profile image uploaded:", file.name, "for user:", metadata.userId);
      
      await connectDB();
      
      // Add photo to user's profile
      const profile = await Profile.findOne({ userId: metadata.userId });
      if (profile) {
        // Check if this is the first photo (make it profile picture)
        const isFirstPhoto = !profile.photos || profile.photos.length === 0;
        
        profile.photos.push({
          url: `https://uploadthing.com/f/${file.key}`,
          isProfilePicture: isFirstPhoto,
          uploadedAt: new Date(),
          privacy: 'public'
        });
        
        await profile.save();
      }

      return { uploadedBy: metadata.userId };
    }),

  // Document verification - for ID cards, certificates, etc.
  verificationDocument: f({ 
    image: { maxFileSize: "8MB", maxFileCount: 1 },
    pdf: { maxFileSize: "8MB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Verification document uploaded:", file.name, "for user:", metadata.userId);
      
      // Here you could create a verification request in the database
      // or queue it for admin review
      
      return { uploadedBy: metadata.userId };
    }),

  // Chat attachments - for sending images in messages
  chatAttachment: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Chat attachment uploaded:", file.name, "by user:", metadata.userId);
      
      // Return file info for use in chat message
      return { 
        uploadedBy: metadata.userId,
        fileUrl: `https://uploadthing.com/f/${file.key}`,
        fileName: file.name,
        fileSize: file.size
      };
    }),

  // Admin uploads - for success stories, site content, etc.
  adminUpload: f({ 
    image: { maxFileSize: "8MB", maxFileCount: 10 },
    pdf: { maxFileSize: "16MB", maxFileCount: 5 }
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) throw new Error("Unauthorized");

      await connectDB();
      const user = await User.findById(session.user.id);
      
      if (!user?.roles.includes('admin')) {
        throw new Error("Admin access required");
      }

      return { userId: session.user.id, isAdmin: true };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Admin file uploaded:", file.name, "by admin:", metadata.userId);
      
      return { uploadedBy: metadata.userId };
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
