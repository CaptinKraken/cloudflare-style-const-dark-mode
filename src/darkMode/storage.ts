/**
 * Dark mode storage utilities
 * Handles cookie and localStorage operations
 */

import {
  CLOUDFLARE_APEX_HOST,
  CLOUDFLARE_DOMAIN_SUFFIX,
  DARK_MODE_COOKIE_NAME
} from '../constants';
import { DarkModeCookieData } from './types';

/**
 * Get the dark mode cookie value including timestamp
 * Cookie format: "value:timestamp" (e.g., "on:1699564800000")
 * Returns { value, timestamp } or null
 */
export const getDarkModeCookieWithTimestamp = (): DarkModeCookieData | null => {
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
export const setCookie = (name: string, value: string, days = 365) => {
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
export const setDarkModeCookie = (value: string, timestamp: number) => {
  const cookieValue = `${value}:${timestamp}`;
  setCookie(DARK_MODE_COOKIE_NAME, cookieValue);
};
