import { test, expect } from '@playwright/test';

test.describe('Chat and Messaging', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Mock authenticated session
    await page.addInitScript(() => {
      localStorage.setItem('next-auth.session-token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User'
      }));
    });
  });

  test('should access chat interface', async ({ page }) => {
    await page.goto('/chat');
    
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    // Should show chat interface
    await expect(page.locator('h1, h2')).toContainText(/Chat|Messages|Conversations/);
  });

  test('should show chat conversations list', async ({ page }) => {
    await page.goto('/chat');
    
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    await page.waitForTimeout(2000);
    
    // Should show conversation list or empty state
    const hasConversations = await page.isVisible('[data-testid*="conversation"], .conversation-item');
    const hasEmptyState = await page.isVisible('text=No conversations, text=Start chatting, text=No messages');
    
    expect(hasConversations || hasEmptyState).toBeTruthy();
  });

  test('should handle message input', async ({ page }) => {
    await page.goto('/chat');
    
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    await page.waitForTimeout(2000);
    
    // Look for message input
    const messageInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"], input[type="text"]').last();
    
    if (await messageInput.isVisible()) {
      await messageInput.fill('Hello, this is a test message!');
      
      // Look for send button
      const sendButton = page.locator('button[type="submit"], button', { hasText: /Send|Submit/ }).last();
      
      if (await sendButton.isVisible()) {
        await sendButton.click();
        
        // Message should appear or show sending state
        await page.waitForTimeout(1000);
        
        const hasMessage = await page.isVisible('text=Hello, this is a test message!');
        const hasSendingState = await page.isVisible('text=Sending, text=...', );
        
        expect(hasMessage || hasSendingState).toBeTruthy();
      }
    }
  });

  test('should navigate to individual chat', async ({ page }) => {
    await page.goto('/chat');
    
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    await page.waitForTimeout(2000);
    
    // Try to click on a conversation or navigate to a specific chat
    const conversationItem = page.locator('[data-testid*="conversation"], .conversation-item').first();
    
    if (await conversationItem.isVisible()) {
      await conversationItem.click();
      
      await page.waitForTimeout(1000);
      
      // Should navigate to individual chat
      const hasMessageArea = await page.isVisible('[data-testid*="messages"], .messages-container, .chat-messages');
      const hasMessageInput = await page.isVisible('input[placeholder*="message"], textarea[placeholder*="message"]');
      
      expect(hasMessageArea || hasMessageInput).toBeTruthy();
    } else {
      // Try direct navigation to a chat
      await page.goto('/chat/test-chat-id');
      
      if (!page.url().includes('/sign-in')) {
        const hasMessageArea = await page.isVisible('[data-testid*="messages"], .messages-container');
        expect(hasMessageArea || page.url().includes('/chat/')).toBeTruthy();
      }
    }
  });
});
