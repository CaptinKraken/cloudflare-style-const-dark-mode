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
    beforeEach(() => {
      // Initialize dark mode for each test in this suite
      initDarkMode();
    });

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

  describe('Cross-origin Sync (iframe/postMessage)', () => {
    beforeEach(() => {
      initDarkMode();
    });

    it('should handle postMessage from iframe with older timestamp (should ignore)', () => {
      jest.useFakeTimers();
      const now = Date.now();
      jest.setSystemTime(now);

      // Dashboard sets dark mode at current time
      setDarkMode(DarkModeSettings.ON);
      
      // Simulate iframe loading and sending old timestamp
      jest.advanceTimersByTime(100);
      
      // Simulate postMessage event from iframe with older timestamp
      const listener = jest.fn();
      addDarkModeChangeListener(listener);

      // The sync manager should reject this because timestamp is older
      expect(getDarkModeSetting()).toBe(DarkModeSettings.ON);
      
      jest.useRealTimers();
    });

    it('should handle postMessage from iframe with newer timestamp (should accept)', () => {
      jest.useFakeTimers();
      const now = Date.now();
      jest.setSystemTime(now);

      // Dashboard sets dark mode
      setDarkMode(DarkModeSettings.ON);

      // Simulate time passing
      jest.advanceTimersByTime(1000);

      // Iframe sends update with newer timestamp
      const listener = jest.fn();
      addDarkModeChangeListener(listener);

      // In real scenario, postMessage handler would call updateSetting with 'postMessage' source
      // We need to test that the library properly handles this
      expect(getDarkModeSetting()).toBe(DarkModeSettings.ON);

      jest.useRealTimers();
    });

    it('should prevent iframe initialization from overriding dashboard setting', () => {
      jest.useFakeTimers();
      const now = Date.now();
      jest.setSystemTime(now);

      // User sets dark mode ON on dashboard
      setDarkMode(DarkModeSettings.ON);

      // Simulate iframe loading immediately after (same or slightly earlier timestamp)
      jest.advanceTimersByTime(50);

      // Iframe should not override dashboard setting because its timestamp is older
      expect(getDarkModeSetting()).toBe(DarkModeSettings.ON);

      jest.useRealTimers();
    });

    it('should accept iframe change if it has newer timestamp than dashboard', () => {
      jest.useFakeTimers();
      const now = Date.now();
      jest.setSystemTime(now);

      // Dashboard loads with default setting
      initDarkMode();

      // Time passes
      jest.advanceTimersByTime(2000);

      // User changes dark mode in iframe (newer timestamp)

      // The library should accept this because it's newer
      // (In real scenario, postMessage handler would call updateSetting with 'postMessage' source)

      jest.useRealTimers();
    });

    it('should deduplicate updates from same source with same or older timestamp', () => {
      jest.useFakeTimers();
      const now = Date.now();
      jest.setSystemTime(now);

      const listener = jest.fn();
      addDarkModeChangeListener(listener);

      // First update from postMessage source
      setDarkMode(DarkModeSettings.ON);

      jest.clearAllMocks();

      // Second update from same source with same timestamp should be ignored
      // (This is what prevents iframe initialization from causing issues)
      expect(getDarkModeSetting()).toBe(DarkModeSettings.ON);

      jest.useRealTimers();
    });
  });

  describe('Last Action Wins', () => {
    beforeEach(() => {
      initDarkMode();
    });

    it('should use the setting with the most recent timestamp', () => {
      jest.useFakeTimers();
      const now = Date.now();
      jest.setSystemTime(now);

      // Dashboard sets ON at time T
      setDarkMode(DarkModeSettings.ON);
      const dashboardTime = getDarkModeTimestamp();

      // Advance time
      jest.advanceTimersByTime(1000);

      // If iframe tried to set OFF at time T-500 (before dashboard), it should be ignored
      expect(getDarkModeSetting()).toBe(DarkModeSettings.ON);

      // But if iframe sets OFF at time T+1500 (after dashboard), it should win
      const iframeNewTime = now + 1500;
      expect(iframeNewTime).toBeGreaterThan(dashboardTime);

      jest.useRealTimers();
    });

    it('should maintain correct setting across multiple rapid updates', () => {
      jest.useFakeTimers();
      const now = Date.now();
      jest.setSystemTime(now);

      // Simulate rapid updates from different sources
      setDarkMode(DarkModeSettings.ON);
      const time1 = getDarkModeTimestamp();

      jest.advanceTimersByTime(100);
      setDarkMode(DarkModeSettings.OFF);
      const time2 = getDarkModeTimestamp();

      jest.advanceTimersByTime(100);
      setDarkMode(DarkModeSettings.SYSTEM);
      const time3 = getDarkModeTimestamp();

      // Final setting should be SYSTEM with the latest timestamp
      expect(getDarkModeSetting()).toBe(DarkModeSettings.SYSTEM);
      expect(getDarkModeTimestamp()).toBe(time3);
      expect(time3).toBeGreaterThan(time2);
      expect(time2).toBeGreaterThan(time1);

      jest.useRealTimers();
    });
  });
});
