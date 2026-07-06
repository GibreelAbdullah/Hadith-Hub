import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';

export interface FontSettings {
  family: string;
  size: number; // percentage, 100 = default
}

export interface AppSettings {
  fonts: Record<string, FontSettings>;
}

// Font options per script group
export const FONT_OPTIONS: Record<string, { label: string; fonts: string[] }> = {
  'ar': { label: 'Arabic / Urdu', fonts: ['Scheherazade New', 'Amiri', 'Noto Naskh Arabic', 'KFGQPC Uthman Taha Naskh'] },
  'ur': { label: 'Arabic / Urdu', fonts: ['Scheherazade New', 'Amiri', 'Noto Naskh Arabic', 'KFGQPC Uthman Taha Naskh'] },
  'bn': { label: 'Bengali', fonts: ['Noto Sans Bengali', 'Hind Siliguri', 'Noto Serif Bengali'] },
  'ta': { label: 'Tamil', fonts: ['Noto Sans Tamil', 'Noto Serif Tamil', 'Mukta Malar'] },
  'en': { label: 'English', fonts: ['Noto Sans', 'Inter', 'Roboto', 'System Default'] },
  'fr': { label: 'French', fonts: ['Noto Sans', 'Inter', 'Roboto', 'System Default'] },
  'tr': { label: 'Turkish', fonts: ['Noto Sans', 'Inter', 'Roboto', 'System Default'] },
  'id': { label: 'Indonesian', fonts: ['Noto Sans', 'Inter', 'Roboto', 'System Default'] },
  'ru': { label: 'Russian', fonts: ['Noto Sans', 'Inter', 'Roboto', 'System Default'] },
};

// Group languages by script
export const SCRIPT_GROUPS: Record<string, string[]> = {
  'arabic': ['ar', 'ur'],
  'latin': ['en', 'fr', 'tr', 'id', 'ru'],
  'bengali': ['bn'],
  'tamil': ['ta'],
};

export function getScriptGroup(lang: string): string {
  for (const [group, langs] of Object.entries(SCRIPT_GROUPS)) {
    if (langs.includes(lang)) return group;
  }
  return 'latin';
}

const DEFAULT_SETTINGS: AppSettings = {
  fonts: {
    arabic: { family: 'Scheherazade New', size: 120 },
    latin: { family: 'Noto Sans', size: 100 },
    bengali: { family: 'Noto Sans Bengali', size: 110 },
    tamil: { family: 'Noto Sans Tamil', size: 110 },
  }
};

const STORAGE_KEY = 'hadithHub_settings';

function loadSettings(): AppSettings {
  if (!browser) return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { fonts: { ...DEFAULT_SETTINGS.fonts, ...parsed.fonts } };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

// Svelte store for reactivity
export const settingsStore = writable<AppSettings>(loadSettings());

// Save to localStorage on every change
if (browser) {
  settingsStore.subscribe((val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  });
}

export function updateFontFamily(scriptGroup: string, family: string) {
  settingsStore.update(s => {
    s.fonts[scriptGroup] = { ...s.fonts[scriptGroup], family };
    return { ...s };
  });
  loadFont(family);
}

export function updateFontSize(scriptGroup: string, size: number) {
  settingsStore.update(s => {
    s.fonts[scriptGroup] = { ...s.fonts[scriptGroup], size };
    return { ...s };
  });
}

export function getFontForLang(lang: string): FontSettings {
  const s = get(settingsStore);
  const group = getScriptGroup(lang);
  return s.fonts[group] || DEFAULT_SETTINGS.fonts.latin;
}

// Get CSS style for a given language (reactive version - use with $settingsStore)
export function getFontStyle(lang: string, settings: AppSettings): string {
  const group = getScriptGroup(lang);
  const font = settings.fonts[group] || DEFAULT_SETTINGS.fonts.latin;
  const family = font.family === 'System Default' ? 'sans-serif' : `'${font.family}', sans-serif`;
  // Scale line-height proportionally: base 1.75 at 100%, increases with size
  const lineHeight = (1.75 * font.size / 100).toFixed(2);
  return `font-family: ${family}; font-size: ${font.size}%; line-height: ${lineHeight};`;
}

// Load Google Fonts dynamically
const loadedFonts = new Set<string>();

export function loadFont(family: string) {
  if (!browser || family === 'System Default' || loadedFonts.has(family)) return;
  loadedFonts.add(family);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&display=swap`;
  document.head.appendChild(link);
}

// Load all configured fonts on init
export function initFonts() {
  if (!browser) return;
  const s = get(settingsStore);
  for (const fontSetting of Object.values(s.fonts)) {
    loadFont(fontSetting.family);
  }
}
