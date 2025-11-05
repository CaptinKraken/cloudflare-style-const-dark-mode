/**
 * Dark mode utility functions
 */

import { DarkModeNamingStrategy } from './types';

/**
 * Translate between Cloudflare and Astro naming conventions
 */
export const translateSetting = (
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

/**
 * Normalize a setting value to Cloudflare format (on/off/system)
 * This ensures values from any naming strategy are stored consistently in cookies
 */
export const normalizeToCloudflareFormat = (
  value: string,
  fromStrategy: DarkModeNamingStrategy
): string => {
  if (fromStrategy === DarkModeNamingStrategy.CLOUDFLARE) {
    return value;
  }
  // Convert from Astro to Cloudflare
  return translateSetting(value, fromStrategy, DarkModeNamingStrategy.CLOUDFLARE);
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
