import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Register and login
    await page.goto('/register');
    await page.fill('input[name="username"]', `searchuser${Date.now()}`);
    await page.fill('input[name="email"]', `search${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should perform web search', async ({ page }) => {
    await page.goto('/search');
    
    await page.fill('input[type="text"]', 'quantum computing');
    await page.click('button[type="submit"]');
    
    // Wait for results
    await page.waitForSelector('text=/Search Results|results/i', { timeout: 10000 });
    
    // Should show search results
    const results = page.locator('text=/quantum|computing/i');
    await expect(results.first()).toBeVisible();
  });

  test('should save search to dashboard', async ({ page }) => {
    await page.goto('/search');
    
    await page.fill('input[type="text"]', 'test search query');
    await page.click('button[type="submit"]');
    
    // Wait for search to complete
    await page.waitForTimeout(2000);
    
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Should see the search in dashboard
    await expect(page.locator('text=test search query')).toBeVisible();
  });
});

