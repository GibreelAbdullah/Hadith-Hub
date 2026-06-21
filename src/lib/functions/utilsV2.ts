import { getMasterDb, getBookDb } from "$lib/data/db";
import { languageStore } from "$lib/functions/store.svelte";
import { browser } from "$app/environment";

// Languages: returns [[short_name, full_name, rtl], ...]
export async function getLanguages(): Promise<any[]> {
  const db = await getMasterDb();
  if (!db) return [];
  const results = await db.db.exec("SELECT short_name, full_name, rtl FROM languages");
  if (!results.length) return [];
  return results[0].values.map((row: any[]) => [row[0], row[1], row[2] === 1 || row[2] === true]);
}

// Lazy languagePromise - only runs in browser
let _languagePromise: Promise<any[]> | null = null;
export function getLanguagePromise(): Promise<any[]> {
  if (!_languagePromise) {
    _languagePromise = getLanguages();
  }
  return _languagePromise;
}
// Keep export name for compatibility but make it a getter
export const languagePromise: Promise<any[]> = browser
  ? getLanguagePromise()
  : Promise.resolve([]);

// Collections: returns [[short_name, available_langs, name_lang1, name_lang2, ...info], ...]
export function getCollectionPromise() {
  return getCollections();
}

async function getCollections(): Promise<any[]> {
  const langs = languageStore.value.length ? languageStore.value : ["ar", "en"];
  const db = await getMasterDb();
  if (!db) return [];
  const results = await db.db.exec("SELECT short_name, ar, en FROM collection");
  if (!results.length) return [];
  // Each collection row: [short_name, type, info, ar, en]
  // We need: [short_name, available_langs_array, name_in_lang1, name_in_lang2, ..., info]
  // Available languages for each collection come from the book db's collection row
  // For now, since all books have ar+en, use that
  const availableLangs = ["ar", "en"];
  return results[0].values.map((row: any[]) => {
    const shortName = row[0];
    const langValues = langs.map((l) => (l === "ar" ? row[1] : row[2]));
    // Format: [short_name, available_langs, ...lang_values, ...lang_values(repeated for info popup)]
    return [shortName, availableLangs, ...langValues, ...langValues, shortName];
  });
}

// Books: returns rows where each is [book_number, [start,end], ?, category, name_lang1, name_lang2, ...]
export async function getData(queryOrCollection: string, bookNumber?: string): Promise<any[]> {
  // This is a compatibility shim - if called with a URL string (old pattern), parse it
  // New code should call getBooks/getHadithInBook directly
  return [];
}

export async function getBooks(collection: string): Promise<any[]> {
  const langs = languageStore.value.length ? languageStore.value : ["ar", "en"];
  const db = await getBookDb(collection);
  if (!db) return [];
  const results = await db.db.exec(
    `SELECT chronology, "langs$start_end_hadith", book_number, chapter_number, hadith_num, hadith_num_book, ar, en, category
     FROM hadith_data WHERE category IN ('collection', 'collection_intro', 'book') ORDER BY chronology`
  );
  if (!results.length) return [];
  return results[0].values.map((row: any[]) => {
    const langsField = row[1] ? JSON.parse(row[1] as string) : null;
    const bookNum = row[2];
    const category = row[8];
    const langValues = langs.map((l) => (l === "ar" ? row[6] : row[7]));
    // Format: [book_number, langs$start_end_hadith_parsed, hadith_num_book, category, ...lang_values]
    return [bookNum, langsField, row[5], category, ...langValues];
  });
}

export async function getHadithInBook(collection: string, bookNumber: string, langs: string[]): Promise<any[]> {
  const db = await getBookDb(collection);
  if (!db) return [];
  const results = await db.db.exec(
    `SELECT chronology, "langs$start_end_hadith", book_number, chapter_number, hadith_num, hadith_num_book, ar, en, category
     FROM hadith_data WHERE book_number = ? OR category = 'collection' ORDER BY chronology`,
    [bookNumber]
  );
  if (!results.length) return [];
  return results[0].values.map((row: any[]) => {
    // Format expected by HadithContainer:
    // [collection_shortname, hadith_number_1, book_number, hadith_number_2, chapter_number, category, grading, data_lang1, data_lang2, ...]
    const langValues = langs.map((l) => (l === "ar" ? row[6] : row[7]));
    return [collection, row[4], row[2], row[5], row[3], row[8], null, ...langValues];
  });
}

export async function getHadithPromise(params: Record<string, string>) {
  const selectedLanguages = languageStore.value.length ? languageStore.value : ["ar", "en"];
  const availableLangs = ["ar", "en"];
  const unavailableLanguages = selectedLanguages.filter((lang) => !availableLangs.includes(lang));
  const availableLanguages = selectedLanguages.filter((lang) => availableLangs.includes(lang));
  const data = await getHadithInBook(params.collection, params.bookNumber, availableLanguages);
  return [availableLanguages, unavailableLanguages, data];
}

export async function getLanguageFullName(languageShortName: string[]) {
  const languageObject = await languagePromise;
  return languageShortName
    .map((shortName) => {
      const lang = languageObject.find((item: any[]) => item[0] === shortName);
      return lang ? lang[1] : null;
    })
    .filter(Boolean);
}

export async function isRtl(languageShortName: string) {
  const languageObject = await languagePromise;
  const lang = languageObject.find((item: any[]) => item[0] === languageShortName);
  if (!lang) return false;
  return lang[2];
}

export async function getSingleHadith(collection: string, hadithNumber: string, langs: string[]): Promise<any[]> {
  const db = await getBookDb(collection);
  if (!db) return [];
  // Get the hadith and its context (collection, book, chapter)
  const hadithResult = await db.db.exec(
    `SELECT book_number, chapter_number FROM hadith_data WHERE category = 'hadith' AND hadith_num = ? LIMIT 1`,
    [hadithNumber]
  );
  if (!hadithResult.length || !hadithResult[0].values.length) return [];
  const bookNum = hadithResult[0].values[0][0];
  const chapterNum = hadithResult[0].values[0][1];

  const results = await db.db.exec(
    `SELECT chronology, "langs$start_end_hadith", book_number, chapter_number, hadith_num, hadith_num_book, ar, en, category
     FROM hadith_data
     WHERE category = 'collection'
        OR (category IN ('book', 'book_intro') AND book_number = ?)
        OR (category IN ('chapter', 'chapter_intro') AND book_number = ? AND chapter_number = ?)
        OR (category = 'hadith' AND hadith_num = ?)
     ORDER BY chronology`,
    [bookNum, bookNum, chapterNum, hadithNumber]
  );
  if (!results.length) return [];
  return results[0].values.map((row: any[]) => {
    const langValues = langs.map((l) => (l === "ar" ? row[6] : row[7]));
    return [collection, row[4], row[2], row[5], row[3], row[8], null, ...langValues];
  });
}

export const getHadithData = async (collection: string, book: string, languageStoreValue: string[]) => {
  const availableLangs = ["ar", "en"];
  const unavailableLanguages = languageStoreValue.filter((lang) => !availableLangs.includes(lang));
  const availableLanguages = languageStoreValue.filter((lang) => availableLangs.includes(lang));
  const data = await getHadithInBook(collection, book, availableLanguages);
  return [availableLanguages, unavailableLanguages, data];
};

export async function searchHadith(text: string, language: string | null, collection: string | null): Promise<any[]> {
  if (!text || !text.trim()) return [];
  const lang = language || "en";
  const langColumn = lang === "ar" ? "ar" : "en";

  // If a specific collection is given, search that book's db
  // Otherwise search across all collections (simplified: search all book dbs)
  if (collection) {
    return searchInCollection(collection, text, langColumn);
  }
  // Search across all collections - for now, search the most common ones
  const collections = ["bukhari", "muslim", "nasai", "abudawud", "tirmidhi", "ibn_majah"];
  const results: any[] = [];
  for (const coll of collections) {
    try {
      const collResults = await searchInCollection(coll, text, langColumn);
      results.push(...collResults);
      if (results.length >= 25) break;
    } catch { /* skip if db unavailable */ }
  }
  return results.slice(0, 25);
}

async function searchInCollection(collection: string, text: string, langColumn: string): Promise<any[]> {
  const db = await getBookDb(collection);
  // Use FTS5 MATCH
  const ftsResults = await db.db.exec(
    `SELECT rowid FROM hadith_fts WHERE ${langColumn} MATCH ? LIMIT 25`,
    [text]
  );
  if (!ftsResults.length || !ftsResults[0].values.length) return [];
  const rowids = ftsResults[0].values.map((r: any[]) => r[0]);
  const placeholders = rowids.map(() => "?").join(",");
  const results = await db.db.exec(
    `SELECT chronology, "langs$start_end_hadith", book_number, chapter_number, hadith_num, hadith_num_book, ar, en, category
     FROM hadith_data WHERE chronology IN (${placeholders})`,
    rowids
  );
  if (!results.length) return [];

  // Get collection name
  const collRow = await db.db.exec(
    `SELECT ar, en FROM hadith_data WHERE category = 'collection' LIMIT 1`
  );
  const collName = collRow.length ? collRow[0].values[0][1] : collection;

  return results[0].values.map((row: any[]) => {
    // Get book name for this hadith
    const bookNum = row[2];
    const hadithText = langColumn === "ar" ? row[6] : row[7];
    // Format: [collection_shortname, [hadith_num], book_number, hadith_num_book, ?, grading, text, collectionFullName, bookName]
    return [collection, [row[4]], bookNum, row[5], row[3], null, hadithText, collName, `Book ${bookNum}`];
  });
}

// Scholar data is not in the SQLite DB - return empty for now
export async function getScholar(_lang: string, _name: string): Promise<any[]> {
  return [];
}

