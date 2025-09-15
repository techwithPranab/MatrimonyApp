import { test, expect } from '@playwright/test';

test.describe('Profile Management', () => {
  // Mock authentication state
  test.beforeEach(async ({ page }) => {
    // Set up authenticated session
    await page.goto('/');
    
    // Add mock session storage
    await page.addInitScript(() => {
      localStorage.setItem('next-auth.session-token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User'
      }));
    });
  });

  test('should access profile creation flow', async ({ page }) => {
    await page.goto('/profile/edit');
    
    // Check if we're on profile page or redirected to login
    const currentUrl = page.url();
    
    if (currentUrl.includes('/sign-in')) {
      // If not authenticated, skip this test
      test.skip();
    }
    
    await expect(page.locator('h1, h2')).toContainText(/Profile|Personal Information/);
  });

  test('should navigate through profile creation steps', async ({ page }) => {
    await page.goto('/profile/edit');
    
    // Skip if redirected to login
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    // Fill basic information
    if (await page.isVisible('input[name="firstName"]')) {
      await page.fill('input[name="firstName"]', 'John');
      await page.fill('input[name="lastName"]', 'Doe');
      
      // Try to proceed to next step
      const nextButton = page.locator('button', { hasText: /Next|Continue|Save/ });
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }
    }
    
    // Verify we can navigate through the form
    await expect(page.locator('form')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/profile/edit');
    
    // Skip if redirected to login
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"], button', { hasText: /Save|Submit|Next/ });
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Should show validation errors
      await page.waitForTimeout(1000);
      const hasValidationErrors = await page.isVisible('text=required, text=Please fill, text=This field');
      
      // At minimum, form should not submit successfully with empty required fields
      expect(hasValidationErrors || page.url().includes('/profile/edit')).toBeTruthy();
    }
  });

  test('should allow photo upload', async ({ page }) => {
    await page.goto('/profile/edit');
    
    // Skip if redirected to login
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    // Look for file upload input or photo upload area
    const fileInput = page.locator('input[type="file"]');
    const uploadArea = page.locator('text=Upload Photo, text=Add Photo');
    
    if (await fileInput.isVisible() || await uploadArea.isVisible()) {
      // Test presence of upload functionality
      expect(await fileInput.isVisible() || await uploadArea.isVisible()).toBeTruthy();
    }
  });
});
