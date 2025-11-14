import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Register and login
    await page.goto('/register');
    await page.fill('input[name="username"]', `dashboarduser${Date.now()}`);
    await page.fill('input[name="email"]', `dashboard${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should filter items by type', async ({ page }) => {
    // Create a search item
    await page.goto('/search');
    await page.fill('input[type="text"]', 'test filter query');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Go to dashboard and filter
    await page.goto('/dashboard');
    await page.selectOption('select', 'search');
    
    // Should only show search items
    const items = page.locator('[class*="border"]');
    await expect(items.first()).toBeVisible();
  });

  test('should delete an item', async ({ page }) => {
    // Create a search item
    await page.goto('/search');
    await page.fill('input[type="text"]', 'item to delete');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Go to dashboard
    await page.goto('/dashboard');
    
    // Find and click delete button
    const deleteButton = page.locator('button:has-text("Delete")').first();
    await deleteButton.click();
    
    // Confirm deletion
    page.on('dialog', dialog => dialog.accept());
    
    // Item should be removed
    await page.waitForTimeout(1000);
    await expect(page.locator('text=item to delete')).not.toBeVisible();
  });
});

