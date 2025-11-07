/**
 * Tests for DarkModeSyncManager
 * 
 * This test suite covers the core synchronization functionality of the dark mode system.
 * Tests will be added incrementally to validate:
 * - Initialization and cleanup
 * - Setting and retrieving dark mode preferences
 * - Cross-tab synchronization
 * - Cross-subdomain synchronization (cookie polling)
 * - Iframe communication (postMessage)
 * - Event listeners and change notifications
 * - Naming strategy translation
 * - Timestamp management
 */

import {
  initDarkMode,
  getDarkModeSetting,
  resetDarkMode,
  setDarkMode,
  getDarkModeTimestamp,
  addDarkModeChangeListener,
  removeDarkModeChangeListener,
  setDarkModeNamingStrategy,
  getDarkModeNamingStrategy,
  translateDarkModeSetting,
  isDarkModeNewerThan,
  DarkModeSettings,
  DarkModeNamingStrategy
} from './darkMode';

describe('DarkModeSyncManager', () => {
  beforeEach(() => {
    // Reset state before each test
    resetDarkMode();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup after each test
    resetDarkMode();
  });

  describe('Initialization', () => {
    it('should initialize without errors', () => {
      expect(() => {
        initDarkMode();
      }).not.toThrow();
    });

    it('should return a cleanup function', () => {
      const cleanup = initDarkMode();
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('should accept naming strategy option', () => {
      const cleanup = initDarkMode({
        namingStrategy: DarkModeNamingStrategy.ASTRO
      });
      expect(typeof cleanup).toBe('function');
      cleanup();
    });
  });

  describe('Setting and Getting', () => {
    it('should get the current dark mode setting', () => {
      const setting = getDarkModeSetting();
      expect([
        DarkModeSettings.OFF,
        DarkModeSettings.ON,
        DarkModeSettings.SYSTEM
      ]).toContain(setting);
    });

    it('should set dark mode to ON', () => {
      setDarkMode(DarkModeSettings.ON);
      expect(getDarkModeSetting()).toBe(DarkModeSettings.ON);
    });

    it('should set dark mode to OFF', () => {
      setDarkMode(DarkModeSettings.OFF);
      expect(getDarkModeSetting()).toBe(DarkModeSettings.OFF);
    });

    it('should set dark mode to SYSTEM', () => {
      setDarkMode(DarkModeSettings.SYSTEM);
      expect(getDarkModeSetting()).toBe(DarkModeSettings.SYSTEM);
    });
  });

  describe('Timestamp Management', () => {
    it('should get the current timestamp', () => {
      const timestamp = getDarkModeTimestamp();
      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThanOrEqual(0);
    });

    it('should update timestamp when setting changes', () => {
      const initialTimestamp = getDarkModeTimestamp();
      
      // Wait a bit to ensure timestamp difference
      jest.useFakeTimers();
      jest.advanceTimersByTime(100);
      
      setDarkMode(DarkModeSettings.ON);
      const newTimestamp = getDarkModeTimestamp();
      
      expect(newTimestamp).toBeGreaterThan(initialTimestamp);
      
      jest.useRealTimers();
    });

    it('should check if dark mode is newer than a given timestamp', () => {
      const oldTimestamp = Date.now() - 10000;
      setDarkMode(DarkModeSettings.ON);
      
      expect(isDarkModeNewerThan(oldTimestamp)).toBe(true);
    });
  });

  describe('Event Listeners', () => {
    it('should add and remove event listeners', () => {
      const listener = jest.fn();
      
      addDarkModeChangeListener(listener);
      expect(listener).not.toHaveBeenCalled();
      
      removeDarkModeChangeListener(listener);
    });

    it('should support listener registration', () => {
      const listener = jest.fn();
      const cleanup = addDarkModeChangeListener(listener);
      
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('should handle multiple listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      addDarkModeChangeListener(listener1);
      addDarkModeChangeListener(listener2);
      
      removeDarkModeChangeListener(listener1);
      removeDarkModeChangeListener(listener2);
    });
  });

  describe('Naming Strategy', () => {
    it('should get the current naming strategy', () => {
      const strategy = getDarkModeNamingStrategy();
      expect([
        DarkModeNamingStrategy.CLOUDFLARE,
        DarkModeNamingStrategy.ASTRO
      ]).toContain(strategy);
    });

    it('should set the naming strategy', () => {
      setDarkModeNamingStrategy(DarkModeNamingStrategy.ASTRO);
      expect(getDarkModeNamingStrategy()).toBe(DarkModeNamingStrategy.ASTRO);
    });

    it('should translate between naming strategies', () => {
      const cloudflareValue = 'on';
      const astroValue = translateDarkModeSetting(
        cloudflareValue,
        DarkModeNamingStrategy.CLOUDFLARE,
        DarkModeNamingStrategy.ASTRO
      );
      
      expect(astroValue).toBe('dark');
    });

    it('should translate system to auto', () => {
      const astroValue = translateDarkModeSetting(
        'system',
        DarkModeNamingStrategy.CLOUDFLARE,
        DarkModeNamingStrategy.ASTRO
      );
      
      expect(astroValue).toBe('auto');
    });
  });

  describe('Reset', () => {
    it('should support reset without throwing', () => {
      expect(() => {
        resetDarkMode();
      }).not.toThrow();
    });

    it('should handle reset after setting changes', () => {
      setDarkMode(DarkModeSettings.ON);
      
      expect(() => {
        resetDarkMode();
      }).not.toThrow();
    });
  });
});
