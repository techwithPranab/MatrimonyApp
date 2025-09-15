import emailService from '../email';

interface TestEmailData {
  readonly email: string;
  readonly userName: string;
}

export async function sendTestEmails(testData: TestEmailData): Promise<void> {
  try {
    console.log('🧪 Testing email templates...');
    
    // Test welcome email
    console.log('📧 Testing welcome email...');
    await emailService.sendWelcomeEmail(testData.email, testData.userName);
    
    // Test OTP email
    console.log('📧 Testing OTP email...');
    await emailService.sendOtpEmail(testData.email, testData.userName, '123456');
    
    // Test password reset email
    console.log('📧 Testing password reset email...');
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=test-token`;
    await emailService.sendPasswordResetEmail(testData.email, testData.userName, resetUrl);
    
    // Test match notification
    console.log('📧 Testing match notification email...');
    await emailService.sendMatchNotificationEmail(testData.email, testData.userName, {
      name: 'John Doe',
      age: 28,
      location: 'Mumbai, Maharashtra',
      photo: 'https://via.placeholder.com/150',
      compatibilityScore: 92,
      profileUrl: `${process.env.NEXT_PUBLIC_APP_URL}/profile/test-profile`,
    });
    
    // Test interest received
    console.log('📧 Testing interest received email...');
    await emailService.sendInterestReceivedEmail(testData.email, {
      userName: testData.userName,
      senderName: 'Jane Smith',
      senderAge: 26,
      senderLocation: 'Delhi, Delhi',
      senderPhoto: 'https://via.placeholder.com/150',
      message: 'Hi! I found your profile interesting and would love to connect.',
      profileUrl: `${process.env.NEXT_PUBLIC_APP_URL}/profile/jane-smith`,
      respondUrl: `${process.env.NEXT_PUBLIC_APP_URL}/interests`,
    });
    
    // Test profile approval
    console.log('📧 Testing profile approval email...');
    await emailService.sendProfileApprovalEmail(
      testData.email, 
      testData.userName, 
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );
    
    // Test weekly digest
    console.log('📧 Testing weekly digest email...');
    await emailService.sendWeeklyDigestEmail(
      testData.email,
      testData.userName,
      {
        profileViews: 25,
        newMatches: 5,
        newMessages: 12,
        interestsSent: 8,
        interestsReceived: 3,
      },
      [
        {
          name: 'Alex Johnson',
          age: 30,
          location: 'Bangalore, Karnataka',
          photo: 'https://via.placeholder.com/150',
          profileUrl: `${process.env.NEXT_PUBLIC_APP_URL}/profile/alex-johnson`,
        },
        {
          name: 'Sarah Wilson',
          age: 27,
          location: 'Pune, Maharashtra',
          photo: 'https://via.placeholder.com/150',
          profileUrl: `${process.env.NEXT_PUBLIC_APP_URL}/profile/sarah-wilson`,
        },
      ],
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );
    
    console.log('✅ All email templates tested successfully!');
    
  } catch (error) {
    console.error('❌ Email template testing failed:', error);
    throw error;
  }
}

export async function previewEmailTemplates(): Promise<string[]> {
  const { createWelcomeEmail, createOtpEmail } = await import('./auth');
  const { createMatchNotificationEmail } = await import('./matching');
  
  const testUserName = 'John Doe';
  const testOtp = '123456';
  
  return [
    createWelcomeEmail(testUserName),
    createOtpEmail(testUserName, testOtp),
    createMatchNotificationEmail(
      testUserName,
      'Jane Smith',
      26,
      'Mumbai, Maharashtra',
      'https://via.placeholder.com/150',
      92,
      `${process.env.NEXT_PUBLIC_APP_URL}/profile/test`
    ),
  ];
}

// Email template validation
export function validateEmailTemplate(html: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for required elements
  if (!html.includes('<!DOCTYPE html>')) {
    errors.push('Missing DOCTYPE declaration');
  }
  
  if (!html.includes('<meta name="viewport"')) {
    errors.push('Missing viewport meta tag');
  }
  
  if (!html.includes('font-family')) {
    errors.push('Missing font-family styles');
  }
  
  // Check for responsive styles
  if (!html.includes('@media screen and (max-width:')) {
    errors.push('Missing mobile responsive styles');
  }
  
  // Check for accessibility
  if (!html.includes('alt=')) {
    errors.push('Images missing alt attributes');
  }
  
  // Check for unsubscribe link (required for marketing emails)
  if (!html.includes('unsubscribe')) {
    errors.push('Missing unsubscribe link');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Email sending queue for bulk operations
interface QueuedEmail {
  readonly id: string;
  readonly priority: 'high' | 'medium' | 'low';
  sendAt: Date;
  retries: number;
  readonly maxRetries: number;
  readonly emailOptions: {
    readonly to: string;
    readonly subject: string;
    readonly html: string;
  };
}

export class EmailQueue {
  private queue: QueuedEmail[] = [];
  private processing = false;

  add(email: Omit<QueuedEmail, 'id' | 'retries'>): void {
    this.queue.push({
      ...email,
      id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      retries: 0,
    });
    
    this.queue.sort((a, b) => {
      // Sort by priority first, then by send time
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.sendAt.getTime() - b.sendAt.getTime();
    });

    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    
    while (this.queue.length > 0) {
      const email = this.queue[0];
      
      // Check if it's time to send
      if (email.sendAt > new Date()) {
        break;
      }
      
      try {
        await emailService['sendEmail'](email.emailOptions);
        this.queue.shift(); // Remove successfully sent email
      } catch (error) {
        console.error(`Failed to send email ${email.id}:`, error);
        
        if (email.retries < email.maxRetries) {
          // Retry with exponential backoff
          email.retries++;
          email.sendAt = new Date(Date.now() + Math.pow(2, email.retries) * 60000); // 2^retries minutes
          this.queue.sort((a, b) => a.sendAt.getTime() - b.sendAt.getTime());
        } else {
          // Max retries reached, remove from queue
          console.error(`Max retries reached for email ${email.id}, removing from queue`);
          this.queue.shift();
        }
      }
    }
    
    this.processing = false;
    
    // Schedule next processing if there are more emails
    if (this.queue.length > 0) {
      const nextEmail = this.queue[0];
      const delay = Math.max(0, nextEmail.sendAt.getTime() - Date.now());
      setTimeout(() => this.processQueue(), delay);
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getPendingEmails(): QueuedEmail[] {
    return [...this.queue];
  }
}

// Export singleton email queue
export const emailQueue = new EmailQueue();
