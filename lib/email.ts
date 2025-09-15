import * as nodemailer from "nodemailer";
import { createWelcomeEmail, createOtpEmail, createPasswordResetEmail } from "./email-templates/auth";
import { createMatchNotificationEmail, createInterestReceivedEmail, createInterestAcceptedEmail } from "./email-templates/matching";
import { createProfileViewNotificationEmail, createNewMessageNotificationEmail, createWeeklyDigestEmail } from "./email-templates/notifications";
import { createProfileApprovalEmail, createProfileRejectionEmail, createAccountSuspensionEmail, createSubscriptionExpiryEmail, createMaintenanceNotificationEmail } from "./email-templates/system";

interface EmailOptions {
  readonly to: string;
  readonly subject: string;
  readonly html: string;
  readonly text?: string;
}

class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private async sendEmail(options: EmailOptions): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error(`Failed to send email to ${options.to}:`, error);
      throw error;
    }
  }

  // Authentication emails
  async sendWelcomeEmail(email: string, userName: string): Promise<void> {
    const html = createWelcomeEmail(userName);
    await this.sendEmail({
      to: email,
      subject: "Welcome to MatrimonyApp! 🎉",
      html,
    });
  }

  async sendOtpEmail(email: string, userName: string, otp: string): Promise<void> {
    const html = createOtpEmail(userName, otp);
    await this.sendEmail({
      to: email,
      subject: "Your MatrimonyApp Verification Code",
      html,
      text: `Hi ${userName}, Your OTP code is: ${otp}. This code will expire in 10 minutes.`,
    });
  }

  async sendPasswordResetEmail(email: string, userName: string, resetUrl: string): Promise<void> {
    const html = createPasswordResetEmail(userName, resetUrl);
    await this.sendEmail({
      to: email,
      subject: "Reset Your MatrimonyApp Password",
      html,
    });
  }

  // Matching emails
  async sendMatchNotificationEmail(
    email: string,
    userName: string,
    matchData: {
      readonly name: string;
      readonly age: number;
      readonly location: string;
      readonly photo: string;
      readonly compatibilityScore: number;
      readonly profileUrl: string;
    }
  ): Promise<void> {
    const html = createMatchNotificationEmail(
      userName,
      matchData.name,
      matchData.age,
      matchData.location,
      matchData.photo,
      matchData.compatibilityScore,
      matchData.profileUrl
    );
    await this.sendEmail({
      to: email,
      subject: "🎯 New Compatible Match Found!",
      html,
    });
  }

  async sendInterestReceivedEmail(
    email: string,
    data: {
      readonly userName: string;
      readonly senderName: string;
      readonly senderAge: number;
      readonly senderLocation: string;
      readonly senderPhoto: string;
      readonly message: string;
      readonly profileUrl: string;
      readonly respondUrl: string;
    }
  ): Promise<void> {
    const html = createInterestReceivedEmail(data);
    await this.sendEmail({
      to: email,
      subject: "💝 Someone is Interested in You!",
      html,
    });
  }

  async sendInterestAcceptedEmail(
    email: string,
    userName: string,
    accepterName: string,
    accepterPhoto: string,
    chatUrl: string
  ): Promise<void> {
    const html = createInterestAcceptedEmail(userName, accepterName, accepterPhoto, chatUrl);
    await this.sendEmail({
      to: email,
      subject: "🎉 Your Interest Was Accepted!",
      html,
    });
  }

  // Notification emails
  async sendProfileViewNotificationEmail(
    email: string,
    userName: string,
    viewerData: {
      readonly name: string;
      readonly age: number;
      readonly location: string;
      readonly photo: string;
      readonly profileUrl: string;
    }
  ): Promise<void> {
    const html = createProfileViewNotificationEmail(
      userName,
      viewerData.name,
      viewerData.age,
      viewerData.location,
      viewerData.photo,
      viewerData.profileUrl
    );
    await this.sendEmail({
      to: email,
      subject: "👀 Someone Viewed Your Profile!",
      html,
    });
  }

  async sendNewMessageNotificationEmail(
    email: string,
    userName: string,
    senderName: string,
    messagePreview: string,
    chatUrl: string
  ): Promise<void> {
    const html = createNewMessageNotificationEmail(userName, senderName, messagePreview, chatUrl);
    await this.sendEmail({
      to: email,
      subject: `💬 New Message from ${senderName}`,
      html,
    });
  }

  async sendWeeklyDigestEmail(
    email: string,
    userName: string,
    stats: {
      readonly profileViews: number;
      readonly newMatches: number;
      readonly newMessages: number;
      readonly interestsSent: number;
      readonly interestsReceived: number;
    },
    topMatches: Array<{
      readonly name: string;
      readonly age: number;
      readonly location: string;
      readonly photo: string;
      readonly profileUrl: string;
    }>,
    dashboardUrl: string
  ): Promise<void> {
    const html = createWeeklyDigestEmail(userName, stats, topMatches, dashboardUrl);
    await this.sendEmail({
      to: email,
      subject: "📊 Your Weekly MatrimonyApp Summary",
      html,
    });
  }

  // System emails
  async sendProfileApprovalEmail(email: string, userName: string, dashboardUrl: string): Promise<void> {
    const html = createProfileApprovalEmail(userName, dashboardUrl);
    await this.sendEmail({
      to: email,
      subject: "✅ Profile Approved - Welcome to MatrimonyApp!",
      html,
    });
  }

  async sendProfileRejectionEmail(
    email: string,
    userName: string,
    rejectionReasons: string[],
    editProfileUrl: string
  ): Promise<void> {
    const html = createProfileRejectionEmail(userName, rejectionReasons, editProfileUrl);
    await this.sendEmail({
      to: email,
      subject: "Profile Review Required",
      html,
    });
  }

  async sendAccountSuspensionEmail(
    email: string,
    userName: string,
    suspensionReason: string,
    suspensionDuration: string,
    appealUrl: string
  ): Promise<void> {
    const html = createAccountSuspensionEmail(userName, suspensionReason, suspensionDuration, appealUrl);
    await this.sendEmail({
      to: email,
      subject: "Account Suspension Notice",
      html,
    });
  }

  async sendSubscriptionExpiryEmail(
    email: string,
    userName: string,
    subscriptionType: string,
    expiryDate: string,
    renewUrl: string
  ): Promise<void> {
    const html = createSubscriptionExpiryEmail(userName, subscriptionType, expiryDate, renewUrl);
    await this.sendEmail({
      to: email,
      subject: `⏰ Your ${subscriptionType} Subscription is Expiring Soon`,
      html,
    });
  }

  async sendMaintenanceNotificationEmail(
    email: string,
    userName: string,
    maintenanceDate: string,
    maintenanceTime: string,
    estimatedDuration: string
  ): Promise<void> {
    const html = createMaintenanceNotificationEmail(userName, maintenanceDate, maintenanceTime, estimatedDuration);
    await this.sendEmail({
      to: email,
      subject: "🔧 Scheduled Maintenance Notification",
      html,
    });
  }

  // Bulk email methods
  async sendBulkEmails(emails: EmailOptions[]): Promise<void> {
    const promises = emails.map(email => this.sendEmail(email));
    await Promise.allSettled(promises);
  }

  async sendAnnouncementEmail(
    recipients: string[],
    subject: string,
    content: string,
    ctaButton?: { text: string; url: string }
  ): Promise<void> {
    const { createEmailTemplate } = await import("./email-templates/base");
    const html = createEmailTemplate("MatrimonyApp Announcement", content, ctaButton);
    
    const emails = recipients.map(email => ({
      to: email,
      subject,
      html,
    }));

    await this.sendBulkEmails(emails);
  }
}

// Create singleton instance
const emailService = new EmailService();

// Export individual functions for backward compatibility
export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  await emailService.sendOtpEmail(email, "User", otp);
}

export async function sendWelcomeEmail(email: string, userName: string): Promise<void> {
  await emailService.sendWelcomeEmail(email, userName);
}

export async function sendPasswordResetEmail(email: string, userName: string, resetUrl: string): Promise<void> {
  await emailService.sendPasswordResetEmail(email, userName, resetUrl);
}

// Export the service instance
export default emailService;

