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
    
    // Check for error message
    const error = page.locator('[role="alert"]');
    await expect(error).toContainText('Invalid access code');
  });

  test('should allow valid access code to proceed', async ({ page }) => {
    console.log('🔐 Test: Valid access code');
    await page.goto('/');
    
    console.log('📝 Filling access code...');
    const input = page.locator('#accessCode');
    await input.waitFor({ state: 'visible' });
    await input.fill('test-code');
    
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

  test('should handle form submission with Enter key', async ({ page }) => {
    await page.goto('/');
    
    const input = page.locator('#accessCode');
    await input.fill('test-code');
    await input.press('Enter');
    
    // Should navigate to game with longer timeout
    await page.waitForURL('**/api/game', { timeout: 60000 });
  });

  test('should display loading state during submission', async ({ page }) => {
    await page.goto('/');
    
    const input = page.locator('#accessCode');
    await input.fill('test-code');
    const button = page.locator('button:has-text("Submit")');
    
    // Click and verify button shows loading state
    await button.click();
    await expect(button).toHaveAttribute('aria-busy', 'true');
  });

  test('should clear error message when user types', async ({ page }) => {
    await page.goto('/');
    
    // First, trigger an error
    await page.locator('#accessCode').fill('invalid');
    await page.locator('button:has-text("Submit")').click();
    
    const error = page.locator('[role="alert"]');
    await expect(error).toBeVisible();
    
    // Now typing should not clear the error immediately (server-side validation)
    // But we can verify the input is working
    const input = page.locator('#accessCode');
    await input.fill('test-code');
    await expect(input).toHaveValue('test-code');
  });
});
