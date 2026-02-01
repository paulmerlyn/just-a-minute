# Playwright E2E Tests

This directory contains comprehensive end-to-end tests for Project 60 using Playwright.

## Test Structure

Tests are organized into three files covering different aspects of the application:

### `authentication.spec.ts`
Tests for the access code authentication flow:
- Display of access code form on initial load
- Validation of invalid codes (error message display)
- Successful authentication with valid codes (navigation to game)
- Form keyboard navigation (Enter key submission)

All 3 authentication tests run on **Chromium, Firefox, and WebKit** for cross-browser compatibility.

### `game.spec.ts`
Tests for core game functionality:

**Player Management**
- Adding a player via form input
- Removing a player from the game
- Verifying players appear/disappear in the list

**Topic Management**
- Generating a random topic from the library
- Adding a custom topic to the game
- Verifying topics display correctly

**Timer**
- Displaying timer at 60 seconds (initial state)
- Resetting timer to 60 seconds after modifications

Runs on **Chromium only** for speed (10 tests total).

### `accessibility.spec.ts`
Tests for WCAG 2.1 Level AA accessibility compliance:

**Keyboard Navigation**
- Form submission with Enter key
- Adding players with Enter key
- Tab navigation through interactive elements

**Focus Indicators**
- Button focus outline visibility and styling
- Proper focus state management

**ARIA Attributes**
- Button labels (`aria-label`) on all interactive buttons
- Timer display with `role="status"` and `aria-live`
- Proper ARIA attribute presence for screen readers

Runs on **Chromium only** for speed (5 tests total).

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
- **Browsers**: 
  - **Chromium**: Full test suite (14 tests)
  - **Firefox**: Authentication tests only (3 tests)
  - **WebKit**: Authentication tests only (3 tests)
- **Dev Server**: Automatically starts with `npm run dev:test` (skips obfuscation for speed)
- **Reporters**: HTML report with screenshots, traces, and test timing
- **Timeouts**: 60 seconds global, 60 seconds per navigation, 120 seconds for dev server startup

## Browser Test Distribution

| Browser   | Tests | Purpose |
|-----------|-------|---------|
| Chromium  | 14    | Full suite: auth + game features + accessibility |
| Firefox   | 3     | Auth validation (cross-browser compatibility) |
| WebKit    | 3     | Auth validation (Safari compatibility) |
| **Total** | **20**| Complete coverage with optimized runtime |

This distribution ensures comprehensive feature coverage while maintaining fast test execution (~11 seconds total).

## Important Notes

### Test Access Code
Tests use the access code: `c15fabcf-1cca-4cc6-ade2-ce4e330340a9`

This is the actual valid access code used by the `verify-access` API route. If you change the valid code, update the `c15fabcf-1cca-4cc6-ade2-ce4e330340a9` value in:
- `tests/e2e/authentication.spec.ts`
- `tests/e2e/game.spec.ts` (in the `getToGame()` helper)
- `tests/e2e/accessibility.spec.ts` (in the `getToGame()` helper)

## Important Notes

### Collapsed Details Elements
The game uses `<details>` elements for collapsible sections (Manage Players, Topics Manager, etc.). Tests that interact with form inputs must open these sections first:

```javascript
await openPlayerManager(page); // Opens the Manage Players section
const playerInput = page.locator('#newContestant');
await playerInput.waitFor({ state: 'visible' });
await playerInput.fill('Alice');
```

### Waiting for Navigation
Some tests wait for the game to load with:
```javascript
await page.waitForURL('**/api/game');
```

This ensures the authentication response is processed and the game page has loaded before proceeding.

### Asynchronous Operations
Tests use appropriate waits for:
- DOM updates (`.waitFor({ state: 'visible' })`)
- Element visibility before interaction
- Network requests and page navigation

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
- **axe DevTools**: Visual testing tool for accessibility violations
- **WAVE**: Browser extension for HTML structure checking
- **Screen readers**: Manual testing with NVDA (Windows), JAWS (Windows), or VoiceOver (macOS)

See [ACCESSIBILITY.md](../ACCESSIBILITY.md) for full accessibility testing recommendations, WCAG 2.1 Level AA compliance details, and testing with assistive technologies.

## Related Documentation

- **[README.md](../README.md)** - Main project documentation with Testing subsection in Development Guide
- **[TESTING.md](../TESTING.md)** - Comprehensive testing setup, performance optimizations, and detailed configuration
- **[ACCESSIBILITY.md](../ACCESSIBILITY.md)** - WCAG 2.1 compliance details, keyboard navigation, ARIA attributes, and screen reader testing

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
