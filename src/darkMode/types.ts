/**
 * Dark mode types and enums
 */

export enum DarkModeSettings {
  ON = 'on',
  OFF = 'off',
  SYSTEM = 'system'
}

export enum DarkModeNamingStrategy {
  CLOUDFLARE = 'cloudflare',
  ASTRO = 'astro'
}

export type AstroDarkModeSettings = 'dark' | 'light' | 'auto';

export interface DarkModeChangeEventDetail {
  setting: DarkModeSettings;
  isDark: boolean;
  timestamp: number;
  namingStrategy: DarkModeNamingStrategy;
  value: string;
}

export interface DarkModeChangeEvent extends CustomEvent<DarkModeChangeEventDetail> {
  type: string;
}

export interface DarkModeCookieData {
  value: string;
  timestamp: number;
}
