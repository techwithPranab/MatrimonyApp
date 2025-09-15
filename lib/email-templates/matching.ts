import { createEmailTemplate } from './base';

export function createMatchNotificationEmail(
  userName: string,
  matchName: string,
  matchAge: number,
  matchLocation: string,
  matchPhoto: string,
  compatibilityScore: number,
  profileUrl: string
): string {
  const content = `
    <h2>🎯 New Match Found!</h2>
    
    <p>Great news, ${userName}!</p>
    
    <p>We found a highly compatible match for you based on your preferences and interests.</p>
    
    <div class="highlight">
      <div style="display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center;">
        <div style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; margin-bottom: 15px; border: 4px solid #667eea;">
          <img src="${matchPhoto}" alt="${matchName}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <h3 style="color: #333; margin: 0 0 5px 0; font-size: 22px;">${matchName}, ${matchAge}</h3>
        <p style="color: #666; margin: 0 0 15px 0; font-size: 16px;">${matchLocation}</p>
        
        <div style="background-color: #667eea; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600;">
          ${compatibilityScore}% Match
        </div>
      </div>
    </div>
    
    <p><strong>Why this is a great match:</strong></p>
    <ul style="color: #666666; font-size: 16px; line-height: 1.8; padding-left: 20px;">
      <li>Shared interests and values</li>
      <li>Compatible lifestyle preferences</li>
      <li>Similar educational background</li>
      <li>Matching location preferences</li>
    </ul>
    
    <p>Don't wait too long – the best matches get discovered quickly! View their full profile and send an interest to start a meaningful conversation.</p>
    
    <div style="background-color: #e3f2fd; border: 1px solid #bbdefb; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #1976d2; font-size: 14px;">
        <strong>Pro Tip:</strong> Personalize your interest message to increase your chances of getting a positive response!
      </p>
    </div>
  `;

  return createEmailTemplate(
    'New Compatible Match Found!',
    content,
    {
      text: 'View Profile & Send Interest',
      url: profileUrl
    }
  );
}

interface InterestReceivedData {
  readonly userName: string;
  readonly senderName: string;
  readonly senderAge: number;
  readonly senderLocation: string;
  readonly senderPhoto: string;
  readonly message: string;
  readonly profileUrl: string;
  readonly respondUrl: string;
}

export function createInterestReceivedEmail(data: InterestReceivedData): string {
  const { userName, senderName, senderAge, senderLocation, senderPhoto, message, profileUrl, respondUrl } = data;
  const content = `
    <h2>💝 Someone is Interested in You!</h2>
    
    <p>Wonderful news, ${userName}!</p>
    
    <p>${senderName} has sent you an interest and would like to connect with you.</p>
    
    <div class="highlight">
      <div style="display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center;">
        <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; margin-bottom: 15px; border: 3px solid #667eea;">
          <img src="${senderPhoto}" alt="${senderName}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <h3 style="color: #333; margin: 0 0 5px 0; font-size: 20px;">${senderName}, ${senderAge}</h3>
        <p style="color: #666; margin: 0 0 15px 0;">${senderLocation}</p>
        
        ${message ? `
        <div style="background-color: #f8f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; margin-top: 15px;">
          <p style="margin: 0; font-style: italic; color: #444; font-size: 15px;">
            "${message}"
          </p>
        </div>
        ` : ''}
      </div>
    </div>
    
    <p>This could be the beginning of something special! Take a moment to review their profile and decide if you'd like to connect.</p>
    
    <p><strong>You can:</strong></p>
    <ul style="color: #666666; font-size: 16px; line-height: 1.6; padding-left: 20px;">
      <li>Accept the interest to start chatting</li>
      <li>View their complete profile</li>
      <li>Send a personalized response</li>
      <li>Politely decline if not interested</li>
    </ul>
    
    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        <strong>Remember:</strong> Be respectful and kind in your interactions. Everyone deserves to be treated with dignity.
      </p>
    </div>
  `;

  return createEmailTemplate(
    'New Interest Received!',
    content,
    {
      text: 'View Profile & Respond',
      url: respondUrl
    },
    `
    <div style="text-align: center; margin-top: 20px;">
      <a href="${profileUrl}" style="display: inline-block; background-color: transparent; color: #667eea; border: 2px solid #667eea; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin: 0 10px; font-size: 14px;">
        View Full Profile
      </a>
    </div>
    `
  );
}

export function createInterestAcceptedEmail(
  userName: string,
  accepterName: string,
  accepterPhoto: string,
  chatUrl: string
): string {
  const content = `
    <h2>🎉 Your Interest Was Accepted!</h2>
    
    <p>Fantastic news, ${userName}!</p>
    
    <p>${accepterName} has accepted your interest! You can now start chatting and get to know each other better.</p>
    
    <div class="highlight">
      <div style="display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center;">
        <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; margin-bottom: 15px; border: 3px solid #4caf50;">
          <img src="${accepterPhoto}" alt="${accepterName}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <h3 style="color: #4caf50; margin: 0 0 10px 0; font-size: 20px;">✨ It's a Match!</h3>
        <p style="color: #666; margin: 0;">${accepterName} is interested in getting to know you</p>
      </div>
    </div>
    
    <p><strong>What happens next?</strong></p>
    <ul style="color: #666666; font-size: 16px; line-height: 1.6; padding-left: 20px;">
      <li>Start a meaningful conversation</li>
      <li>Share your interests and hobbies</li>
      <li>Ask thoughtful questions</li>
      <li>Be genuine and authentic</li>
      <li>Respect boundaries and take it slow</li>
    </ul>
    
    <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #155724; font-size: 14px;">
        <strong>Conversation Starters:</strong> Ask about their hobbies, travel experiences, favorite books, or career aspirations to break the ice!
      </p>
    </div>
    
    <p>This is an exciting step forward. We wish you both the very best in getting to know each other!</p>
  `;

  return createEmailTemplate(
    'Your Interest Was Accepted!',
    content,
    {
      text: 'Start Chatting Now',
      url: chatUrl
    }
  );
}
