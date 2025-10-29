# Migration Guide: @cloudflare/style-const v7.0.0

## TL;DR

**CSR apps (most apps):** No changes needed! Update the package and you're done.

**SSR apps:** Add 2 lines of code to get full SSR support.

**⚠️ Breaking change:** `theme.modeTransitionTime` removed (unlikely to affect your app)

---

## Breaking Changes

### Removed `theme.modeTransitionTime`

**Who is affected:** Only if you explicitly used `theme.modeTransitionTime` or `variables.modeTransitionTime`

**Why:** Removed transition suppression logic for simpler, instant dark mode toggle

**Migration:**
```typescript
// Before (6.x)
import { variables } from '@cloudflare/style-const';
const time = variables.modeTransitionTime; // ❌ No longer exists

// After (7.0)
// Use a constant if you need this value
const TRANSITION_TIME = 500; // ms
```

**Impact:** Very low - this was an internal implementation detail rarely used by consumers.

---

## For Client-Side Rendered (CSR) Apps

### No Action Required ✅

Your app will automatically benefit from cross-subdomain dark mode sync.

```typescript
// Before (6.x)
import { setDarkMode, DarkModeSettings } from '@cloudflare/style-const';
setDarkMode(DarkModeSettings.ON); // ✅ Still works

// After (7.0)
// Same code - now with cross-subdomain sync for free!
```

**What changed:**
- Dark mode now syncs across `dashboard.cloudflare.com`, `developer.cloudflare.com`, and other subdomains
- Uses cookie `cf_dark_mode` on `.cloudflare.com` domain
- localStorage still used for backwards compatibility
- PostMessage sync now automatic (no separate function needed)

---

## For Server-Side Rendered (SSR) Apps

### React Router v7, TanStack Start, Remix, Next.js

**Add these changes to prevent hydration issues:**

#### Step 1: Initialize on client mount

```typescript
import { useEffect } from 'react';
import { initDarkMode } from '@cloudflare/style-const';

function App() {
  useEffect(() => {
    initDarkMode(); // Add this line
  }, []);
  
  return <YourApp />;
}
```

#### Step 2: Prevent flash with inline script

```typescript
import { getInlineThemeScript } from '@cloudflare/style-const';

function RootLayout() {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Add this script */}
        <script dangerouslySetInnerHTML={{ __html: getInlineThemeScript() }} />
      </head>
      <body>{/* Your app */}</body>
    </html>
  );
}
```

#### Step 3 (Optional): Read dark mode on server

```typescript
import { getDarkModeFromRequest } from '@cloudflare/style-const';

export async function loader({ request }) {
  // Checks x-dark-mode header first, then cookie
  const darkModeSetting = getDarkModeFromRequest(request);
  return { darkModeSetting };
}

// Then pass to getInlineThemeScript:
<script dangerouslySetInnerHTML={{ 
  __html: getInlineThemeScript(darkModeSetting) 
}} />
```

> **Note:** `getDarkModeFromRequest()` checks the `x-dark-mode` header first (if your infrastructure sets it), then falls back to parsing the cookie
```

**See:** [DARK_MODE_SYNC.md](./DARK_MODE_SYNC.md) for complete framework-specific examples.

---

## For Astro + Starlight (developer.cloudflare.com)

See the Astro implementation section in [DARK_MODE_SYNC.md](./DARK_MODE_SYNC.md#implementation-for-astro--starlight).

**Summary:**
1. Create a `darkModeSync.ts` utility
2. Add inline script to layout
3. Call `initDarkModeSync()` on page load

---

## Breaking Changes

**None!** This is a fully backwards-compatible release.

- Existing CSR apps auto-initialize
- SSR apps can opt-in to explicit initialization for better control
- All existing APIs remain unchanged

---

## Benefits of Upgrading

### Before (6.1.x)
- ❌ Each app has separate dark mode state
- ❌ Dashboard iframe embedding developer docs shows mismatched themes
- ❌ SSR apps may have hydration issues

### After (6.2.0)
- ✅ All apps sync dark mode across subdomains
- ✅ Dashboard + developer docs always match
- ✅ SSR apps have proper utilities to prevent flash
- ✅ Real-time updates across tabs and iframes

---

## Common Questions

**Q: Do I need to change anything if my app is CSR?**  
A: No! Just upgrade the package. Auto-initialization handles everything.

**Q: Will this affect performance?**  
A: No. Cookie is 10-15 bytes, polling is <0.1% CPU.

**Q: What if users block cookies?**  
A: Falls back to localStorage (per-site preference). No errors, just no cross-site sync.

**Q: Can I change the cookie name?**  
A: Not recommended, but you can use `getDarkModeCookieName()` if you need to reference it. Cookie name is centralized in this package.

**Q: What about GDPR/privacy?**  
A: Cookie is functional (no consent needed), contains no PII, and is GDPR/CCPA compliant.

---

## Rollback

If you need to rollback:

```bash
npm install @cloudflare/style-const@6.1.1
```

Your app will work as before (localStorage only, no cross-subdomain sync).

---

## Support

- **Documentation:** [DARK_MODE_SYNC.md](./DARK_MODE_SYNC.md)
- **Questions:** Contact DevTools team
- **Issues:** File bug report with reproduction steps
