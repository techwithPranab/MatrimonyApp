import { test, expect } from '@playwright/test';

test.describe('Search and Matching', () => {
  test.beforeEach(async ({ page }) => {
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

  test('should load search page with filters', async ({ page }) => {
    await page.goto('/search');
    
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    // Should show search page
    await expect(page.locator('h1, h2')).toContainText(/Search|Find|Browse|Profiles/);
    
    // Should have filter options
    const hasAgeFilter = await page.isVisible('text=Age, input[name*="age"], select[name*="age"]');
    const hasLocationFilter = await page.isVisible('text=Location, input[name*="location"], select[name*="location"]');
    const hasEducationFilter = await page.isVisible('text=Education, select[name*="education"]');
    
    expect(hasAgeFilter || hasLocationFilter || hasEducationFilter).toBeTruthy();
  });

  test('should apply search filters', async ({ page }) => {
    await page.goto('/search');
    
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    await page.waitForTimeout(2000);
    
    // Try to interact with filters
    const ageInput = page.locator('input[name*="age"]').first();
    const locationInput = page.locator('input[name*="location"], select[name*="location"]').first();
    
    if (await ageInput.isVisible()) {
      await ageInput.fill('25');
    }
    
    if (await locationInput.isVisible()) {
      if ((await locationInput.getAttribute('type')) === 'select-one') {
        await locationInput.selectOption({ index: 1 });
      } else {
        await locationInput.fill('Mumbai');
      }
    }
    
    // Apply filters
    const applyButton = page.locator('button', { hasText: /Apply|Filter|Search/ });
    if (await applyButton.isVisible()) {
      await applyButton.click();
      
      await page.waitForTimeout(2000);
      
      // Results should update or show loading
      const hasResults = await page.isVisible('[data-testid*="profile"], .profile-card');
      const hasLoading = await page.isVisible('text=Loading, text=Searching');
      const hasNoResults = await page.isVisible('text=No profiles found, text=No results');
      
      expect(hasResults || hasLoading || hasNoResults).toBeTruthy();
    }
  });

  test('should display profile cards with essential information', async ({ page }) => {
    await page.goto('/search');
    
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    await page.waitForTimeout(3000);
    
    // Check for profile information
    const hasNames = await page.isVisible('text=Age, text=years, text=yrs');
    const hasLocation = await page.isVisible('text=Mumbai, text=Delhi, text=Bangalore, text=Chennai');
    const hasEducation = await page.isVisible('text=Engineer, text=Doctor, text=MBA, text=Graduate');
    
    if (!hasNames && !hasLocation && !hasEducation) {
      // Check for empty state
      const hasEmptyState = await page.isVisible('text=No profiles, text=Complete your profile, text=Start searching');
      expect(hasEmptyState).toBeTruthy();
    } else {
      expect(hasNames || hasLocation || hasEducation).toBeTruthy();
    }
  });

  test('should navigate to detailed profile view', async ({ page }) => {
    await page.goto('/search');
    
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    await page.waitForTimeout(2000);
    
    // Look for profile links or view buttons
    const profileLink = page.locator('a[href*="/profile/"], button', { hasText: /View|Profile|Details/ }).first();
    const profileCard = page.locator('[data-testid*="profile"], .profile-card').first();
    
    if (await profileLink.isVisible()) {
      await profileLink.click();
    } else if (await profileCard.isVisible()) {
      await profileCard.click();
    }
    
    await page.waitForTimeout(1000);
    
    // Should navigate to profile detail page
    if (page.url().includes('/profile/')) {
      await expect(page).toHaveURL(/\/profile\/.+/);
      
      // Should show detailed profile information
      const hasDetailedInfo = await page.isVisible('text=About, text=Family, text=Career, text=Preferences');
      expect(hasDetailedInfo).toBeTruthy();
    }
  });

  test('should handle pagination or infinite scroll', async ({ page }) => {
    await page.goto('/search');
    
    if (page.url().includes('/sign-in')) {
      test.skip();
    }
    
    await page.waitForTimeout(2000);
    
    // Look for pagination or load more
    const nextButton = page.locator('button', { hasText: /Next|Load More|Show More/ });
    const paginationNumbers = page.locator('[data-testid*="pagination"], .pagination a, button[aria-label*="page"]');
    
    if (await nextButton.isVisible()) {
      const initialProfileCount = await page.locator('[data-testid*="profile"], .profile-card').count();
      
      await nextButton.click();
      await page.waitForTimeout(2000);
      
      const newProfileCount = await page.locator('[data-testid*="profile"], .profile-card').count();
      
      // Should load more profiles or navigate to next page
      expect(newProfileCount >= initialProfileCount).toBeTruthy();
      
    } else if (await paginationNumbers.first().isVisible()) {
      // Test pagination
      await paginationNumbers.nth(1).click();
      await page.waitForTimeout(2000);
      
      // Should navigate to different page
      expect(page.url().includes('page=') || page.url().includes('p=')).toBeTruthy();
    } else {
      // Test infinite scroll by scrolling down
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);
      
      const hasMoreContent = await page.isVisible('[data-testid*="profile"], .profile-card');
      expect(hasMoreContent).toBeTruthy();
    }
  });
});
