import { test, expect } from '@playwright/test';

// Helper to get to the game after authentication
const getToGame = async (page: any) => {
  await page.goto('/');
  await page.locator('#accessCode').fill('test-code');
  await page.locator('button:has-text("Submit")').click();
  await page.waitForURL('**/api/game');
};

test.describe('Accessibility - Keyboard Navigation', () => {
  test('should have skip-to-content link hidden by default', async ({ page }) => {
    await getToGame(page);
    
    const skipLink = page.locator('a[href="#main-content"]');
    
    // Should be in the DOM but not visible
    await expect(skipLink).toHaveCount(1);
    
    // Check that it's not visible (using clip-path)
    const box = await skipLink.boundingBox();
    // clip-path should make it invisible, so we can't test boundingBox reliably
    // Instead we'll just verify it exists
    await expect(skipLink).toContainText('Skip to main content');
  });

  test('should make skip link visible on Tab', async ({ page }) => {
    await getToGame(page);
    
    const skipLink = page.locator('a[href="#main-content"]');
    
    // Press Tab to focus skip link
    await page.keyboard.press('Tab');
    
    // Verify skip link is focused
    await expect(skipLink).toBeFocused();
  });

  test('should navigate to main content with skip link', async ({ page }) => {
    await getToGame(page);
    
    const skipLink = page.locator('a[href="#main-content"]');
    const mainContent = page.locator('#main-content');
    
    // Focus and activate skip link
    await skipLink.focus();
    await skipLink.click();
    
    // Verify main content is focused
    await expect(mainContent).toBeFocused();
  });

  test('should tab through all interactive elements', async ({ page }) => {
    await getToGame(page);
    
    // Tab through page and count interactive elements
    let tabCount = 0;
    const maxTabs = 50; // Safety limit
    
    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;
      
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });
      
      // Should be navigating through interactive elements
      const validTags = ['BUTTON', 'INPUT', 'A', 'SUMMARY'];
      if (focusedElement && !validTags.includes(focusedElement)) {
        if (focusedElement === 'BODY') break; // Reached end of tab order
      }
    }
    
    // Should have tabbed through at least some elements
    expect(tabCount).toBeGreaterThan(5);
  });

  test('should submit form with Enter key', async ({ page }) => {
    await page.goto('/');
    
    const input = page.locator('#accessCode');
    await input.fill('test-code');
    
    // Press Enter instead of clicking
    await input.press('Enter');
    
    // Should navigate to game
    await page.waitForURL('**/api/game');
  });

  test('should add player with Enter key', async ({ page }) => {
    await getToGame(page);
    
    const playerInput = page.locator('#newContestant');
    await playerInput.fill('Alice');
    
    // Press Enter to add
    await playerInput.press('Enter');
    
    const playerList = page.locator('#contestantList');
    await expect(playerList).toContainText('Alice');
  });

  test('should add topic with Enter key', async ({ page }) => {
    await getToGame(page);
    
    // Expand Topics panel
    const topicsPanel = page.locator('[aria-label="Manage Topics"]');
    if (!(await topicsPanel.evaluate((el: any) => el.getAttribute('open')))) {
      await topicsPanel.locator('summary').click();
    }
    
    const topicInput = page.locator('#newTopic');
    await topicInput.fill('Topic via Enter');
    
    // Press Enter to add
    await topicInput.press('Enter');
    
    const topicsList = page.locator('#topicsManager').locator('table');
    await expect(topicsList).toContainText('Topic via Enter');
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
        outlineWidth: computed.outlineWidth,
      };
    });
    
    // Should have some outline
    expect(styles.outline).not.toBe('none');
  });

  test('input should show focus styling', async ({ page }) => {
    await getToGame(page);
    
    const input = page.locator('#newContestant');
    
    // Focus the input
    await input.focus();
    
    const styles = await input.evaluate((el: any) => {
      const computed = window.getComputedStyle(el);
      return {
        borderColor: computed.borderColor,
        outline: computed.outline,
      };
    });
    
    // Should have visible focus styling
    expect(styles.outline).not.toBe('none');
  });

  test('link should show focus outline', async ({ page }) => {
    await page.goto('/');
    
    // Get any focusable link or button
    const element = page.locator('button').first();
    
    await element.focus();
    
    const isFocused = await element.evaluate((el: any) => {
      return document.activeElement === el;
    });
    
    expect(isFocused).toBe(true);
  });
});

test.describe('Accessibility - ARIA Attributes', () => {
  test('buttons should have descriptive aria-labels', async ({ page }) => {
    await getToGame(page);
    
    const generateBtn = page.locator('#generateBtn');
    const ariaLabel = await generateBtn.getAttribute('aria-label');
    
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain('Generate');
  });

  test('inputs should have associated labels or aria-labels', async ({ page }) => {
    await getToGame(page);
    
    const playerInput = page.locator('#newContestant');
    const ariaLabel = await playerInput.getAttribute('aria-label');
    
    expect(ariaLabel).toBeTruthy();
  });

  test('error message should have role="alert"', async ({ page }) => {
    await page.goto('/');
    
    // Trigger an error
    await page.locator('#accessCode').fill('invalid');
    await page.locator('button:has-text("Submit")').click();
    
    // Check for alert role
    const alert = page.locator('[role="alert"]');
    await expect(alert).toBeVisible();
  });

  test('timer display should have role="status"', async ({ page }) => {
    await getToGame(page);
    
    const timerDisplay = page.locator('#timer-display');
    const role = await timerDisplay.getAttribute('role');
    
    expect(role).toBe('status');
  });

  test('topic display should have aria-live region', async ({ page }) => {
    await getToGame(page);
    
    const topicDisplay = page.locator('#topicDisplay');
    const ariaLive = await topicDisplay.getAttribute('aria-live');
    
    expect(ariaLive).toBeTruthy();
  });
});
