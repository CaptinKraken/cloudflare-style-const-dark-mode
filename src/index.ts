import variables from './variables';
import lightModeColors from './colors/lightScalesV1';
import lightModeColorsV2 from './colors/lightScalesV2';
import darkModeColors from './colors/darkScalesV1';
import darkModeColorsV2 from './colors/darkScalesV2';
import { alphaValues } from './colors/alpha';
import { focusBoxShadow } from './mixins';
import {
  // Core types and enums
  DarkModeSettings,
  DarkModeNamingStrategy,
  // Core functions
  getDarkModeSetting,
  getDarkModeCookieName,
  getDarkModeFromCookieHeader,
  getDarkModeFromRequest,
  getInlineThemeScript,
  initDarkMode,
  isDarkMode,
  isLocalDevelopment,
  observeDarkMode,
  resetDarkMode,
  setDarkMode,
  setDarkModeFromStrategy,
  setDarkModeKey,
  toggleDarkMode,
  // Enhanced integration API
  addDarkModeChangeListener,
  removeDarkModeChangeListener,
  getDarkModeTimestamp,
  setDarkModeNamingStrategy,
  getDarkModeNamingStrategy,
  translateDarkModeSetting,
  isDarkModeNewerThan,
  normalizeToCloudflareFormat
} from './darkMode';

export {
  variables,
  variables as theme,
  // Dark mode core functions
  isDarkMode,
  toggleDarkMode,
  setDarkMode,
  setDarkModeFromStrategy,
  setDarkModeKey,
  observeDarkMode,
  getDarkModeSetting,
  DarkModeSettings,
  // Dark mode SSR helpers
  initDarkMode,
  getDarkModeCookieName,
  getDarkModeFromRequest,
  getDarkModeFromCookieHeader,
  getInlineThemeScript,
  // Dark mode utilities
  isLocalDevelopment,
  normalizeToCloudflareFormat,
  resetDarkMode,
  // Enhanced integration API
  addDarkModeChangeListener,
  removeDarkModeChangeListener,
  getDarkModeTimestamp,
  setDarkModeNamingStrategy,
  getDarkModeNamingStrategy,
  translateDarkModeSetting,
  isDarkModeNewerThan,
  // Enums
  DarkModeNamingStrategy,
  // Colors
  lightModeColors,
  lightModeColorsV2,
  darkModeColors,
  darkModeColorsV2,
  alphaValues,
  // Mixins
  focusBoxShadow
};

// Type-only exports for TypeScript isolatedModules
export type { AstroDarkModeSettings, DarkModeChangeEventDetail, DarkModeChangeEvent, InlineThemeScriptConfig } from './darkMode';

export * from './variables';
