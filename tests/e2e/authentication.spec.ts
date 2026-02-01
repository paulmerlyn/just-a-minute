import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display access code form on initial load', async ({ page }) => {
    await page.goto('/');
    
    // Check for access code input
    const input = page.locator('#accessCode');
    await expect(input).toBeVisible();
    
    // Check for submit button
    const button = page.locator('button:has-text("Submit")');
    await expect(button).toBeVisible();
  });

  test('should show error for invalid access code', async ({ page }) => {
    await page.goto('/');
    
    // Enter invalid code
    await page.locator('#accessCode').fill('invalid');
    await page.locator('button:has-text("Submit")').click();
    
    // Check for error message (use specific id to avoid Next.js route announcer)
    const error = page.locator('#error-message');
    await expect(error).toContainText('Invalid access code');
  });

  test('should allow valid access code to proceed', async ({ page }) => {
    console.log('🔐 Test: Valid access code');
    await page.goto('/');
    
    console.log('📝 Filling access code...');
    const input = page.locator('#accessCode');
    await input.waitFor({ state: 'visible' });
    await input.fill('c15fabcf-1cca-4cc6-ade2-ce4e330340a9');
    
    console.log('🔓 Submitting...');
    await page.locator('button:has-text("Submit")').click();
    
    // Wait for navigation to game
    console.log('⏳ Waiting for game navigation...');
    await page.waitForURL('**/api/game', { timeout: 60000 });
    
    // Verify game is loaded
    const gameTitle = page.locator('.main-title');
    await expect(gameTitle).toContainText('Project 60');
    console.log('✅ Game loaded');
  });
});
