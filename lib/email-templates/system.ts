import { createEmailTemplate } from './base';

export function createProfileApprovalEmail(userName: string, dashboardUrl: string): string {
  const content = `
    <h2>✅ Your Profile Has Been Approved!</h2>
    
    <p>Congratulations, ${userName}!</p>
    
    <p>Your profile has been reviewed and approved by our team. You can now enjoy all the features of MatrimonyApp and start connecting with potential matches!</p>
    
    <div class="highlight">
      <h3 style="color: #4caf50; margin: 0 0 15px 0; font-size: 22px;">🎉 You're All Set!</h3>
      <p style="margin: 0; color: #333;">Your profile is now visible to other members and eligible for matching.</p>
    </div>
    
    <p><strong>What you can do now:</strong></p>
    <ul style="color: #666666; font-size: 16px; line-height: 1.6; padding-left: 20px;">
      <li>Browse and search for compatible profiles</li>
      <li>Send interests to profiles you like</li>
      <li>Receive and respond to interests from others</li>
      <li>Start conversations with your matches</li>
      <li>Get matched automatically based on your preferences</li>
    </ul>
    
    <p>Our matching algorithm is already working to find you the most compatible profiles. Keep your profile updated and be active to increase your chances of finding your perfect match.</p>
    
    <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #155724; font-size: 14px;">
        <strong>Privacy Note:</strong> Your profile information is only visible to verified members. We take your privacy seriously.
      </p>
    </div>
  `;

  return createEmailTemplate(
    'Profile Approved - Welcome to MatrimonyApp!',
    content,
    {
      text: 'Start Exploring Matches',
      url: dashboardUrl
    }
  );
}

export function createProfileRejectionEmail(
  userName: string,
  rejectionReasons: string[],
  editProfileUrl: string
): string {
  const content = `
    <h2>Profile Review Update</h2>
    
    <p>Hi ${userName},</p>
    
    <p>Thank you for creating your profile on MatrimonyApp. After reviewing your submission, we need you to make some adjustments before we can approve your profile.</p>
    
    <div class="highlight">
      <h3 style="color: #ff9800; margin: 0 0 15px 0;">📝 Items to Address:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #333;">
        ${rejectionReasons.map(reason => `<li style="margin: 8px 0;">${reason}</li>`).join('')}
      </ul>
    </div>
    
    <p>These guidelines help us maintain a safe and trustworthy community for all members. Once you've made the necessary updates, our team will review your profile again within 24 hours.</p>
    
    <p><strong>Tips for a successful profile:</strong></p>
    <ul style="color: #666666; font-size: 16px; line-height: 1.6; padding-left: 20px;">
      <li>Use clear, recent photos of yourself</li>
      <li>Provide accurate and honest information</li>
      <li>Complete all required fields</li>
      <li>Use appropriate language in your bio</li>
      <li>Ensure your photos meet our community guidelines</li>
    </ul>
    
    <div style="background-color: #e3f2fd; border: 1px solid #bbdefb; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #1976d2; font-size: 14px;">
        <strong>Need Help?</strong> If you have questions about our guidelines or need assistance, contact our support team at <a href="mailto:support@matrimonyapp.com" style="color: #1976d2;">support@matrimonyapp.com</a>
      </p>
    </div>
  `;

  return createEmailTemplate(
    'Profile Review Required',
    content,
    {
      text: 'Update My Profile',
      url: editProfileUrl
    }
  );
}

export function createAccountSuspensionEmail(
  userName: string,
  suspensionReason: string,
  suspensionDuration: string,
  appealUrl: string
): string {
  const content = `
    <h2>Account Temporarily Suspended</h2>
    
    <p>Hi ${userName},</p>
    
    <p>We're writing to inform you that your MatrimonyApp account has been temporarily suspended due to a violation of our community guidelines.</p>
    
    <div class="highlight">
      <h3 style="color: #f44336; margin: 0 0 10px 0;">Suspension Details:</h3>
      <p style="margin: 0; color: #333;"><strong>Reason:</strong> ${suspensionReason}</p>
      <p style="margin: 10px 0 0 0; color: #333;"><strong>Duration:</strong> ${suspensionDuration}</p>
    </div>
    
    <p>During this suspension period, you will not be able to:</p>
    <ul style="color: #666666; font-size: 16px; line-height: 1.6; padding-left: 20px;">
      <li>Send or receive messages</li>
      <li>Send interests to other profiles</li>
      <li>View other member profiles</li>
      <li>Update your profile information</li>
    </ul>
    
    <p>We take community safety seriously and enforce these measures to protect all our members. We encourage you to review our community guidelines during this time.</p>
    
    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        <strong>Important:</strong> Repeated violations may result in permanent account termination. Please ensure future interactions comply with our guidelines.
      </p>
    </div>
    
    <p>If you believe this suspension was made in error, you can submit an appeal using the link below.</p>
  `;

  return createEmailTemplate(
    'Account Suspension Notice',
    content,
    {
      text: 'Submit Appeal',
      url: appealUrl
    },
    `
    <div style="text-align: center; margin-top: 20px;">
      <a href="#" style="color: #667eea; font-size: 14px; text-decoration: none;">Review Community Guidelines</a>
    </div>
    `
  );
}

export function createSubscriptionExpiryEmail(
  userName: string,
  subscriptionType: string,
  expiryDate: string,
  renewUrl: string
): string {
  const content = `
    <h2>⏰ Your ${subscriptionType} Subscription is Expiring Soon</h2>
    
    <p>Hi ${userName},</p>
    
    <p>Your ${subscriptionType} subscription will expire on <strong>${expiryDate}</strong>. Don't miss out on connecting with your potential matches!</p>
    
    <div class="highlight">
      <h3 style="color: #ff9800; margin: 0 0 15px 0;">What happens after expiry:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #333;">
        <li>Limited profile views per day</li>
        <li>Restricted messaging capabilities</li>
        <li>No access to advanced search filters</li>
        <li>Reduced match recommendations</li>
      </ul>
    </div>
    
    <p><strong>Renew now to continue enjoying:</strong></p>
    <ul style="color: #666666; font-size: 16px; line-height: 1.6; padding-left: 20px;">
      <li>Unlimited profile views and searches</li>
      <li>Advanced matching algorithms</li>
      <li>Priority customer support</li>
      <li>Enhanced privacy controls</li>
      <li>Detailed match analytics</li>
    </ul>
    
    <div style="background-color: #e8f5e8; border: 1px solid #c8e6c9; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #2e7d32; font-size: 14px;">
        <strong>Special Offer:</strong> Renew within 7 days and get an additional month free on your subscription!
      </p>
    </div>
    
    <p>Don't let your search for love pause. Renew your subscription today and continue building meaningful connections.</p>
  `;

  return createEmailTemplate(
    'Subscription Expiring Soon',
    content,
    {
      text: `Renew ${subscriptionType} Subscription`,
      url: renewUrl
    }
  );
}

export function createMaintenanceNotificationEmail(
  userName: string,
  maintenanceDate: string,
  maintenanceTime: string,
  estimatedDuration: string
): string {
  const content = `
    <h2>🔧 Scheduled Maintenance Notification</h2>
    
    <p>Hi ${userName},</p>
    
    <p>We're writing to inform you about scheduled maintenance on MatrimonyApp to improve your experience with better performance and new features.</p>
    
    <div class="highlight">
      <h3 style="color: #2196f3; margin: 0 0 15px 0;">Maintenance Schedule:</h3>
      <p style="margin: 0; color: #333;"><strong>Date:</strong> ${maintenanceDate}</p>
      <p style="margin: 10px 0 0 0; color: #333;"><strong>Time:</strong> ${maintenanceTime}</p>
      <p style="margin: 10px 0 0 0; color: #333;"><strong>Expected Duration:</strong> ${estimatedDuration}</p>
    </div>
    
    <p>During this maintenance window, MatrimonyApp will be temporarily unavailable. You may experience:</p>
    <ul style="color: #666666; font-size: 16px; line-height: 1.6; padding-left: 20px;">
      <li>Inability to log in or access your account</li>
      <li>Temporary interruption of messaging services</li>
      <li>Brief downtime for mobile app features</li>
    </ul>
    
    <p><strong>What we're improving:</strong></p>
    <ul style="color: #666666; font-size: 16px; line-height: 1.6; padding-left: 20px;">
      <li>Enhanced matching algorithm performance</li>
      <li>Improved mobile app responsiveness</li>
      <li>Better security features</li>
      <li>New communication tools</li>
    </ul>
    
    <div style="background-color: #e3f2fd; border: 1px solid #bbdefb; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #1976d2; font-size: 14px;">
        <strong>Stay Updated:</strong> Follow our social media pages for real-time updates during the maintenance period.
      </p>
    </div>
    
    <p>We apologize for any inconvenience and appreciate your patience as we work to enhance your MatrimonyApp experience.</p>
  `;

  return createEmailTemplate(
    'Scheduled Maintenance Notice',
    content,
    undefined,
    `
    <div style="text-align: center; margin-top: 20px;">
      <p style="margin: 0; color: #666; font-size: 14px;">
        Questions? Contact us at <a href="mailto:support@matrimonyapp.com" style="color: #667eea;">support@matrimonyapp.com</a>
      </p>
    </div>
    `
  );
}
