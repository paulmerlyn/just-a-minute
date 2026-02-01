import { test, expect } from '@playwright/test';

// Helper to get to the game after authentication
const getToGame = async (page: any) => {
  console.log('🔐 Navigating to home page...');
  await page.goto('/', { waitUntil: 'networkidle' });
  
  console.log('📝 Filling access code...');
  const accessInput = page.locator('#accessCode');
  await accessInput.waitFor({ state: 'visible', timeout: 10000 });
  await accessInput.fill('test-code');
  
  console.log('🔓 Submitting access code...');
  const submitBtn = page.locator('button:has-text("Submit")');
  await submitBtn.click();
  
  console.log('⏳ Waiting for game to load...');
  await page.waitForURL('**/api/game', { timeout: 60000 });
  
  console.log('✅ Game loaded successfully');
  await page.waitForLoadState('networkidle');
};

test.describe('Game - Player Management', () => {
  test('should display Manage Players panel', async ({ page }) => {
    await getToGame(page);
    
    const panel = page.locator('[aria-label="Manage Players"]');
    await expect(panel).toBeVisible();
  });

  test('should add a player', async ({ page }) => {
    await getToGame(page);
    
    // Find the player input in the Manage Players section
    const playerInput = page.locator('#newContestant');
    const addButton = page.locator('#addContestant');
    
    // Add a player
    await playerInput.fill('Alice');
    await addButton.click();
    
    // Verify player appears in list
    const playerList = page.locator('#contestantList');
    await expect(playerList).toContainText('Alice');
  });

  test('should add multiple players', async ({ page }) => {
    await getToGame(page);
    
    const playerInput = page.locator('#newContestant');
    const addButton = page.locator('#addContestant');
    
    // Add multiple players
    const players = ['Alice', 'Bob', 'Charlie'];
    for (const player of players) {
      await playerInput.fill(player);
      await addButton.click();
      await page.waitForTimeout(100);
    }
    
    // Verify all appear in list
    const playerList = page.locator('#contestantList');
    for (const player of players) {
      await expect(playerList).toContainText(player);
    }
  });

  test('should add player with Enter key', async ({ page }) => {
    await getToGame(page);
    
    const playerInput = page.locator('#newContestant');
    await playerInput.fill('Alice');
    await playerInput.press('Enter');
    
    // Verify player appears
    const playerList = page.locator('#contestantList');
    await expect(playerList).toContainText('Alice');
  });

  test('should remove a player', async ({ page }) => {
    await getToGame(page);
    
    // Add a player
    const playerInput = page.locator('#newContestant');
    const addButton = page.locator('#addContestant');
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

  test('should update player scores', async ({ page }) => {
    await getToGame(page);
    
    // Add a player
    const playerInput = page.locator('#newContestant');
    const addButton = page.locator('#addContestant');
    await playerInput.fill('Alice');
    await addButton.click();
    
    // Click the scoreboard section to expand it
    const scoreboardSummary = page.locator('summary:has-text("Scoreboard")');
    await scoreboardSummary.click();
    
    // Find and click the plus button for Alice
    const plusButton = page.locator('button[aria-label*="Add 1 point"]').first();
    await plusButton.click();
    
    // Verify score updated
    const scoreboard = page.locator('#scoreboard');
    // The scoreboard should show Alice with a score
    await expect(scoreboard).toContainText('Alice');
  });
});

test.describe('Game - Topic Management', () => {
  test('should display Topics Manager panel', async ({ page }) => {
    await getToGame(page);
    
    const panel = page.locator('[aria-label="Manage Topics"]');
    await expect(panel).toBeVisible();
  });

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

  test('should select a topic', async ({ page }) => {
    await getToGame(page);
    
    // Add a topic first
    const topicsPanel = page.locator('[aria-label="Manage Topics"]');
    if (!(await topicsPanel.evaluate((el: any) => el.getAttribute('open')))) {
      await topicsPanel.locator('summary').click();
    }
    
    const topicInput = page.locator('#newTopic');
    const addTopicBtn = page.locator('#addTopicBtn');
    await topicInput.fill('Custom Topic');
    await addTopicBtn.click();
    
    // Click the select button (✓)
    const selectBtn = page.locator('button.select-topic-btn').first();
    await selectBtn.click();
    
    // Verify topic is displayed
    const topicDisplay = page.locator('#topicDisplay');
    await expect(topicDisplay).toContainText('Custom Topic');
  });

  test('should remove a topic', async ({ page }) => {
    await getToGame(page);
    
    // Expand and add topic
    const topicsPanel = page.locator('[aria-label="Manage Topics"]');
    if (!(await topicsPanel.evaluate((el: any) => el.getAttribute('open')))) {
      await topicsPanel.locator('summary').click();
    }
    
    const topicInput = page.locator('#newTopic');
    const addTopicBtn = page.locator('#addTopicBtn');
    await topicInput.fill('Topic to Remove');
    await addTopicBtn.click();
    
    // Verify added
    let topicsList = page.locator('#topicsManager').locator('table');
    await expect(topicsList).toContainText('Topic to Remove');
    
    // Click remove button (–)
    const removeBtn = page.locator('button.remove-topic-btn').first();
    await removeBtn.click();
    
    // Verify removed
    topicsList = page.locator('#topicsManager').locator('table');
    await expect(topicsList).not.toContainText('Topic to Remove');
  });
});

test.describe('Game - Timer', () => {
  test('should display timer controls', async ({ page }) => {
    await getToGame(page);
    
    const startBtn = page.locator('button[aria-label="Start timer"]');
    const stopBtn = page.locator('button[aria-label="Stop timer"]');
    const resetBtn = page.locator('button[aria-label="Reset timer"]');
    
    await expect(startBtn).toBeVisible();
    await expect(stopBtn).toBeVisible();
    await expect(resetBtn).toBeVisible();
  });

  test('should display timer at 60 seconds initially', async ({ page }) => {
    await getToGame(page);
    
    const timerDisplay = page.locator('#timer-display');
    await expect(timerDisplay).toContainText('60');
  });

  test('should add 5 seconds to timer', async ({ page }) => {
    await getToGame(page);
    
    const addBtn = page.locator('button[aria-label="Add 5 seconds"]');
    await addBtn.click();
    
    const timerDisplay = page.locator('#timer-display');
    await expect(timerDisplay).toContainText('65');
  });

  test('should subtract 5 seconds from timer', async ({ page }) => {
    await getToGame(page);
    
    const subBtn = page.locator('button[aria-label="Subtract 5 seconds"]');
    await subBtn.click();
    
    const timerDisplay = page.locator('#timer-display');
    await expect(timerDisplay).toContainText('55');
  });

  test('should reset timer to 60 seconds', async ({ page }) => {
    await getToGame(page);
    
    // Add some time
    const addBtn = page.locator('button[aria-label="Add 5 seconds"]');
    await addBtn.click();
    
    // Reset
    const resetBtn = page.locator('button[aria-label="Reset timer"]');
    await resetBtn.click();
    
    const timerDisplay = page.locator('#timer-display');
    await expect(timerDisplay).toContainText('60');
  });
});
