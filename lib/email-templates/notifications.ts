import { createEmailTemplate } from './base';

export function createProfileViewNotificationEmail(
  userName: string,
  viewerName: string,
  viewerAge: number,
  viewerLocation: string,
  viewerPhoto: string,
  profileUrl: string
): string {
  const content = `
    <h2>👀 Someone Viewed Your Profile!</h2>
    
    <p>Hi ${userName},</p>
    
    <p>${viewerName} recently viewed your profile and might be interested in getting to know you better.</p>
    
    <div class="highlight">
      <div style="display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center;">
        <div style="width: 70px; height: 70px; border-radius: 50%; overflow: hidden; margin-bottom: 10px; border: 2px solid #667eea;">
          <img src="${viewerPhoto}" alt="${viewerName}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <h3 style="color: #333; margin: 0 0 5px 0; font-size: 18px;">${viewerName}, ${viewerAge}</h3>
        <p style="color: #666; margin: 0;">${viewerLocation}</p>
      </div>
    </div>
    
    <p>Profile views are often the first step towards meaningful connections. Why not take a look at their profile and see if you're interested too?</p>
    
    <div style="background-color: #e8f5e8; border: 1px solid #c8e6c9; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #2e7d32; font-size: 14px;">
        <strong>Quick Tip:</strong> If you find their profile interesting, sending an interest is a great way to start a conversation!
      </p>
    </div>
  `;

  return createEmailTemplate(
    'Someone Viewed Your Profile',
    content,
    {
      text: 'View Their Profile',
      url: profileUrl
    }
  );
}

export function createNewMessageNotificationEmail(
  userName: string,
  senderName: string,
  messagePreview: string,
  chatUrl: string
): string {
  const content = `
    <h2>💬 New Message from ${senderName}</h2>
    
    <p>Hi ${userName},</p>
    
    <p>You have a new message waiting for you!</p>
    
    <div class="highlight">
      <h3 style="color: #667eea; margin: 0 0 10px 0; font-size: 18px;">From: ${senderName}</h3>
      <div style="background-color: #f8f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
        <p style="margin: 0; font-style: italic; color: #444; font-size: 15px;">
          "${messagePreview}"
        </p>
      </div>
    </div>
    
    <p>Don't keep them waiting! Reply to continue your conversation and build a meaningful connection.</p>
    
    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        <strong>Response Tip:</strong> Thoughtful and timely responses help build trust and show genuine interest.
      </p>
    </div>
  `;

  return createEmailTemplate(
    `New Message from ${senderName}`,
    content,
    {
      text: 'Reply Now',
      url: chatUrl
    }
  );
}

export function createWeeklyDigestEmail(
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
): string {
  const content = `
    <h2>📊 Your Weekly Activity Summary</h2>
    
    <p>Hi ${userName},</p>
    
    <p>Here's what happened on your MatrimonyApp journey this week:</p>
    
    <div class="highlight">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 20px; text-align: center;">
        <div>
          <div style="font-size: 24px; font-weight: bold; color: #667eea;">${stats.profileViews}</div>
          <div style="font-size: 14px; color: #666;">Profile Views</div>
        </div>
        <div>
          <div style="font-size: 24px; font-weight: bold; color: #4caf50;">${stats.newMatches}</div>
          <div style="font-size: 14px; color: #666;">New Matches</div>
        </div>
        <div>
          <div style="font-size: 24px; font-weight: bold; color: #ff9800;">${stats.newMessages}</div>
          <div style="font-size: 14px; color: #666;">Messages</div>
        </div>
        <div>
          <div style="font-size: 24px; font-weight: bold; color: #e91e63;">${stats.interestsReceived}</div>
          <div style="font-size: 14px; color: #666;">Interests Received</div>
        </div>
      </div>
    </div>
    
    ${topMatches.length > 0 ? `
    <p><strong>🎯 Top Matches This Week:</strong></p>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0;">
      ${topMatches.slice(0, 3).map(match => `
        <div style="text-align: center; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden; margin: 0 auto 10px; border: 2px solid #667eea;">
            <img src="${match.photo}" alt="${match.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${match.name}, ${match.age}</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 10px;">${match.location}</div>
          <a href="${match.profileUrl}" style="font-size: 12px; color: #667eea; text-decoration: none;">View Profile</a>
        </div>
      `).join('')}
    </div>
    ` : '<p>No new matches this week, but don\'t worry - keep your profile active and updated!</p>'}
    
    <p><strong>💡 Tips to increase your matches:</strong></p>
    <ul style="color: #666666; font-size: 16px; line-height: 1.6; padding-left: 20px;">
      <li>Update your profile photos regularly</li>
      <li>Complete all sections of your profile</li>
      <li>Be active - view and interact with other profiles</li>
      <li>Send personalized interest messages</li>
      <li>Respond promptly to messages</li>
    </ul>
    
    <div style="background-color: #e3f2fd; border: 1px solid #bbdefb; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #1976d2; font-size: 14px;">
        <strong>Success Stories:</strong> Many of our members found their perfect match within their first month. Stay active and positive!
      </p>
    </div>
  `;

  return createEmailTemplate(
    'Your Weekly MatrimonyApp Summary',
    content,
    {
      text: 'View Full Dashboard',
      url: dashboardUrl
    }
  );
}
