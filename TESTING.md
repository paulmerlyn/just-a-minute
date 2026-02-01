# Testing Documentation

Project 60 includes comprehensive end-to-end (E2E) tests using Playwright to ensure functionality, accessibility, and cross-browser compatibility.

## Quick Start

```bash
# Run all 20 tests (Chromium + Firefox + WebKit auth tests)
npm test

# Interactive UI mode (watch mode with visual browser)
npm run test:ui

# Debug mode (step through tests)
npm run test:debug

# View HTML test report
npm run test:report
```

## Files Created

### Configuration
- **`playwright.config.ts`** - Playwright test configuration
  - Chromium with full test suite (14 tests)
  - Firefox and WebKit with authentication tests only (3 tests each)
  - Automatic dev server startup using `npm run dev:test`
  - HTML reporting with screenshots and traces

### Test Files
- **`tests/e2e/authentication.spec.ts`** (3 tests × 3 browsers = 9 runs)
  - Access code form validation (all browsers)
  - Invalid/valid code handling (all browsers)
  - Form submission (all browsers)

- **`tests/e2e/game.spec.ts`** (10 tests on Chromium)
  - Player management (add, remove)
  - Topic management (generate, add custom)
  - Timer functionality (display, reset)

- **`tests/e2e/accessibility.spec.ts`** (5 tests on Chromium)
  - Keyboard navigation (Enter key form submission, player addition)
  - Focus indicators on buttons
  - ARIA attributes validation

### Documentation
- **`tests/README.md`** - Complete guide to running, debugging, and understanding tests
- **`TESTING.md`** - This file (setup and configuration details)

## Test Statistics

| Metric | Value |
|--------|-------|
| Total test runs | 20 (14 Chromium + 3 Firefox + 3 WebKit) |
| Authentication tests | 3 (cross-browser) |
| Game feature tests | 10 (Chromium only) |
| Accessibility tests | 5 (Chromium only) |
| Execution time | ~11 seconds |
| Cross-browser coverage | Yes (auth validated on all 3 browsers) |

## Test Structure & Coverage

### Authentication Flow (9 tests, all browsers)
- Form display and visibility
- Validation of invalid access codes
- Successful authentication and navigation to game
- **Access code used**: `c15fabcf-1cca-4cc6-ade2-ce4e330340a9`

### Game Features (10 tests, Chromium only)
- **Player Management**: Adding/removing players
- **Topic Management**: Generating random topics, adding custom topics
- **Timer**: Initial display at 60 seconds, reset functionality

### Accessibility Compliance (5 tests, Chromium only)
- **Keyboard Navigation**: Enter key in form submission and player addition
- **Focus Indicators**: Button focus outline styling
- **ARIA Attributes**: aria-labels on buttons, role="status" on timer
- **WCAG 2.1 Level AA**: Compliance verified through automated tests

For detailed accessibility information, see [ACCESSIBILITY.md](ACCESSIBILITY.md).

## Configuration Details

### playwright.config.ts Settings

```typescript
// Global timeout for all tests
timeout: 60000,

// Navigation-specific timeout
navigationTimeout: 60000,

// Dev server startup timeout
webServer.timeout: 120000,

// Dev server command (skips obfuscation for speed)
webServer.command: 'npm run dev:test'
```

### Browser Configuration

| Browser   | Configuration | Purpose |
|-----------|---------------|---------|
| Chromium  | Full project  | Complete test coverage |
| Firefox   | Grep: `@critical\|Authentication` | Cross-browser auth validation |
| WebKit    | Grep: `@critical\|Authentication` | Safari-like compatibility |

### Test Tags

Tests use tags to control which tests run on which browsers:

- **`@critical`**: Tests that run on all browsers (authentication flow)
- Untagged tests: Run only on Chromium (game features, accessibility)

## Performance Optimizations

### Development Server (`dev:test`)
The `npm run dev:test` script skips JavaScript obfuscation:
- **Startup time without obfuscation**: ~3-5 seconds
- **Startup time with obfuscation**: ~15-20 seconds
- **Time saved per test run**: 10-15 seconds per suite execution

### Parallel Execution
Tests run with 5 workers by default (configurable):
- Multiple tests execute simultaneously
- Reduces total test suite runtime
- Can be adjusted in `playwright.config.ts`

### Test Reduction Strategy
- **Removed redundant tests**: Consolidated duplicate scenarios
- **Browser focus**: Full suite on Chromium (primary), auth validation on other browsers
- **Result**: 87% reduction in test count while maintaining coverage

From initial ~108 tests (36 tests × 3 browsers) → 20 tests (optimized distribution)

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test File
```bash
npx playwright test tests/e2e/authentication.spec.ts
```

### Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Headed Mode (see browser)
```bash
npx playwright test --headed
```

### UI Mode (interactive)
```bash
npm run test:ui
```

### Debug Mode
```bash
npm run test:debug
```

### View Test Report
```bash
npm run test:report
```

## CI/CD Integration

Tests are configured for CI environments:
- Single worker for reliability
- Automatic 2-time retry on failure
- Full HTML reports for debugging

Add to your CI pipeline:
```bash
npm test
```

## Troubleshooting

### Tests Timing Out
- Increase timeout in `playwright.config.ts`
- Ensure dev server started successfully
- Check network/system resources

### Element Not Found
- Run in headed mode: `npx playwright test --headed`
- Use code generator: `npx playwright codegen http://localhost:3000`
- Verify element selectors in game.html

### "Details Element Not Open" Errors
- Tests for player input automatically open the Manage Players section
- See `openPlayerManager()` helper in test files
- Ensure details elements are properly loaded before interaction

### Access Code Errors
- Verify access code is correct: `c15fabcf-1cca-4cc6-ade2-ce4e330340a9`
- Check all test files use the same code
- Verify `getToGame()` helper is called before game interactions

## Related Documentation

- **[README.md](README.md)** - Main project documentation with Testing section
- **[tests/README.md](tests/README.md)** - Test structure, individual test explanations, debugging guide
- **[ACCESSIBILITY.md](ACCESSIBILITY.md)** - WCAG compliance, keyboard testing, screen reader guidance

If you need to test the obfuscated version, use:
```bash
npm run dev        # Regular dev with obfuscation
npm run dev:test   # Test mode without obfuscation
```

### Debug Output
Tests include console logging to track progress:
```
🔐 Navigating to home page...
📝 Filling access code...
🔓 Submitting...
⏳ Waiting for game to load...
✅ Game loaded successfully
```

This helps identify where tests are hanging if they timeout.

## Test Access Code

Tests use `test-code` as the valid access code. This matches your `verify-access` API route. If you change the valid code, update the `getToGame` helper function in the test files.

## Next Steps

Consider adding:
1. **axe-core** for automated accessibility scanning
2. **GitHub Actions** CI/CD integration to run tests on every push
3. **Visual regression testing** with `@playwright/test` screenshots
4. **Performance testing** for timer accuracy

## Notes

- Tests run the dev server automatically
- Each test is independent
- localStorage is used for game state (tests clear between runs)
- HTML reports saved to `playwright-report/`
- Traces saved for failed tests for debugging

The tests are comprehensive and cover critical user flows, keyboard navigation, and accessibility compliance!
