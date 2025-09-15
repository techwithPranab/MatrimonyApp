import { createEmailTemplate } from './base';

export function createWelcomeEmail(userName: string): string {
  const content = `
    <h2>Welcome to MatrimonyApp, ${userName}! 🎉</h2>
    
    <p>We're thrilled to have you join our community of individuals looking for meaningful relationships. Your journey to finding your perfect match starts here!</p>
    
    <div class="highlight">
      <h3 style="color: #667eea; margin: 0 0 15px 0;">What's Next?</h3>
      <p style="margin: 0;">Complete your profile to increase your chances of finding compatible matches. Add photos, personal details, and preferences to help others get to know you better.</p>
    </div>
    
    <p><strong>Here's what you can do now:</strong></p>
    <ul style="color: #666666; font-size: 16px; line-height: 1.6; padding-left: 20px;">
      <li>Complete your profile information</li>
      <li>Upload your best photos</li>
      <li>Set your match preferences</li>
      <li>Start browsing compatible profiles</li>
      <li>Send interests to profiles you like</li>
    </ul>
    
    <p>Our advanced matching algorithm will help you discover the most compatible profiles based on your preferences, interests, and values.</p>
    
    <p>If you have any questions or need assistance, our support team is here to help. You can reach us at <a href="mailto:support@matrimonyapp.com" style="color: #667eea;">support@matrimonyapp.com</a></p>
    
    <p style="margin-top: 30px;">
      <strong>Best wishes on your journey,</strong><br>
      The MatrimonyApp Team
    </p>
  `;

  return createEmailTemplate(
    'Welcome to MatrimonyApp!',
    content,
    {
      text: 'Complete Your Profile',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/profile/edit`
    }
  );
}

export function createOtpEmail(userName: string, otp: string): string {
  const content = `
    <h2>Your Verification Code</h2>
    
    <p>Hi ${userName},</p>
    
    <p>To complete your account verification, please use the following OTP code:</p>
    
    <div class="highlight">
      <h3 style="color: #667eea; font-size: 32px; margin: 0; font-family: monospace; letter-spacing: 4px;">${otp}</h3>
      <p style="margin: 15px 0 0 0; color: #888888; font-size: 14px;">This code will expire in 10 minutes</p>
    </div>
    
    <p>Enter this code in the verification form to activate your account and start connecting with potential matches.</p>
    
    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        <strong>Security Note:</strong> Never share this OTP with anyone. MatrimonyApp will never ask for your OTP via phone or email.
      </p>
    </div>
    
    <p>If you didn't request this verification code, please ignore this email or contact our support team.</p>
  `;

  return createEmailTemplate(
    'Your MatrimonyApp Verification Code',
    content
  );
}

export function createPasswordResetEmail(userName: string, resetUrl: string): string {
  const content = `
    <h2>Reset Your Password</h2>
    
    <p>Hi ${userName},</p>
    
    <p>We received a request to reset your password for your MatrimonyApp account. Click the button below to create a new password:</p>
    
    <div class="highlight">
      <p style="margin: 0; color: #666666;">This password reset link will expire in <strong>1 hour</strong> for security reasons.</p>
    </div>
    
    <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
    
    <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #155724; font-size: 14px;">
        <strong>Security Tip:</strong> Choose a strong password with a mix of letters, numbers, and special characters.
      </p>
    </div>
    
    <p>For your security, if you continue to have trouble accessing your account, please contact our support team.</p>
  `;

  return createEmailTemplate(
    'Reset Your MatrimonyApp Password',
    content,
    {
      text: 'Reset My Password',
      url: resetUrl
    }
  );
}
