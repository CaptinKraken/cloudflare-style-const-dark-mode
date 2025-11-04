# Dark Mode Integration Guide

This guide covers the enhanced integration features for consuming applications using `@cloudflare/style-const` dark mode utilities.

## Table of Contents

1. [Event-Based Integration](#event-based-integration)
2. [Naming Strategy Support](#naming-strategy-support)
3. [Timestamp-Based Conflict Resolution](#timestamp-based-conflict-resolution)
4. [Complete Examples](#complete-examples)

---

## Event-Based Integration

The library now provides a robust event system that allows consuming applications to react to dark mode changes **without managing any storage or syncing logic themselves**.

### Key Benefits

- **No implementation details**: Apps don't need to know about cookies, localStorage, or cross-tab syncing
- **Clean separation**: Storage/sync is handled by the library; apps just react to events
- **Flexible**: Use custom event listeners or DOM events

### Basic Usage

```typescript
import { addDarkModeChangeListener } from '@cloudflare/style-const';

// Add a listener that receives detailed dark mode change information
const cleanup = addDarkModeChangeListener((detail) => {
  console.log('Dark mode is now:', detail.isDark);
  console.log('Setting value:', detail.value);
  console.log('Timestamp:', detail.timestamp);
  
  // Your custom logic here
  updateUIComponents(detail.isDark);
});

// Clean up when component unmounts
return cleanup;
```

### React Example

```typescript
import { useEffect, useState } from 'react';
import { addDarkModeChangeListener, type DarkModeChangeEventDetail } from '@cloudflare/style-const';

function MyComponent() {
  const [darkModeState, setDarkModeState] = useState<DarkModeChangeEventDetail | null>(null);

  useEffect(() => {
    const cleanup = addDarkModeChangeListener((detail) => {
      setDarkModeState(detail);
      
      // Update database if user is logged in
      if (user?.isLoggedIn) {
        updateUserPreference(detail.value, detail.timestamp);
      }
    });

    return cleanup;
  }, [user]);

  return (
    <div>
      <p>Dark mode: {darkModeState?.isDark ? 'ON' : 'OFF'}</p>
      <p>Last updated: {new Date(darkModeState?.timestamp || 0).toLocaleString()}</p>
    </div>
  );
}
```

### Using Native DOM Events (Alternative)

If you prefer native DOM events:

```typescript
window.addEventListener('cf-dark-mode-change', (event: CustomEvent) => {
  const { isDark, value, timestamp, setting, namingStrategy } = event.detail;
  console.log('Dark mode changed:', isDark);
});
```

---

## Naming Strategy Support

The library now supports multiple naming conventions for dark mode settings, with automatic translation between them.

### Supported Strategies

| Strategy | Values | Use Case |
|----------|--------|----------|
| **CLOUDFLARE** (default) | `'on'` \| `'off'` \| `'system'` | Cloudflare applications |
| **ASTRO** | `'dark'` \| `'light'` \| `'auto'` | Astro/Starlight/other frameworks |

### Configuration

#### Option 1: Initialize with Strategy

```typescript
import { initDarkMode, DarkModeNamingStrategy } from '@cloudflare/style-const';

// For Astro/Starlight applications
useEffect(() => {
  const cleanup = initDarkMode({ 
    namingStrategy: DarkModeNamingStrategy.ASTRO 
  });
  return cleanup;
}, []);
```

#### Option 2: Change Strategy After Init

```typescript
import { setDarkModeNamingStrategy, DarkModeNamingStrategy } from '@cloudflare/style-const';

// Switch to Astro naming convention
setDarkModeNamingStrategy(DarkModeNamingStrategy.ASTRO);
```

### Event Values Respect Naming Strategy

When you set a naming strategy, events will report values in that convention:

```typescript
import { addDarkModeChangeListener, DarkModeNamingStrategy } from '@cloudflare/style-const';

// Use Astro naming
setDarkModeNamingStrategy(DarkModeNamingStrategy.ASTRO);

addDarkModeChangeListener((detail) => {
  // detail.value will be 'dark', 'light', or 'auto' (not 'on', 'off', 'system')
  console.log(detail.value); // 'dark'
  
  // detail.setting always uses internal format
  console.log(detail.setting); // 'on'
});
```

### Manual Translation

You can also manually translate between naming strategies:

```typescript
import { translateDarkModeSetting, DarkModeNamingStrategy } from '@cloudflare/style-const';

// Convert Cloudflare → Astro
const astroValue = translateDarkModeSetting(
  'on', 
  DarkModeNamingStrategy.CLOUDFLARE, 
  DarkModeNamingStrategy.ASTRO
);
console.log(astroValue); // 'dark'

// Convert Astro → Cloudflare
const cfValue = translateDarkModeSetting(
  'auto', 
  DarkModeNamingStrategy.ASTRO, 
  DarkModeNamingStrategy.CLOUDFLARE
);
console.log(cfValue); // 'system'
```

### TypeScript Support

For Astro-style applications, there's a dedicated type:

```typescript
import type { AstroDarkModeSettings } from '@cloudflare/style-const';

const theme: AstroDarkModeSettings = 'dark'; // 'dark' | 'light' | 'auto'
```

---

## Timestamp-Based Conflict Resolution

The library now tracks when dark mode changes occur using Unix timestamps. This enables proper conflict resolution when syncing with databases.

**Implementation Detail**: The timestamp is stored in the same cookie as the setting value using the format `value:timestamp` (e.g., `on:1699564800000`). This approach is efficient and reduces cookie overhead.

### The Problem It Solves

**Scenario**: A user changes their dark mode preference on one device, then logs in on another device.
- **Without timestamps**: You don't know if the local cookie value is newer or older than the database value
- **With timestamps**: You can compare timestamps to determine which value is most recent

### Key Functions

#### Get Current Timestamp

```typescript
import { getDarkModeTimestamp } from '@cloudflare/style-const';

const timestamp = getDarkModeTimestamp();
console.log(timestamp); // 1699564800000 (Unix timestamp in milliseconds)
```

#### Check if Local is Newer

```typescript
import { isDarkModeNewerThan } from '@cloudflare/style-const';

// Compare against database timestamp
if (isDarkModeNewerThan(user.darkModeUpdatedAt)) {
  console.log('Local value is newer than database');
  // Update database
}
```

### Database Sync Pattern

#### Pattern 1: Update Database on Change

```typescript
import { addDarkModeChangeListener } from '@cloudflare/style-const';

useEffect(() => {
  const cleanup = addDarkModeChangeListener(async (detail) => {
    if (user?.isLoggedIn) {
      // Update database with new preference and timestamp
      await updateUserPreference({
        darkMode: detail.value,
        updatedAt: detail.timestamp
      });
    }
  });
  return cleanup;
}, [user]);
```

#### Pattern 2: Sync on Page Load

```typescript
import { getDarkModeSetting, getDarkModeTimestamp, setDarkMode, isDarkModeNewerThan } from '@cloudflare/style-const';

async function syncDarkModeWithDatabase(user) {
  const localTimestamp = getDarkModeTimestamp();
  const dbTimestamp = user.darkModeUpdatedAt || 0;
  
  if (localTimestamp > dbTimestamp) {
    // Local is newer → update database
    await updateUserPreference({
      darkMode: getDarkModeSetting(),
      updatedAt: localTimestamp
    });
  } else if (dbTimestamp > localTimestamp) {
    // Database is newer → update local
    const dbSetting = user.darkModeSetting;
    setDarkMode(dbSetting);
  }
  // If timestamps are equal, they're already in sync
}
```

#### Pattern 3: First-time User Check

```typescript
import { getDarkModeTimestamp, getDarkModeSetting } from '@cloudflare/style-const';

async function handleFirstTimeUser(user) {
  const localTimestamp = getDarkModeTimestamp();
  
  if (localTimestamp === 0) {
    // No local preference set yet
    if (user.darkModeSetting) {
      // Use database value
      setDarkMode(user.darkModeSetting);
    }
    // else: let the system default (or system preference) take effect
  } else {
    // User has a local preference, save it to database
    await updateUserPreference({
      darkMode: getDarkModeSetting(),
      updatedAt: localTimestamp
    });
  }
}
```

---

## Complete Examples

### Example 1: React App with Database Sync

```typescript
import { useEffect, useState } from 'react';
import { 
  initDarkMode, 
  addDarkModeChangeListener,
  getDarkModeTimestamp,
  getDarkModeSetting,
  setDarkMode,
  isDarkModeNewerThan,
  type DarkModeChangeEventDetail 
} from '@cloudflare/style-const';

function App() {
  const [user, setUser] = useState(null);
  const [darkModeState, setDarkModeState] = useState<DarkModeChangeEventDetail | null>(null);

  // Initialize dark mode
  useEffect(() => {
    const cleanup = initDarkMode();
    return cleanup;
  }, []);

  // Sync with database on login
  useEffect(() => {
    if (!user) return;

    const syncDarkMode = async () => {
      const localTimestamp = getDarkModeTimestamp();
      const dbTimestamp = user.darkModeUpdatedAt || 0;
      
      if (localTimestamp > dbTimestamp) {
        // Local is newer → update database
        await fetch('/api/user/preferences', {
          method: 'POST',
          body: JSON.stringify({
            darkMode: getDarkModeSetting(),
            updatedAt: localTimestamp
          })
        });
      } else if (dbTimestamp > localTimestamp) {
        // Database is newer → update local
        setDarkMode(user.darkModeSetting);
      }
    };

    syncDarkMode();
  }, [user]);

  // Listen for dark mode changes
  useEffect(() => {
    const cleanup = addDarkModeChangeListener(async (detail) => {
      setDarkModeState(detail);
      
      // Update database when logged in
      if (user?.isLoggedIn) {
        await fetch('/api/user/preferences', {
          method: 'POST',
          body: JSON.stringify({
            darkMode: detail.value,
            updatedAt: detail.timestamp
          })
        });
      }
    });

    return cleanup;
  }, [user]);

  return (
    <div>
      <h1>My App</h1>
      <p>Dark mode: {darkModeState?.isDark ? 'ON' : 'OFF'}</p>
    </div>
  );
}
```

### Example 2: Astro/Starlight Integration

```typescript
// In your Astro component
import { 
  initDarkMode, 
  setDarkModeNamingStrategy,
  addDarkModeChangeListener,
  DarkModeNamingStrategy 
} from '@cloudflare/style-const';

// Initialize with Astro naming
initDarkMode({ 
  namingStrategy: DarkModeNamingStrategy.ASTRO 
});

// Listen for changes
addDarkModeChangeListener((detail) => {
  // detail.value will be 'dark', 'light', or 'auto'
  console.log('Theme changed to:', detail.value);
  
  // Update your Starlight theme
  document.documentElement.setAttribute('data-theme', detail.value);
});
```

### Example 3: Simple Event Listener (No Database)

```typescript
import { addDarkModeChangeListener } from '@cloudflare/style-const';

// Just react to changes, no database syncing needed
addDarkModeChangeListener((detail) => {
  // Update chart library theme
  if (detail.isDark) {
    chartLibrary.setTheme('dark');
  } else {
    chartLibrary.setTheme('light');
  }
  
  // Update analytics
  analytics.track('theme_changed', { theme: detail.value });
});
```

---

## API Reference Summary

### Event Listeners

- **`addDarkModeChangeListener(callback)`** - Add a listener for dark mode changes
- **`removeDarkModeChangeListener(callback)`** - Remove a listener
- **Event Detail Type**: `DarkModeChangeEventDetail` with properties:
  - `setting`: Internal setting value (DarkModeSettings)
  - `isDark`: Boolean indicating if dark mode is active
  - `timestamp`: Unix timestamp of when change occurred
  - `namingStrategy`: Current naming strategy
  - `value`: Setting value in current naming strategy

### Naming Strategies

- **`DarkModeNamingStrategy.CLOUDFLARE`** - Use 'on'/'off'/'system'
- **`DarkModeNamingStrategy.ASTRO`** - Use 'dark'/'light'/'auto'
- **`setDarkModeNamingStrategy(strategy)`** - Change naming strategy
- **`getDarkModeNamingStrategy()`** - Get current strategy
- **`translateDarkModeSetting(value, from, to)`** - Translate between strategies

### Timestamps

- **`getDarkModeTimestamp()`** - Get timestamp of last change
- **`isDarkModeNewerThan(timestamp)`** - Check if local value is newer

### Types

- **`DarkModeSettings`** - Enum: 'on' | 'off' | 'system'
- **`AstroDarkModeSettings`** - Type: 'dark' | 'light' | 'auto'
- **`DarkModeNamingStrategy`** - Enum: CLOUDFLARE | ASTRO
- **`DarkModeChangeEventDetail`** - Event detail interface
- **`DarkModeChangeEvent`** - Custom event type

---

## Migration Guide

If you're already using the library, here's how to adopt the new features:

### Before (Old Pattern)

```typescript
// Old way: Manual storage management
const setting = localStorage.getItem('dark-mode');
if (setting) {
  setDarkMode(setting);
}

// Update database manually
window.addEventListener('storage', (e) => {
  if (e.key === 'dark-mode') {
    updateDatabase(e.newValue);
  }
});
```

### After (New Pattern)

```typescript
// New way: Event-based
import { initDarkMode, addDarkModeChangeListener } from '@cloudflare/style-const';

initDarkMode(); // Handles all storage automatically

addDarkModeChangeListener((detail) => {
  // Just react to changes - storage is handled for you
  updateDatabase(detail.value, detail.timestamp);
});
```

---

## Best Practices

1. **Always use event listeners** instead of polling or manual storage checks
2. **Store timestamps in your database** alongside preferences for proper conflict resolution
3. **Use naming strategies** to match your framework's conventions
4. **Clean up listeners** when components unmount to prevent memory leaks
5. **Sync on login**, not just on changes, to handle cross-device scenarios

---

## Support

For questions or issues, please contact the Cloudflare frontend infrastructure team.
