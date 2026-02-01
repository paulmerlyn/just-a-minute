import { test, expect } from '@playwright/test';

// Helper to get to the game after authentication
const getToGame = async (page: any) => {
  console.log('🔐 [Accessibility] Navigating to game...');
  await page.goto('/');
  await page.locator('#accessCode').waitFor({ state: 'visible' });
  await page.locator('#accessCode').fill('c15fabcf-1cca-4cc6-ade2-ce4e330340a9');
  await page.locator('button:has-text("Submit")').click();
  await page.waitForURL('**/api/game', { timeout: 60000 });
  console.log('✅ [Accessibility] Game loaded');
};

// Helper to open the Manage Players details section
const openPlayerManager = async (page: any) => {
  const detailsElements = page.locator('details');
  const count = await detailsElements.count();
  
  for (let i = 0; i < count; i++) {
    const details = detailsElements.nth(i);
    const summary = details.locator('summary');
    const text = await summary.textContent();
    
    if (text?.includes('Manage Players')) {
      // Check if not already open
      const isOpen = await details.evaluate((el: any) => el.open);
      if (!isOpen) {
        console.log('📂 [Accessibility] Opening Manage Players section...');
        await summary.click();
        await page.waitForTimeout(300);
      }
      return;
    }
  }
};

test.describe('Accessibility - Keyboard Navigation', () => {
  test('should submit form with Enter key', async ({ page }) => {
    await page.goto('/');
    
    const input = page.locator('#accessCode');
    await input.fill('c15fabcf-1cca-4cc6-ade2-ce4e330340a9');
    
    // Press Enter instead of clicking
    await input.press('Enter');
    
    // Should navigate to game
    await page.waitForURL('**/api/game');
  });

  test('should add player with Enter key', async ({ page }) => {
    await getToGame(page);
    
    // Open Manage Players section
    await openPlayerManager(page);
    
    const playerInput = page.locator('#newContestant');
    await playerInput.waitFor({ state: 'visible', timeout: 5000 });
    await playerInput.fill('Alice');
    
    // Press Enter to add
    await playerInput.press('Enter');
    
    const playerList = page.locator('#contestantList');
    await expect(playerList).toContainText('Alice');
  });
});

test.describe('Accessibility - Focus Indicators', () => {
  test('button should show focus outline', async ({ page }) => {
    await getToGame(page);
    
    const button = page.locator('#generateBtn');
    
    // Focus the button
    await button.focus();
    
    // Check for focus styling
    const styles = await button.evaluate((el: any) => {
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        outlineColor: computed.outlineColor,
      };
    });
    
    // Should have some outline
    expect(styles.outline).not.toBe('none');
  });
});

test.describe('Accessibility - ARIA Attributes', () => {
  test('buttons should have descriptive aria-labels', async ({ page }) => {
    await getToGame(page);
    
    const generateBtn = page.locator('#generateBtn');
    const ariaLabel = await generateBtn.getAttribute('aria-label');
    
    expect(ariaLabel).toBeTruthy();
  });

  test('timer display should have role="status"', async ({ page }) => {
    await getToGame(page);
    
    const timerDisplay = page.locator('#timer-display');
    const role = await timerDisplay.getAttribute('role');
    
    expect(role).toBe('status');
  });
});
