# @cloudflare/style-const

> Cloudflare Style Constants

Style constants, theme variables, and dark mode utilities for Cloudflare applications.

## Installation

```sh
npm install @cloudflare/style-const
```

## Features

- **Theme variables** - Design tokens and constants for consistent styling
- **Dark mode** - Cross-subdomain synchronized dark mode
- **SSR support** - Works with React Router v7, Next.js, Remix, TanStack Start
- **Framework agnostic** - Use with any React-based framework

## Quick Start

### Basic Dark Mode (CSR)

```typescript
import { setDarkMode, DarkModeSettings } from '@cloudflare/style-const';

// Enable dark mode
setDarkMode(DarkModeSettings.ON);
```

### SSR Apps (React Router, Next.js, Remix, etc.)

```typescript
import { useEffect } from 'react';
import { 
  initDarkMode, 
  getDarkModeFromRequest, 
  getInlineThemeScript 
} from '@cloudflare/style-const';

// 1. Initialize after hydration
useEffect(() => {
  initDarkMode();
}, []);

// 2. Prevent flash with inline script
<script dangerouslySetInnerHTML={{ __html: getInlineThemeScript() }} />

// 3. (Optional) Read from server
export async function loader({ request }) {
  // Checks x-dark-mode header first, then cookie
  const darkModeSetting = getDarkModeFromRequest(request);
  return { darkModeSetting };
}
```

## Documentation

| Guide | Purpose |
|-------|---------|
| **[DARK_MODE_SYNC.md](./DARK_MODE_SYNC.md)** | Complete API reference, framework examples, troubleshooting |
| **[ADVANCED_USAGE.md](./ADVANCED_USAGE.md)** | Local dev, Tailwind CSS, testing, security, scalability |
| **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** | Upgrade from 6.x to 7.0 |
| **[COOKIE_CONSENT.md](./COOKIE_CONSENT.md)** | OneTrust configuration and legal compliance |

## Cross-Subdomain Sync

Dark mode preferences are automatically synchronized across all `*.cloudflare.com` subdomains using a shared cookie:

- `dashboard.cloudflare.com` ↔ `developer.cloudflare.com`
- Parent pages ↔ Iframes
- Multiple tabs
- Real-time updates within 1 second

### Fallback for Blocked Cookies

**Automatic!** PostMessage sync is now built-in - no extra code needed. When cookies are blocked, `initDarkMode()` automatically handles iframe sync via postMessage.

## Theme Variables

Constants used to theme cf-ui and cf-ux and all other Fela components. `variables` are passed as `this.context.theme` through the React codebase. You can use HOCs like `createComponent()` from `cf-style-container` to wire `this.context.theme` into `props.theme`.

## Cookie Consent (OneTrust)

The `cf_dark_mode` cookie should be registered in OneTrust as a **Strictly Necessary/Functional** cookie (consent not required). See [DARK_MODE_SYNC.md](./DARK_MODE_SYNC.md#onetrust-cookie-consent) for OneTrust configuration details.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.
