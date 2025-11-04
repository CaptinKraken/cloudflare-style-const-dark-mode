/**
 * Dark Mode utilities for Cloudflare applications
 *
 * Provides cross-subdomain, cross-tab, and iframe synchronization for dark mode preferences.
 *
 * @module darkMode
 */

import {
  CLOUDFLARE_APEX_HOST,
  CLOUDFLARE_DOMAIN_SUFFIX,
  COOKIE_POLL_INTERVAL,
  DARK_MODE_BROADCAST_CHANNEL,
  DARK_MODE_CHANGE_EVENT,
  DARK_MODE_COOKIE_NAME,
  DARK_MODE_MESSAGE_TYPE,
  DEFAULT_DARK_MODE_CLASS,
  LOCAL_DEV_HOSTS,
  TRUSTED_CLOUDFLARE_ORIGINS
} from './constants';

let darkModeClassName = DEFAULT_DARK_MODE_CLASS;

/**
 * Get the dark mode cookie value including timestamp
 * Cookie format: "value:timestamp" (e.g., "on:1699564800000")
 * Returns { value, timestamp } or null
 */
const getDarkModeCookieWithTimestamp = (): {
  value: string;
  timestamp: number;
} | null => {
  if (typeof document === 'undefined') return null;

  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        DARK_MODE_COOKIE_NAME.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );

  if (!matches) return null;

  const cookieValue = decodeURIComponent(matches[1]);
  const parts = cookieValue.split(':');

  // Format: value:timestamp or just value (backward compat)
  const settingValue = parts[0];
  const timestamp = parts[1] ? parseInt(parts[1], 10) : 0;

  return { value: settingValue, timestamp };
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
    hostname.endsWith(CLOUDFLARE_DOMAIN_SUFFIX) ||
    hostname === CLOUDFLARE_APEX_HOST;
  const domain = isCloudflare ? CLOUDFLARE_DOMAIN_SUFFIX : '';

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${date.toUTCString()}; path=/; ${
    domain ? `domain=${domain}; ` : ''
  }SameSite=Lax; Secure`;
};

/**
 * Set the dark mode cookie with both value and timestamp
 * Format: value:timestamp (e.g., "on:1699564800000")
 */
const setDarkModeCookie = (value: string, timestamp: number) => {
  const cookieValue = `${value}:${timestamp}`;
  setCookie(DARK_MODE_COOKIE_NAME, cookieValue);
};

/**
 * Translate between Cloudflare and Astro naming conventions
 */
const translateSetting = (
  value: string,
  fromStrategy: DarkModeNamingStrategy,
  toStrategy: DarkModeNamingStrategy
): string => {
  if (fromStrategy === toStrategy) return value;

  const translations: Record<string, Record<string, string>> = {
    [DarkModeNamingStrategy.CLOUDFLARE]: {
      on: 'dark',
      off: 'light',
      system: 'auto'
    },
    [DarkModeNamingStrategy.ASTRO]: {
      dark: 'on',
      light: 'off',
      auto: 'system'
    }
  };

  return translations[fromStrategy]?.[value] || value;
};

export enum DarkModeSettings {
  ON = 'on',
  OFF = 'off',
  SYSTEM = 'system'
}

/**
 * Alternative naming strategies for dark mode settings
 * Useful for frameworks like Astro/Starlight that use different conventions
 */
export enum DarkModeNamingStrategy {
  /** Cloudflare default: 'on' | 'off' | 'system' */
  CLOUDFLARE = 'cloudflare',
  /** Astro/Starlight style: 'dark' | 'light' | 'auto' */
  ASTRO = 'astro'
}

/**
 * Type for Astro-style dark mode settings
 */
export type AstroDarkModeSettings = 'dark' | 'light' | 'auto';

/**
 * Event detail for dark mode change events
 */
export interface DarkModeChangeEventDetail {
  /** The dark mode setting value */
  setting: DarkModeSettings;
  /** Whether dark mode is currently active (computed from setting + system preference) */
  isDark: boolean;
  /** Timestamp of when this change occurred */
  timestamp: number;
  /** The naming strategy being used */
  namingStrategy: DarkModeNamingStrategy;
  /** The setting value in the current naming strategy */
  value: string;
}

/**
 * Custom event type for dark mode changes
 */
export interface DarkModeChangeEvent
  extends CustomEvent<DarkModeChangeEventDetail> {
  type: typeof DARK_MODE_CHANGE_EVENT;
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
  if (!newKey || newKey === darkModeClassName) {
    return;
  }

  const prevKey = darkModeClassName;
  darkModeClassName = newKey;

  if (updateStorage) {
    if (typeof localStorage === 'undefined') {
      return;
    }

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
  private currentTimestamp: number = 0;
  private namingStrategy: DarkModeNamingStrategy =
    DarkModeNamingStrategy.CLOUDFLARE;
  private isInitialized = false;
  private pollingIntervalId: ReturnType<typeof setInterval> | null = null;
  private storageEventHandler: ((e: StorageEvent) => void) | null = null;
  private messageEventHandler: ((e: MessageEvent) => void) | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private eventListeners: Set<(detail: DarkModeChangeEventDetail) => void> =
    new Set();

  /**
   * Initialize all sync mechanisms and return cleanup function
   */
  initialize(options?: {
    namingStrategy?: DarkModeNamingStrategy;
  }): () => void {
    if (this.isInitialized || typeof window === 'undefined') {
      return () => {}; // Already initialized or not in browser
    }

    this.isInitialized = true;

    // Set naming strategy if provided
    if (options?.namingStrategy) {
      this.namingStrategy = options.namingStrategy;
    }

    // 1. Read initial setting (cookie → localStorage → default)
    const { setting, timestamp } = this.readInitialSetting();
    this.currentSetting = setting;
    this.currentTimestamp = timestamp;

    // 2. Apply the setting
    this.applySetting(this.currentSetting, false);

    // 3. Set up all sync mechanisms
    this.setupStorageSync();
    this.setupCookiePolling();
    this.setupPostMessageSync();
    this.setupBroadcastChannel();

    // 4. Return cleanup function
    return () => this.cleanup();
  }

  /**
   * Update dark mode setting and sync across all methods
   */
  updateSetting(
    setting: DarkModeSettings,
    shouldSync: boolean = true,
    timestamp?: number
  ) {
    const newTimestamp = timestamp || Date.now();
    this.currentSetting = setting;
    this.currentTimestamp = newTimestamp;
    this.applySetting(setting, shouldSync, newTimestamp);
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
  private readInitialSetting(): {
    setting: DarkModeSettings;
    timestamp: number;
  } {
    if (typeof localStorage === 'undefined') {
      return { setting: DarkModeSettings.OFF, timestamp: 0 };
    }

    // Priority 1: Cookie (cross-subdomain)
    const cookieData = getDarkModeCookieWithTimestamp();
    if (
      cookieData &&
      Object.values(DarkModeSettings).includes(
        cookieData.value as DarkModeSettings
      )
    ) {
      return {
        setting: cookieData.value as DarkModeSettings,
        timestamp: cookieData.timestamp
      };
    }

    // Priority 2: localStorage (backwards compatibility)
    const localValue = localStorage[darkModeClassName] as DarkModeSettings;
    if (localValue && Object.values(DarkModeSettings).includes(localValue)) {
      // Sync to cookie for future cross-subdomain access
      const timestamp = Date.now();
      setDarkModeCookie(localValue, timestamp);
      return { setting: localValue, timestamp };
    }

    return { setting: DarkModeSettings.OFF, timestamp: 0 };
  }

  /**
   * Apply setting to DOM and optionally sync to storage
   */
  private applySetting(
    setting: DarkModeSettings,
    shouldSync: boolean,
    timestamp?: number
  ) {
    const ts = timestamp || this.currentTimestamp;

    // Update DOM
    const isDark =
      setting === DarkModeSettings.ON ||
      (setting === DarkModeSettings.SYSTEM && systemDarkMode);
    toggleDarkMode(isDark);

    // Sync to storage if requested
    if (shouldSync && typeof localStorage !== 'undefined') {
      localStorage[darkModeClassName] = setting;
      setDarkModeCookie(setting, ts);
      this.broadcastToIframes(setting, ts);
    }

    // Emit custom event for consuming applications
    this.emitChangeEvent(setting, isDark, ts);
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
    this.pollingIntervalId = setInterval(
      () => this.checkCookieForUpdates(),
      COOKIE_POLL_INTERVAL
    );
  }

  /**
   * Set up postMessage for iframe sync (automatic fallback for blocked cookies)
   */
  private setupPostMessageSync() {
    this.messageEventHandler = (event: MessageEvent) => {
      if (!this.isTrustedOrigin(event.origin)) {
        // Opportunistically check cookies so fallback stays responsive
        this.checkCookieForUpdates();
        return;
      }

      if (event.data?.type === DARK_MODE_MESSAGE_TYPE) {
        const newSetting = event.data.setting as DarkModeSettings;
        const timestamp = event.data.timestamp as number;
        if (Object.values(DarkModeSettings).includes(newSetting)) {
          // Only update if timestamp is newer
          if (!timestamp || timestamp > this.currentTimestamp) {
            this.updateSetting(newSetting, false, timestamp); // Don't re-sync to avoid loops
          }
        }
      }
    };
    window.addEventListener('message', this.messageEventHandler);
  }

  /**
   * Broadcast setting to all iframes and parent (if in iframe)
   */
  private broadcastToIframes(setting: DarkModeSettings, timestamp: number) {
    if (typeof window === 'undefined') return;

    const message = { type: DARK_MODE_MESSAGE_TYPE, setting, timestamp };

    // BroadcastChannel provides immediate same-origin sync where supported
    try {
      this.broadcastChannel?.postMessage(message);
    } catch (e) {
      // No-op if channel unavailable
    }

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
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    this.isInitialized = false;
  }

  private setupBroadcastChannel() {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
      return;
    }

    // Close existing channel if re-initialized
    this.broadcastChannel?.close();
    this.broadcastChannel = new BroadcastChannel(DARK_MODE_BROADCAST_CHANNEL);
    this.broadcastChannel.onmessage = event => {
      const message = event.data;
      const newSetting = message?.setting as DarkModeSettings;
      const timestamp = message?.timestamp as number;
      if (
        message?.type === DARK_MODE_MESSAGE_TYPE &&
        Object.values(DarkModeSettings).includes(newSetting) &&
        (!timestamp || timestamp > this.currentTimestamp)
      ) {
        this.updateSetting(newSetting, false, timestamp);
      }
    };
  }

  private isTrustedOrigin(origin: string): boolean {
    if (!origin) return false;

    try {
      const url = new URL(origin);
      const host = url.hostname;

      if (origin === window.location.origin) {
        return true;
      }

      if (TRUSTED_CLOUDFLARE_ORIGINS.has(origin)) {
        return true;
      }

      if (
        host === CLOUDFLARE_APEX_HOST ||
        host.endsWith(CLOUDFLARE_DOMAIN_SUFFIX)
      ) {
        return true;
      }

      if (
        isLocalDevelopment() &&
        (LOCAL_DEV_HOSTS.has(host) || host === window.location.hostname)
      ) {
        return true;
      }
    } catch (e) {
      return false;
    }

    return false;
  }

  private checkCookieForUpdates() {
    const cookieData = getDarkModeCookieWithTimestamp();
    if (
      cookieData &&
      Object.values(DarkModeSettings).includes(
        cookieData.value as DarkModeSettings
      ) &&
      cookieData.timestamp > this.currentTimestamp
    ) {
      this.updateSetting(
        cookieData.value as DarkModeSettings,
        false,
        cookieData.timestamp
      );
    }
  }

  /**
   * Emit a custom event for consuming applications
   */
  private emitChangeEvent(
    setting: DarkModeSettings,
    isDark: boolean,
    timestamp: number
  ) {
    const value = translateSetting(
      setting,
      DarkModeNamingStrategy.CLOUDFLARE,
      this.namingStrategy
    );

    const detail: DarkModeChangeEventDetail = {
      setting,
      isDark,
      timestamp,
      namingStrategy: this.namingStrategy,
      value
    };

    // Notify registered listeners
    this.eventListeners.forEach(listener => {
      try {
        listener(detail);
      } catch (e) {
        console.error('Error in dark mode change listener:', e);
      }
    });

    // Dispatch custom DOM event
    if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
      const event = new CustomEvent(DARK_MODE_CHANGE_EVENT, {
        detail,
        bubbles: true,
        cancelable: false
      }) as DarkModeChangeEvent;
      window.dispatchEvent(event);
    }
  }

  /**
   * Add an event listener for dark mode changes
   */
  addEventListener(listener: (detail: DarkModeChangeEventDetail) => void) {
    this.eventListeners.add(listener);
  }

  /**
   * Remove an event listener
   */
  removeEventListener(listener: (detail: DarkModeChangeEventDetail) => void) {
    this.eventListeners.delete(listener);
  }

  /**
   * Get the current timestamp
   */
  getTimestamp(): number {
    return this.currentTimestamp;
  }

  /**
   * Set the naming strategy
   */
  setNamingStrategy(strategy: DarkModeNamingStrategy) {
    this.namingStrategy = strategy;
  }

  /**
   * Get the current naming strategy
   */
  getNamingStrategy(): DarkModeNamingStrategy {
    return this.namingStrategy;
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
 * @param options - Configuration options
 * @param options.namingStrategy - Which naming convention to use (CLOUDFLARE or ASTRO)
 * @returns Cleanup function to stop all sync mechanisms
 *
 * @example
 * // React SSR app with Cloudflare naming (default)
 * useEffect(() => {
 *   const cleanup = initDarkMode();
 *   return cleanup;
 * }, []);
 *
 * @example
 * // React SSR app with Astro/Starlight naming
 * useEffect(() => {
 *   const cleanup = initDarkMode({
 *     namingStrategy: DarkModeNamingStrategy.ASTRO
 *   });
 *   return cleanup;
 * }, []);
 */
export const initDarkMode = (options?: {
  namingStrategy?: DarkModeNamingStrategy;
}): (() => void) => {
  return syncManager.initialize(options);
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
    const cookieValue = decodeURIComponent(match[1]);
    // Parse format: "value:timestamp" or just "value" (backward compat)
    const value = cookieValue.split(':')[0] as DarkModeSettings;
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
  return `(function(){try{var c=document.cookie.match(/${DARK_MODE_COOKIE_NAME}=([^;]*)/);var cv=c?decodeURIComponent(c[1]):'${fallbackSetting}';var v=cv.split(':')[0];var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var s=v==='on'||(v==='system'&&d);if(s)document.documentElement.classList.add('${DEFAULT_DARK_MODE_CLASS}');}catch(e){}})();`;
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

// ============================================================================
// Enhanced Integration API - For consuming applications
// ============================================================================

/**
 * Add an event listener for dark mode changes.
 * This is the recommended way for consuming applications to react to dark mode changes.
 * The library handles all storage/syncing internally - apps just react to events.
 *
 * @param listener - Callback that receives detailed dark mode change information
 * @returns Cleanup function to remove the listener
 *
 * @example
 * // React component
 * useEffect(() => {
 *   const cleanup = addDarkModeChangeListener((detail) => {
 *     console.log('Dark mode changed:', detail.isDark);
 *     console.log('Setting value:', detail.value); // respects naming strategy
 *     console.log('Timestamp:', detail.timestamp);
 *
 *     // Update database if needed
 *     if (user.isLoggedIn) {
 *       updateUserPreference(detail.value, detail.timestamp);
 *     }
 *   });
 *   return cleanup;
 * }, []);
 *
 * @example
 * // Using DOM events instead
 * window.addEventListener('cf-dark-mode-change', (event) => {
 *   console.log('Dark mode:', event.detail.isDark);
 * });
 */
export const addDarkModeChangeListener = (
  listener: (detail: DarkModeChangeEventDetail) => void
): (() => void) => {
  syncManager.addEventListener(listener);
  return () => syncManager.removeEventListener(listener);
};

/**
 * Remove a dark mode change listener
 *
 * @param listener - The listener function to remove
 */
export const removeDarkModeChangeListener = (
  listener: (detail: DarkModeChangeEventDetail) => void
) => {
  syncManager.removeEventListener(listener);
};

/**
 * Get the timestamp of the last dark mode change.
 * Useful for determining if a database update is needed.
 *
 * @returns Unix timestamp in milliseconds
 *
 * @example
 * // Check if local value is newer than database value
 * const localTimestamp = getDarkModeTimestamp();
 * if (localTimestamp > dbUser.darkModeUpdatedAt) {
 *   // Local value is newer, update database
 *   await updateDarkModeInDatabase(getDarkModeSetting(), localTimestamp);
 * }
 */
export const getDarkModeTimestamp = (): number => {
  return syncManager.getTimestamp();
};

/**
 * Set the dark mode naming strategy.
 * Changes how the library reports values in events (e.g., 'on' vs 'dark').
 *
 * @param strategy - The naming strategy to use
 *
 * @example
 * // Use Astro/Starlight naming convention
 * setDarkModeNamingStrategy(DarkModeNamingStrategy.ASTRO);
 * // Now events will report 'dark', 'light', 'auto' instead of 'on', 'off', 'system'
 */
export const setDarkModeNamingStrategy = (strategy: DarkModeNamingStrategy) => {
  syncManager.setNamingStrategy(strategy);
};

/**
 * Get the current dark mode naming strategy
 *
 * @returns The current naming strategy
 */
export const getDarkModeNamingStrategy = (): DarkModeNamingStrategy => {
  return syncManager.getNamingStrategy();
};

/**
 * Translate a setting value between naming strategies
 *
 * @param value - The value to translate
 * @param fromStrategy - Source naming strategy
 * @param toStrategy - Target naming strategy
 * @returns Translated value
 *
 * @example
 * // Convert from Cloudflare to Astro naming
 * const astroValue = translateDarkModeSetting('on', DarkModeNamingStrategy.CLOUDFLARE, DarkModeNamingStrategy.ASTRO);
 * console.log(astroValue); // 'dark'
 *
 * @example
 * // Convert from Astro to Cloudflare naming
 * const cfValue = translateDarkModeSetting('auto', DarkModeNamingStrategy.ASTRO, DarkModeNamingStrategy.CLOUDFLARE);
 * console.log(cfValue); // 'system'
 */
export const translateDarkModeSetting = (
  value: string,
  fromStrategy: DarkModeNamingStrategy,
  toStrategy: DarkModeNamingStrategy
): string => {
  return translateSetting(value, fromStrategy, toStrategy);
};

/**
 * Check if the local dark mode value is newer than a given timestamp.
 * Useful for database sync logic.
 *
 * @param compareTimestamp - Timestamp to compare against (e.g., from database)
 * @returns true if local value is newer
 *
 * @example
 * // In your app's sync logic
 * const needsUpdate = isDarkModeNewerThan(user.darkModeUpdatedAt);
 * if (needsUpdate) {
 *   await updateUserPreference({
 *     darkMode: getDarkModeSetting(),
 *     updatedAt: getDarkModeTimestamp()
 *   });
 * }
 */
export const isDarkModeNewerThan = (compareTimestamp: number): boolean => {
  return syncManager.getTimestamp() > compareTimestamp;
};
