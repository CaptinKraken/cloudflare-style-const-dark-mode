# Dark Mode Sync Manager - Jest Test Setup

## Overview
Basic Jest test scaffold has been set up for the `DarkModeSyncManager` in `src/darkMode.ts`.

## Files Created/Modified

### New Files
- **`jest.config.js`** - Jest configuration with ts-jest preset and jsdom environment
- **`jest.setup.js`** - Jest setup file with mocked browser APIs (matchMedia, BroadcastChannel)
- **`src/darkMode.test.ts`** - Basic test scaffold with placeholder tests

### Modified Files
- **`package.json`** - Added Jest dependencies and test scripts
- **`tsconfig.json`** - Added Jest types and updated exclude patterns

## Installation

Install dependencies:
```bash
pnpm install
```

## Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Test Structure

The test file (`src/darkMode.test.ts`) includes basic scaffolding for:

### Test Suites
1. **Initialization** - Tests for `initDarkMode()` and cleanup
2. **Setting and Getting** - Tests for `setDarkMode()` and `getDarkModeSetting()`
3. **Timestamp Management** - Tests for timestamp tracking and comparison
4. **Event Listeners** - Tests for `addDarkModeChangeListener()` and event details
5. **Naming Strategy** - Tests for strategy translation and management
6. **Reset** - Tests for `resetDarkMode()` functionality

### Current Test Count
- 21 basic scaffold tests covering core functionality
- Tests are ready to be expanded with specific assertions

## Next Steps

1. Run `pnpm install` to install Jest and dependencies
2. Run `pnpm test` to verify the scaffold works
3. Add specific test cases for:
   - Cookie synchronization
   - localStorage synchronization
   - Cross-tab storage events
   - Cookie polling mechanism
   - PostMessage iframe communication
   - BroadcastChannel communication
   - Timestamp-based update precedence
   - Error handling and edge cases

## Notes

- Tests use `jsdom` environment for browser API simulation
- Browser APIs (matchMedia, BroadcastChannel) are mocked in `jest.setup.js`
- Tests reset state before and after each test to ensure isolation
- Async operations use `setTimeout` with Jest's async test support
