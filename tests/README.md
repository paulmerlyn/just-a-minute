# Playwright E2E Tests

This directory contains comprehensive end-to-end tests for Project 60 using Playwright.

## Test Structure

### `authentication.spec.ts`
Tests for the access code authentication flow:
- Display of access code form
- Validation of invalid codes
- Successful authentication with valid codes
- Keyboard navigation (Enter key submission)
- Form loading states
- Error message handling

### `game.spec.ts`
Tests for core game functionality:

**Player Management**
- Adding/removing players
- Multiple player scenarios
- Keyboard input (Enter key)
- Score updates

**Topic Management**
- Generating random topics
- Adding custom topics
- Selecting topics
- Removing topics

**Timer**
- Display and initialization
- Adding/subtracting time
- Reset functionality

### `accessibility.spec.ts`
Tests for WCAG 2.1 Level AA accessibility compliance:

**Keyboard Navigation**
- Skip-to-content link
- Tab order through elements
- Enter key support in forms and inputs
- Focus management

**Focus Indicators**
- Visible focus outlines on buttons
- Input focus styling
- Link focus states

**ARIA Attributes**
- Button labels (`aria-label`)
- Input associations
- Alert roles
- Live regions (`aria-live`)
- Status roles

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests with debugging
```bash
npm run test:debug
```

### View test report
```bash
npm run test:report
```

### Run specific test file
```bash
npx playwright test tests/e2e/authentication.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

## Configuration

Configuration is in `playwright.config.ts`:
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Dev Server**: Automatically starts with `npm run dev`
- **Reporters**: HTML report with screenshots and traces

## Important Notes

### Test Access Code
Tests use the access code: `test-code`

This is defined in the `verify-access` API route. If you change the valid code, update the `getToGame` helper in the test files.

### Waiting for Navigation
Some tests wait for the game to load with:
```javascript
await page.waitForURL('**/api/game');
```

### Asynchronous Operations
Tests use appropriate waits for:
- DOM updates
- Network requests
- Focus changes

## CI/CD Integration

Tests are configured to run in CI environments with:
- Single worker for reliability
- Automatic retries (2 times)
- HTML reports for debugging

Add to your CI pipeline:
```bash
npm test
```

## Accessibility Testing

While Playwright tests verify the presence of ARIA attributes and focus behavior, for comprehensive accessibility auditing also use:
- **axe DevTools**: Visual testing tool
- **WAVE**: Browser extension for structure checking
- **Screen readers**: Manual testing with NVDA, JAWS, or VoiceOver

See `ACCESSIBILITY.md` for full accessibility testing recommendations.

## Troubleshooting

### Tests timing out
- Increase timeout in `playwright.config.ts` under `use`
- Ensure dev server is running with `npm run dev`

### Element not found
- Check selectors with `npx playwright codegen http://localhost:3000`
- Run in headed mode: `npx playwright test --headed`

### Focus issues in tests
- Some focus states may not be visible in headless mode
- Use `--headed` flag to debug visual focus

### Database/Storage issues
- Tests use localStorage for game state
- Each test should be independent
- Clear browser data if needed
