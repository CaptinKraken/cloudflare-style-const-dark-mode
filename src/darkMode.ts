/**
 * Dark Mode utilities for Cloudflare applications
 *
 * Provides cross-subdomain, cross-tab, and iframe synchronization for dark mode preferences.
 *
 * @module darkMode
 */

let darkModeClassName = 'dark-mode';

// Cookie name for cross-subdomain dark mode sync
const DARK_MODE_COOKIE_NAME = 'cf_dark_mode';

/**
 * Get a cookie value by name
 */
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : null;
};

/**
 * Set a cookie on the apex domain (.cloudflare.com)
 * This allows sharing dark mode preference across dashboard.cloudflare.com and developer.cloudflare.com
 */
const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') return;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  // Determine if we're on a cloudflare.com domain
  const hostname = window.location.hostname;
  const isCloudflare =
    hostname.endsWith('.cloudflare.com') || hostname === 'cloudflare.com';
  const domain = isCloudflare ? '.cloudflare.com' : '';

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${date.toUTCString()}; path=/; ${
    domain ? `domain=${domain}; ` : ''
  }SameSite=Lax; Secure`;
};

export enum DarkModeSettings {
  ON = 'on',
  OFF = 'off',
  SYSTEM = 'system'
}

// Defensive checks in case component library is used outside the browser
// E.g. server side rendering
const classList =
  typeof document !== 'undefined' && document.documentElement.classList;

/**
 * Allow customizing the class name/local storage key used for dark mode.
 * By default, it will also remove the old key from local storage and add the new one.
 *
 * @example
 * // For Tailwind CSS (uses 'dark' class instead of 'dark-mode')
 * setDarkModeKey('dark');
 *
 * @example
 * // For custom class name
 * setDarkModeKey('theme-dark');
 */
export const setDarkModeKey = (newKey: string, updateStorage = true) => {
  const prevKey = darkModeClassName;
  darkModeClassName = newKey;

  if (updateStorage) {
    if (localStorage[newKey]) {
      // If there's a setting stored for the new key, use it.
      setDarkMode(localStorage[newKey], true);
    } else if (localStorage[prevKey]) {
      // If there's a setting stored for the old key, copy it over.
      localStorage.setItem(newKey, localStorage[prevKey]);
    }

    localStorage.removeItem(prevKey);
  }
};

export const isDarkMode = () =>
  classList && classList.contains(darkModeClassName);

export const toggleDarkMode = (condition?: boolean) => {
  if (classList) {
    classList.toggle(darkModeClassName, condition);
  }
};

const darkModeMatch =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)');

let systemDarkMode = darkModeMatch ? darkModeMatch.matches : false;

// Listen for system preference changes
darkModeMatch &&
  darkModeMatch.addEventListener?.('change', e => {
    systemDarkMode = e.matches;
    // Re-apply if using system preference
    if (syncManager.getSetting() === DarkModeSettings.SYSTEM) {
      syncManager.updateSetting(DarkModeSettings.SYSTEM, false);
    }
  });

export const setDarkMode = (
  darkMode: DarkModeSettings,
  updateStorage = true
) => {
  syncManager.updateSetting(darkMode, updateStorage);
};

// ============================================================================
// Dark Mode Sync Manager - Centralized sync logic
// ============================================================================

/**
 * Manages all dark mode synchronization methods:
 * - Cookie (cross-subdomain)
 * - localStorage (backwards compatibility)
 * - PostMessage (iframe communication)
 * - Storage events (cross-tab)
 * - Cookie polling (cross-subdomain detection)
 */
class DarkModeSyncManager {
  private currentSetting: DarkModeSettings = DarkModeSettings.OFF;
  private isInitialized = false;
  private pollingIntervalId: ReturnType<typeof setInterval> | null = null;
  private storageEventHandler: ((e: StorageEvent) => void) | null = null;
  private messageEventHandler: ((e: MessageEvent) => void) | null = null;

  /**
   * Initialize all sync mechanisms and return cleanup function
   */
  initialize(): () => void {
    if (this.isInitialized || typeof window === 'undefined') {
      return () => {}; // Already initialized or not in browser
    }

    this.isInitialized = true;

    // 1. Read initial setting (cookie → localStorage → default)
    this.currentSetting = this.readInitialSetting();

    // 2. Apply the setting
    this.applySetting(this.currentSetting, false);

    // 3. Set up all sync mechanisms
    this.setupStorageSync();
    this.setupCookiePolling();
    this.setupPostMessageSync();

    // 4. Return cleanup function
    return () => this.cleanup();
  }

  /**
   * Update dark mode setting and sync across all methods
   */
  updateSetting(setting: DarkModeSettings, shouldSync: boolean = true) {
    this.currentSetting = setting;
    this.applySetting(setting, shouldSync);
  }

  /**
   * Get current setting
   */
  getSetting(): DarkModeSettings {
    return this.currentSetting;
  }

  // ==================== Private Methods ====================

  /**
   * Read initial setting: cookie → localStorage → default OFF
   */
  private readInitialSetting(): DarkModeSettings {
    if (typeof localStorage === 'undefined') {
      return DarkModeSettings.OFF;
    }

    // Priority 1: Cookie (cross-subdomain)
    const cookieValue = getCookie(DARK_MODE_COOKIE_NAME) as DarkModeSettings;
    if (cookieValue && Object.values(DarkModeSettings).includes(cookieValue)) {
      return cookieValue;
    }

    // Priority 2: localStorage (backwards compatibility)
    const localValue = localStorage[darkModeClassName] as DarkModeSettings;
    if (localValue && Object.values(DarkModeSettings).includes(localValue)) {
      // Sync to cookie for future cross-subdomain access
      setCookie(DARK_MODE_COOKIE_NAME, localValue);
      return localValue;
    }

    return DarkModeSettings.OFF;
  }

  /**
   * Apply setting to DOM and optionally sync to storage
   */
  private applySetting(setting: DarkModeSettings, shouldSync: boolean) {
    // Update DOM
    toggleDarkMode(
      setting === DarkModeSettings.ON ||
        (setting === DarkModeSettings.SYSTEM && systemDarkMode)
    );

    // Sync to storage if requested
    if (shouldSync && typeof localStorage !== 'undefined') {
      localStorage[darkModeClassName] = setting;
      setCookie(DARK_MODE_COOKIE_NAME, setting);
      this.broadcastToIframes(setting);
    }
  }

  /**
   * Set up cross-tab sync via storage events
   */
  private setupStorageSync() {
    this.storageEventHandler = (e: StorageEvent) => {
      if (e.key === darkModeClassName && e.newValue) {
        const newSetting = e.newValue as DarkModeSettings;
        if (Object.values(DarkModeSettings).includes(newSetting)) {
          this.updateSetting(newSetting, false); // Don't re-sync to avoid loops
        }
      }
    };
    window.addEventListener('storage', this.storageEventHandler);
  }

  /**
   * Set up cookie polling for cross-subdomain sync
   */
  private setupCookiePolling() {
    this.pollingIntervalId = setInterval(() => {
      const cookieValue = getCookie(DARK_MODE_COOKIE_NAME) as DarkModeSettings;
      if (
        cookieValue &&
        Object.values(DarkModeSettings).includes(cookieValue) &&
        cookieValue !== this.currentSetting
      ) {
        this.updateSetting(cookieValue, false); // Don't re-sync to avoid loops
      }
    }, 1000);
  }

  /**
   * Set up postMessage for iframe sync (automatic fallback for blocked cookies)
   */
  private setupPostMessageSync() {
    this.messageEventHandler = (event: MessageEvent) => {
      // Security: Only accept from cloudflare.com origins
      if (
        !event.origin.endsWith('.cloudflare.com') &&
        event.origin !== 'https://cloudflare.com'
      ) {
        return;
      }

      if (event.data?.type === 'cf-dark-mode-sync') {
        const newSetting = event.data.setting as DarkModeSettings;
        if (Object.values(DarkModeSettings).includes(newSetting)) {
          this.updateSetting(newSetting, false); // Don't re-sync to avoid loops
        }
      }
    };
    window.addEventListener('message', this.messageEventHandler);
  }

  /**
   * Broadcast setting to all iframes and parent (if in iframe)
   */
  private broadcastToIframes(setting: DarkModeSettings) {
    if (typeof window === 'undefined') return;

    const message = { type: 'cf-dark-mode-sync', setting };

    // Notify all iframes
    document.querySelectorAll('iframe').forEach(iframe => {
      try {
        iframe.contentWindow?.postMessage(message, '*');
      } catch (e) {
        // Cross-origin, ignore
      }
    });

    // Notify parent if we're in an iframe
    if (window.parent !== window) {
      try {
        window.parent.postMessage(message, '*');
      } catch (e) {
        // Can't access parent, ignore
      }
    }
  }

  /**
   * Clean up all sync mechanisms
   */
  private cleanup() {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = null;
    }
    if (this.storageEventHandler) {
      window.removeEventListener('storage', this.storageEventHandler);
      this.storageEventHandler = null;
    }
    if (this.messageEventHandler) {
      window.removeEventListener('message', this.messageEventHandler);
      this.messageEventHandler = null;
    }
    this.isInitialized = false;
  }
}

// Singleton instance
const syncManager = new DarkModeSyncManager();

// ============================================================================
// Public API - Simple and focused
// ============================================================================

/**
 * Initialize dark mode synchronization.
 *
 * Automatically handles:
 * - Reading from cookie/localStorage
 * - Cross-tab sync (storage events)
 * - Cross-subdomain sync (cookie polling)
 * - Iframe sync (postMessage)
 *
 * For SSR apps: Call this in useEffect after component mounts
 * For CSR apps: This is called automatically
 *
 * @returns Cleanup function to stop all sync mechanisms
 *
 * @example
 * // React SSR app
 * useEffect(() => {
 *   const cleanup = initDarkMode();
 *   return cleanup;
 * }, []);
 */
export const initDarkMode = (): (() => void) => {
  return syncManager.initialize();
};

// Auto-initialize for non-SSR apps (backwards compatibility)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Defer to avoid blocking module load
  setTimeout(() => initDarkMode(), 0);
}

export const getDarkModeSetting = () => syncManager.getSetting();

/**
 * Get the cookie name used for cross-subdomain dark mode sync.
 * Useful if you need to reference it in your own code.
 *
 * @example
 * const cookieName = getDarkModeCookieName(); // 'cf_dark_mode'
 */
export const getDarkModeCookieName = () => DARK_MODE_COOKIE_NAME;

/**
 * Parse dark mode setting from request (supports both x-dark-mode header and cookie).
 *
 * Checks in order:
 * 1. x-dark-mode header (if your infrastructure sets it from the cookie)
 * 2. cf_dark_mode cookie (parsed from Cookie header)
 *
 * @param request - The Request object or headers
 * @returns The dark mode setting ('on', 'off', or 'system')
 *
 * @example
 * // React Router v7 / Remix (with Request object)
 * export async function loader({ request }) {
 *   const darkModeSetting = getDarkModeFromRequest(request);
 *   return { darkModeSetting };
 * }
 *
 * @example
 * // With Headers object
 * export async function loader({ request }) {
 *   const darkModeSetting = getDarkModeFromRequest(request.headers);
 *   return { darkModeSetting };
 * }
 */
export const getDarkModeFromRequest = (
  request: Request | Headers
): DarkModeSettings => {
  const headers = request instanceof Request ? request.headers : request;

  // Priority 1: Check x-dark-mode header (if set by middleware/CDN)
  const headerValue = headers.get('x-dark-mode');
  if (headerValue) {
    const value = headerValue as DarkModeSettings;
    if (Object.values(DarkModeSettings).includes(value)) {
      return value;
    }
  }

  // Priority 2: Parse from cookie header
  const cookieHeader = headers.get('Cookie') || '';
  return getDarkModeFromCookieHeader(cookieHeader);
};

/**
 * Parse dark mode setting from cookie header (for server-side rendering).
 * Use this in your SSR loaders to read the dark mode preference from request cookies.
 *
 * Note: If your infrastructure sets the x-dark-mode header from the cookie,
 * use getDarkModeFromRequest() instead as it's simpler.
 *
 * @param cookieHeader - The Cookie header string from the HTTP request
 * @returns The dark mode setting ('on', 'off', or 'system')
 *
 * @example
 * // React Router v7 / Remix
 * export async function loader({ request }) {
 *   const cookieHeader = request.headers.get('Cookie') || '';
 *   const darkModeSetting = getDarkModeFromCookieHeader(cookieHeader);
 *   return { darkModeSetting };
 * }
 *
 * @example
 * // Next.js App Router
 * import { cookies } from 'next/headers';
 * const cookieStore = await cookies();
 * const darkModeCookie = cookieStore.get('cf_dark_mode');
 * const darkModeSetting = darkModeCookie?.value || 'off';
 */
export const getDarkModeFromCookieHeader = (
  cookieHeader: string
): DarkModeSettings => {
  const match = cookieHeader.match(
    new RegExp('(?:^|; )' + DARK_MODE_COOKIE_NAME + '=([^;]*)')
  );
  if (match) {
    const value = decodeURIComponent(match[1]) as DarkModeSettings;
    if (Object.values(DarkModeSettings).includes(value)) {
      return value;
    }
  }
  return DarkModeSettings.OFF;
};

/**
 * Generate inline script code to prevent flash of unstyled content in SSR apps.
 * This script should be placed in the <head> before any CSS loads.
 *
 * @param fallbackSetting - Optional fallback setting if no cookie is found
 * @returns JavaScript code as a string to be inserted in a <script> tag
 *
 * @example
 * // React Router / Remix / Next.js
 * <script dangerouslySetInnerHTML={{ __html: getInlineThemeScript('off') }} />
 *
 * @example
 * // With server-loaded setting
 * const { darkModeSetting } = useLoaderData();
 * <script dangerouslySetInnerHTML={{ __html: getInlineThemeScript(darkModeSetting) }} />
 */
export const getInlineThemeScript = (
  fallbackSetting: DarkModeSettings = DarkModeSettings.OFF
): string => {
  return `(function(){try{var c=document.cookie.match(/cf_dark_mode=([^;]*)/);var v=c?decodeURIComponent(c[1]):'${fallbackSetting}';var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var s=v==='on'||(v==='system'&&d);if(s)document.documentElement.classList.add('dark-mode');}catch(e){}})();`;
};

/**
 * Check if running in local development environment.
 * Useful for debugging or conditional behavior.
 *
 * @returns true if on localhost/127.0.0.1, false otherwise
 */
export const isLocalDevelopment = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0'
  );
};

/**
 * Reset dark mode state (useful for testing).
 * Clears cookie, localStorage, and resets to default.
 *
 * @example
 * // In tests
 * afterEach(() => {
 *   resetDarkMode();
 * });
 */
export const resetDarkMode = () => {
  if (typeof window === 'undefined') return;

  // Clear cookie
  if (typeof document !== 'undefined') {
    document.cookie = `${DARK_MODE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // Clear localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(darkModeClassName);
  }

  // Reset to OFF
  syncManager.updateSetting(DarkModeSettings.OFF, false);
};

/**
 * Observe dark mode changes with a callback.
 *
 * @param fn - Callback function that receives the dark mode state
 *
 * @example
 * import { observeDarkMode } from '@cloudflare/style-const';
 *
 * observeDarkMode((isDark) => {
 *   console.log('Dark mode:', isDark);
 * });
 */
export const observeDarkMode = (fn: (darkMode?: boolean) => void) => {
  let darkMode = isDarkMode();
  const hasWindow = typeof window !== 'undefined';
  let observer;
  if (hasWindow) {
    observer =
      window.MutationObserver &&
      new MutationObserver(() => {
        const currentDarkMode = isDarkMode();
        if (darkMode !== currentDarkMode) {
          darkMode = currentDarkMode;
          fn(darkMode);
        }
      });
  }

  observer?.observe(document.documentElement, { attributes: true });
};
