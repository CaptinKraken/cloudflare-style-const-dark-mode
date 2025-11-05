/**
 * DOM manipulation utilities for dark mode
 */

import { DEFAULT_DARK_MODE_CLASS } from '../constants';

let darkModeClassName = DEFAULT_DARK_MODE_CLASS;

// Defensive checks in case component library is used outside the browser
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
export const setDarkModeKey = (newKey: string, updateStorage = true, setDarkModeFn?: (value: string, sync: boolean) => void) => {
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
      if (setDarkModeFn) {
        setDarkModeFn(localStorage[newKey], true);
      }
    } else if (localStorage[prevKey]) {
      // If there's a setting stored for the old key, copy it over.
      localStorage.setItem(newKey, localStorage[prevKey]);
    }

    localStorage.removeItem(prevKey);
  }
};

/**
 * Get the current dark mode class name
 */
export const getDarkModeKey = (): string => {
  return darkModeClassName;
};

/**
 * Check if dark mode is currently active
 */
export const isDarkMode = () =>
  classList && classList.contains(darkModeClassName);

/**
 * Toggle dark mode class on document element
 */
export const toggleDarkMode = (condition?: boolean) => {
  if (classList) {
    classList.toggle(darkModeClassName, condition);
  }
};
