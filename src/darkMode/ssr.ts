/**
 * Server-side rendering utilities for dark mode
 */

import {
  DARK_MODE_COOKIE_NAME,
  DEFAULT_DARK_MODE_CLASS
} from '../constants';
import { DarkModeSettings, DarkModeNamingStrategy } from './types';

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
 * Configuration for inline theme script
 */
export interface InlineThemeScriptConfig {
  /** Naming strategy: 'cloudflare' (default) or 'astro' */
  namingStrategy?: DarkModeNamingStrategy;
  /** For Astro/Starlight: localStorage key (default: 'starlight-theme') */
  storageKey?: string;
  /** For Astro/Starlight: DOM attribute name (default: 'data-theme') */
  themeAttribute?: string;
}

/**
 * Generate inline script code to prevent flash of unstyled content in SSR apps.
 * This script should be placed in the <head> before any CSS loads.
 *
 * Supports both Cloudflare (class-based) and Astro/Starlight (attribute-based) theming.
 *
 * @param fallbackSetting - Optional fallback setting if no cookie is found
 * @param config - Optional configuration for naming strategy and storage
 * @returns JavaScript code as a string to be inserted in a <script> tag
 *
 * @example
 * // Cloudflare style (class-based, default)
 * <script dangerouslySetInnerHTML={{ __html: getInlineThemeScript('off') }} />
 *
 * @example
 * // Astro/Starlight style (attribute-based)
 * <script dangerouslySetInnerHTML={{ __html: getInlineThemeScript('off', {
 *   namingStrategy: DarkModeNamingStrategy.ASTRO,
 *   storageKey: 'starlight-theme',
 *   themeAttribute: 'data-theme'
 * }) }} />
 *
 * @example
 * // With server-loaded setting
 * const { darkModeSetting } = useLoaderData();
 * <script dangerouslySetInnerHTML={{ __html: getInlineThemeScript(darkModeSetting) }} />
 */
export const getInlineThemeScript = (
  fallbackSetting: DarkModeSettings = DarkModeSettings.OFF,
  config?: InlineThemeScriptConfig
): string => {
  const {
    namingStrategy = DarkModeNamingStrategy.CLOUDFLARE,
    storageKey = 'starlight-theme',
    themeAttribute = 'data-theme'
  } = config || {};

  if (namingStrategy === DarkModeNamingStrategy.ASTRO) {
    // Astro/Starlight: attribute-based with localStorage
    return `(function(){try{var c=document.cookie.match(/${DARK_MODE_COOKIE_NAME}=([^;]*)/);var cv=c?decodeURIComponent(c[1]):'${fallbackSetting}';var v=cv.split(':')[0];var t=v==='on'?'dark':v==='off'?'light':'auto';var dt=t;if(t==='auto'){dt=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('${themeAttribute}',dt);try{localStorage.setItem('${storageKey}',t);}catch(e){}}catch(e){}})();`;
  }

  // Cloudflare: class-based (default)
  return `(function(){try{var c=document.cookie.match(/${DARK_MODE_COOKIE_NAME}=([^;]*)/);var cv=c?decodeURIComponent(c[1]):'${fallbackSetting}';var v=cv.split(':')[0];var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var s=v==='on'||(v==='system'&&d);if(s)document.documentElement.classList.add('${DEFAULT_DARK_MODE_CLASS}');}catch(e){}})();`;
};
