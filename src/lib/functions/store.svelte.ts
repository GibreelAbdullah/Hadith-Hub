import { browser } from '$app/environment';

export function localStore<T>(key: string, defaultValue: T) {
  let value = $state<T>(defaultValue);
  
  // Initialize from localStorage
  if (browser) {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        value = JSON.parse(stored);
      } catch (error) {
        console.warn(`Failed to parse localStorage item "${key}":`, error);
      }
    }
  }

  // Auto-save to localStorage
  $effect.root(() => {
    $effect(() => {
      if (browser) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.warn(`Failed to save to localStorage "${key}":`, error);
        }
      }
    });
    return () => {};
  });

  return {
    get value() {
      return value;
    },
    set value(newValue: T) {
      value = newValue;
    },
    update(updater: (value: T) => T) {
      value = updater(value);
    },
    reset() {
      value = defaultValue;
    },
    clear() {
      if (browser) {
        localStorage.removeItem(key);
      }
      value = defaultValue;
    }
  };
}

// Usage
export const languageStore = localStore("selectedLanguages", ["en", "ar"]);