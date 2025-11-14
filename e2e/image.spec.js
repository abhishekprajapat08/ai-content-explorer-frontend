import { test, expect } from '@playwright/test';

test.describe('Image Generation', () => {
  test.beforeEach(async ({ page }) => {
    // Register and login
    await page.goto('/register');
    await page.fill('input[name="username"]', `imageuser${Date.now()}`);
    await page.fill('input[name="email"]', `image${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should generate image from prompt', async ({ page }) => {
    await page.goto('/image');
    
    await page.fill('input[type="text"]', 'an astronaut riding a unicorn on Mars');
    await page.click('button[type="submit"]');
    
    // Wait for image generation
    await page.waitForSelector('img', { timeout: 10000 });
    
    // Should show generated image
    const image = page.locator('img').first();
    await expect(image).toBeVisible();
  });

  test('should save generated image to dashboard', async ({ page }) => {
    await page.goto('/image');
    
    await page.fill('input[type="text"]', 'beautiful sunset');
    await page.click('button[type="submit"]');
    
    // Wait for image generation
    await page.waitForTimeout(2000);
    
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Should see the image in dashboard
    await expect(page.locator('text=beautiful sunset')).toBeVisible();
  });
});

