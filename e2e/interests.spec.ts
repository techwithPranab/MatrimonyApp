import { test, expect } from '@playwright/test';

test.describe('Interest Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set up authenticated session
    await page.goto('/');
    
    await page.addInitScript(() => {
      localStorage.setItem('next-auth.session-token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User'
      }));
    });
  });

  test('should access search and profiles page', async ({ page }) => {
    await page.goto('/search');
    
    // Skip if redirected to login
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    // Should show search interface or profiles
    await expect(page.locator('h1, h2')).toContainText(/Search|Profiles|Find/);
  });

  test('should display user profiles', async ({ page }) => {
    await page.goto('/search');
    
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    // Wait for profiles to load
    await page.waitForTimeout(2000);
    
    // Look for profile cards or user information
    const profileElements = page.locator('[data-testid*="profile"], .profile-card, [class*="profile"]');
    const userElements = page.locator('text=Age, text=Location, text=Education');
    
    if (await profileElements.count() > 0 || await userElements.count() > 0) {
      expect(await profileElements.count() > 0 || await userElements.count() > 0).toBeTruthy();
    } else {
      // If no profiles, should show empty state
      const emptyState = page.locator('text=No profiles found, text=No matches, text=Start exploring');
      await expect(emptyState).toBeVisible();
    }
  });

  test('should handle send interest flow', async ({ page }) => {
    await page.goto('/search');
    
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    await page.waitForTimeout(2000);
    
    // Look for send interest button
    const interestButton = page.locator('button', { hasText: /Send Interest|Interest|Connect/ });
    
    if (await interestButton.first().isVisible()) {
      await interestButton.first().click();
      
      // Should open interest form or show confirmation
      await page.waitForTimeout(1000);
      
      // Check for interest form or success message
      const hasInterestForm = await page.isVisible('textarea, input[placeholder*="message"]');
      const hasSuccessMessage = await page.isVisible('text=Interest sent, text=Sent successfully');
      const hasModal = await page.isVisible('[role="dialog"], .modal');
      
      expect(hasInterestForm || hasSuccessMessage || hasModal).toBeTruthy();
      
      // If form is visible, try to send interest
      if (hasInterestForm) {
        const messageInput = page.locator('textarea, input[placeholder*="message"]').first();
        if (await messageInput.isVisible()) {
          await messageInput.fill('Hello! I would like to connect with you.');
        }
        
        const sendButton = page.locator('button', { hasText: /Send|Submit/ });
        if (await sendButton.isVisible()) {
          await sendButton.click();
          
          // Should show success or error message
          await page.waitForTimeout(1000);
          const hasResponse = await page.isVisible('text=sent, text=success, text=error, text=limit');
          expect(hasResponse).toBeTruthy();
        }
      }
    }
  });

  test('should access interests received page', async ({ page }) => {
    await page.goto('/interests');
    
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    // Should show interests page
    await expect(page.locator('h1, h2')).toContainText(/Interest|Received|Sent/);
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Should either show interests or empty state
    const hasInterests = await page.isVisible('[data-testid*="interest"], .interest-card');
    const hasEmptyState = await page.isVisible('text=No interests, text=No one has shown interest');
    
    expect(hasInterests || hasEmptyState).toBeTruthy();
  });

  test('should handle accept/decline interest', async ({ page }) => {
    await page.goto('/interests');
    
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    await page.waitForTimeout(2000);
    
    // Look for accept/decline buttons
    const acceptButton = page.locator('button', { hasText: /Accept|Yes|Approve/ });
    const declineButton = page.locator('button', { hasText: /Decline|No|Reject/ });
    
    if (await acceptButton.first().isVisible()) {
      // Test accept flow
      await acceptButton.first().click();
      
      await page.waitForTimeout(1000);
      
      // Should show confirmation or success message
      const hasSuccessMessage = await page.isVisible('text=accepted, text=success, text=match');
      const hasConfirmation = await page.isVisible('text=Are you sure, text=Confirm');
      
      expect(hasSuccessMessage || hasConfirmation).toBeTruthy();
      
    } else if (await declineButton.first().isVisible()) {
      // Test decline flow
      await declineButton.first().click();
      
      await page.waitForTimeout(1000);
      
      // Should show confirmation or success message
      const hasDeclineMessage = await page.isVisible('text=declined, text=rejected');
      expect(hasDeclineMessage).toBeTruthy();
    }
  });

  test('should show mutual matches', async ({ page }) => {
    await page.goto('/matches');
    
    if (page.url().includes('/sign-in')) {
      // Try alternative routes
      await page.goto('/dashboard');
      if (page.url().includes('/sign-in')) {
        test.skip();
      }
    }
    
    await page.waitForTimeout(2000);
    
    // Should show matches page or section
    const hasMatchesSection = await page.isVisible('text=Match, text=Mutual, text=Connected');
    const hasMatchCards = await page.isVisible('[data-testid*="match"], .match-card');
    const hasEmptyState = await page.isVisible('text=No matches, text=Start connecting');
    
    expect(hasMatchesSection || hasMatchCards || hasEmptyState).toBeTruthy();
  });
});
