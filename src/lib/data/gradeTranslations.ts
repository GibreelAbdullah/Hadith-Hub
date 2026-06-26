import { browser } from "$app/environment";
import { DATA_BASE_URL } from "./db";

let translations: { grades: Record<string, Record<string, string>>; scholars: Record<string, Record<string, string>> } | null = null;
let loading: Promise<void> | null = null;

async function loadTranslations() {
  if (translations) return;
  if (!browser) return;
  try {
    const res = await fetch(`${DATA_BASE_URL}/gradeTranslations.json`);
    if (res.ok) translations = await res.json();
  } catch { /* fallback to English */ }
}

function ensureLoaded(): Promise<void> {
  if (translations) return Promise.resolve();
  if (!loading) loading = loadTranslations();
  return loading;
}

export async function translateGrade(grade: string, lang: string): Promise<string> {
  if (lang === "en") return grade;
  await ensureLoaded();
  if (!translations) return grade;
  // Try exact match
  if (translations.grades[grade]?.[lang]) return translations.grades[grade][lang];
  // Try replacing known terms (longest first)
  let translated = grade;
  const terms = Object.keys(translations.grades).sort((a, b) => b.length - a.length);
  for (const term of terms) {
    if (translations.grades[term][lang] && translated.includes(term)) {
      translated = translated.replace(term, translations.grades[term][lang]);
    }
  }
  return translated;
}

export async function translateScholar(name: string, lang: string): Promise<string> {
  if (lang === "en") return name;
  await ensureLoaded();
  if (!translations) return name;
  return translations.scholars[name]?.[lang] || name;
}

export async function getGradeColor(grade: string): Promise<string> {
  await ensureLoaded();
  if (!translations) return "gray";
  // Try exact match
  if (translations.grades[grade]?.color) return translations.grades[grade].color;
  // Try matching the first known term in the grade string
  const terms = Object.keys(translations.grades).sort((a, b) => b.length - a.length);
  for (const term of terms) {
    if (grade.includes(term) && translations.grades[term].color) {
      return translations.grades[term].color;
    }
  }
  return "gray";
}
