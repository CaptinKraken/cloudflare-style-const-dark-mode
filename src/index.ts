import variables from './variables';
import lightModeColors from './colors/lightScalesV1';
import lightModeColorsV2 from './colors/lightScalesV2';
import darkModeColors from './colors/darkScalesV1';
import darkModeColorsV2 from './colors/darkScalesV2';
import { alphaValues } from './colors/alpha';
import { focusBoxShadow } from './mixins';
import {
  DarkModeSettings,
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
  setDarkModeKey,
  toggleDarkMode
} from './darkMode';

export {
  variables,
  variables as theme,
  // Dark mode core functions
  isDarkMode,
  toggleDarkMode,
  setDarkMode,
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
  resetDarkMode,
  // Colors
  lightModeColors,
  lightModeColorsV2,
  darkModeColors,
  darkModeColorsV2,
  alphaValues,
  // Mixins
  focusBoxShadow
};

export * from './variables';
