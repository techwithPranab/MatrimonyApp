import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to sign-in page', async ({ page }) => {
    await page.click('text=Sign In');
    await expect(page).toHaveURL('/sign-in');
    await expect(page.locator('h1')).toContainText('Sign In');
  });

  test('should navigate to sign-up page', async ({ page }) => {
    await page.click('text=Sign Up');
    await expect(page).toHaveURL('/sign-up');
    await expect(page.locator('h1')).toContainText('Sign Up');
  });

  test('should show validation errors for empty sign-in form', async ({ page }) => {
    await page.goto('/sign-in');
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/sign-in');
    
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
  });

  test('should attempt sign-in with valid credentials', async ({ page }) => {
    await page.goto('/sign-in');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should either redirect on success or show error message
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    
    // Either we're redirected to dashboard or we see an error message
    expect(currentUrl === '/dashboard' || await page.isVisible('text=Invalid credentials')).toBeTruthy();
  });

  test('should register new user with valid data', async ({ page }) => {
    await page.goto('/sign-up');
    
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Should show success message or redirect
    await page.waitForTimeout(2000);
    
    // Check for success indicators
    const hasSuccessMessage = await page.isVisible('text=Registration successful');
    const hasVerificationMessage = await page.isVisible('text=Please verify your email');
    const isRedirected = page.url().includes('/verify') || page.url().includes('/dashboard');
    
    expect(hasSuccessMessage || hasVerificationMessage || isRedirected).toBeTruthy();
  });
});
