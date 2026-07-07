import { languageStore } from '$lib/functions/store.svelte';
import { detectScript } from '$lib/functions/settingsStore';

/** Languages that use right-to-left writing direction */
export const RTL_LANGS = ['ar', 'ur'] as const;

/** Get the selected languages, with fallback to ['ar', 'en'] */
export function getSelectedLanguages(): string[] {
  return languageStore.value.length ? languageStore.value : ['ar', 'en'];
}

/** Determine text direction based on actual text content */
export function getDirForText(text: string, expectedLang: string): 'rtl' | 'ltr' {
  if (!text) {
    return (RTL_LANGS as readonly string[]).includes(expectedLang) ? 'rtl' : 'ltr';
  }
  const script = detectScript(text);
  return script === 'arabic' ? 'rtl' : 'ltr';
}
