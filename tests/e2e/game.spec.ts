import { test, expect } from '@playwright/test';

// Helper to get to the game after authentication
const getToGame = async (page: any) => {
  console.log('🔐 Navigating to home page...');
  await page.goto('/', { waitUntil: 'networkidle' });
  
  console.log('📝 Filling access code...');
  const accessInput = page.locator('#accessCode');
  await accessInput.waitFor({ state: 'visible', timeout: 10000 });
  await accessInput.fill('c15fabcf-1cca-4cc6-ade2-ce4e330340a9');
  
  console.log('🔓 Submitting access code...');
  const submitBtn = page.locator('button:has-text("Submit")');
  await submitBtn.click();
  
  console.log('⏳ Waiting for game to load...');
  await page.waitForURL('**/api/game', { timeout: 60000 });
  
  console.log('✅ Game loaded successfully');
  await page.waitForLoadState('networkidle');
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
        console.log('📂 Opening Manage Players section...');
        await summary.click();
        await page.waitForTimeout(300); // Let the details open
      }
      return;
    }
  }
};

test.describe('Game - Player Management', () => {
  test('should add a player', async ({ page }) => {
    await getToGame(page);
    
    // Open Manage Players section
    await openPlayerManager(page);
    
    // Find the player input in the Manage Players section
    const playerInput = page.locator('#newContestant');
    const addButton = page.locator('#addContestant');
    
    // Add a player
    await playerInput.waitFor({ state: 'visible', timeout: 5000 });
    await playerInput.fill('Alice');
    await addButton.click();
    
    // Verify player appears in list
    const playerList = page.locator('#contestantList');
    await expect(playerList).toContainText('Alice');
  });

  test('should remove a player', async ({ page }) => {
    await getToGame(page);
    
    // Open Manage Players section
    await openPlayerManager(page);
    
    // Add a player
    const playerInput = page.locator('#newContestant');
    const addButton = page.locator('#addContestant');
    await playerInput.waitFor({ state: 'visible', timeout: 5000 });
    await playerInput.fill('Alice');
    await addButton.click();
    
    // Verify added
    let playerList = page.locator('#contestantList');
    await expect(playerList).toContainText('Alice');
    
    // Remove player
    const removeButton = page.locator('button[aria-label*="Remove"]').first();
    await removeButton.click();
    
    // Verify removed
    playerList = page.locator('#contestantList');
    await expect(playerList).not.toContainText('Alice');
  });
});

test.describe('Game - Topic Management', () => {
  test('should generate a random topic', async ({ page }) => {
    await getToGame(page);
    
    const generateBtn = page.locator('#generateBtn');
    await generateBtn.click();
    
    // Verify topic appears
    const topicDisplay = page.locator('#topicDisplay');
    await expect(topicDisplay).not.toContainText('Select or generate a topic');
  });

  test('should add a custom topic', async ({ page }) => {
    await getToGame(page);
    
    // Expand Topics panel
    const topicsPanel = page.locator('[aria-label="Manage Topics"]');
    if (!(await topicsPanel.evaluate((el: any) => el.getAttribute('open')))) {
      await topicsPanel.locator('summary').click();
    }
    
    // Add topic
    const topicInput = page.locator('#newTopic');
    const addTopicBtn = page.locator('#addTopicBtn');
    
    await topicInput.fill('Custom Topic');
    await addTopicBtn.click();
    
    // Verify topic appears in list
    const topicsList = page.locator('#topicsManager').locator('table');
    await expect(topicsList).toContainText('Custom Topic');
  });
});

test.describe('Game - Timer', () => {
  test('should display timer at 60 seconds initially', async ({ page }) => {
    await getToGame(page);
    
    const timerDisplay = page.locator('#timer-display');
    await expect(timerDisplay).toContainText('60');
  });

  test('should reset timer to 60 seconds', async ({ page }) => {
    await getToGame(page);
    
    // Wait for timer to be visible
    const timerDisplay = page.locator('#timer-display');
    await timerDisplay.waitFor({ state: 'visible', timeout: 5000 });
    
    // Add some time
    const addBtn = page.locator('button[aria-label="Add 5 seconds to timer"]');
    await addBtn.waitFor({ state: 'visible', timeout: 5000 });
    await addBtn.click();
    
    // Reset
    const resetBtn = page.locator('button[aria-label="Reset timer to 60 seconds"]');
    await resetBtn.click();
    
    // Verify reset to 60
    await expect(timerDisplay).toContainText('60');
  });
});
