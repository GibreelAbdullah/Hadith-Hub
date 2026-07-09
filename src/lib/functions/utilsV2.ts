import { getCollections, getMetadata, getGradings, fetchLines, type Metadata } from "$lib/data/db";
import { browser } from "$app/environment";
import { getSelectedLanguages } from "$lib/functions/language";

// Languages
export async function getLanguages(): Promise<any[]> {
  const data = await getCollections();
  return data.languages.map((l) => [l.short_name, l.full_name, l.rtl]);
}

let _languagePromise: Promise<any[]> | null = null;
export const languagePromise: Promise<any[]> = browser
  ? ((_languagePromise = getLanguages()), _languagePromise)
  : Promise.resolve([]);

// Collections: returns {collections: [...], categories: [...]}
export function getCollectionPromise() {
  return getCollectionsList();
}

async function getCollectionsList() {
  const data = await getCollections();
  // Return raw collection data - template handles language display
  return { collections: data.collections, categories: data.categories || [] };
}

// Books page: returns rows for BookContainer
export async function getBooks(collection: string, _langs?: string[]): Promise<any[]> {
  const meta = await getMetadata(collection);
  if (!meta) return [];
  const langs = _langs?.length ? _langs : getSelectedLanguages();

  // Collection row first
  const results: any[] = [];
  const collLangValues = langs.map((l) => meta.collection_info[l] || "");
  results.push([null, meta.languages, null, "collection", ...collLangValues]);

  // Book rows from metadata (no text fetch needed)
  for (const book of meta.books) {
    const langValues = langs.map((l) => (book as any)[l] || "");
    const hadithRange = [book.hadith_start, book.hadith_end];
    results.push([book.number, hadithRange, null, "book", ...langValues]);
  }

  return results;
}

// Hadith in book: returns [availableLangs, unavailableLangs, dataRows]
export async function getHadithPromise(params: Record<string, string>) {
  const collection = params.collection;
  const bookNumber = params.bookNumber;
  const selectedLanguages = getSelectedLanguages();
  const meta = await getMetadata(collection);
  if (!meta) return [selectedLanguages, [], []];
  const availableLanguages = selectedLanguages.filter((l) => meta.languages.includes(l));
  const unavailableLanguages = selectedLanguages.filter((l) => !meta.languages.includes(l));
  const data = await getHadithInBook(collection, bookNumber, availableLanguages, meta);
  return [availableLanguages, unavailableLanguages, data];
}

async function getHadithInBook(collection: string, bookNumber: string, langs: string[], meta: Metadata): Promise<any[]> {
  // Get all records for this book (excluding collection — we'll use metadata for its name)
  const bookRecords = meta.records.filter((r) => r.book === bookNumber);
  if (!bookRecords.length) return [];

  const firstLine = bookRecords[0].line;
  const lastLine = bookRecords[bookRecords.length - 1].line;

  const textByLang: { [lang: string]: string[] } = {};
  await Promise.all(
    langs.map(async (lang) => {
      if (!meta.offsets[lang]) return;
      textByLang[lang] = await fetchLines(collection, lang, firstLine, lastLine, meta);
    })
  );

  // Build collection row from metadata
  const collLangValues = langs.map((l) => meta.collection_info[l] || "");
  const collRow = [collection, null, null, null, null, "collection", null, ...collLangValues];

  // Build book/chapter/hadith rows from fetched text
  const gradings = await getGradings(collection);
  const dataRows = bookRecords.map((rec, idx) => {
    const langValues = langs.map((l) => textByLang[l]?.[idx] || "");
    const grades = rec.cat === "hadith" && rec.num ? gradings[rec.num] || null : null;
    return [collection, rec.num || null, rec.book || null, rec.num_book || null, rec.chapter || null, rec.cat, grades, ...langValues];
  });

  return [collRow, ...dataRows];
}

// Single hadith: returns dataRows for HadithContainer
export async function getSingleHadith(collection: string, hadithNumber: string, langs: string[]): Promise<any[]> {
  const meta = await getMetadata(collection);
  if (!meta) return [];

  // Filter to only available languages
  langs = langs.filter((l) => meta.offsets[l]);

  // Find the hadith record
  const hadithRec = meta.records.find((r) => r.cat === "hadith" && r.num?.split(",").includes(hadithNumber));
  if (!hadithRec) return [];

  // Get context: book + the chapter immediately before this hadith + the hadith itself
  // Find the chapter/chapter_intro directly preceding this hadith
  const hadithLine = hadithRec.line;
  const precedingChapter = [...meta.records]
    .filter(r => (r.cat === "chapter" || r.cat === "chapter_intro") && r.line < hadithLine && r.book === hadithRec.book)
    .sort((a, b) => b.line - a.line)
    .slice(0, 2); // chapter + chapter_intro at most

  const records = meta.records.filter(
    (r) =>
      (r.cat === "book" && r.book === hadithRec.book) ||
      (r.cat === "book_intro" && r.book === hadithRec.book) ||
      precedingChapter.some(p => p.line === r.line) ||
      (r.cat === "hadith" && r.num?.split(",").includes(hadithNumber))
  );

  // Fetch text for each relevant line
  const lines = records.map((r) => r.line);
  const textByLang: { [lang: string]: string[] } = {};
  await Promise.all(
    langs.map(async (lang) => {
      if (!meta.offsets[lang]) return;
      const texts: string[] = [];
      for (const line of lines) {
        const t = await fetchLines(collection, lang, line, line, meta);
        texts.push(t[0] || "");
      }
      textByLang[lang] = texts;
    })
  );

  // Build collection row from metadata
  const collLangValues = langs.map((l) => meta.collection_info[l] || "");
  const collRow = [collection, null, null, null, null, "collection", null, ...collLangValues];

  const gradings = await getGradings(collection);
  const dataRows = records.map((rec, idx) => {
    const langValues = langs.map((l) => textByLang[l]?.[idx] || "");
    const grades = rec.cat === "hadith" && rec.num ? gradings[rec.num] || null : null;
    return [collection, rec.num || null, rec.book || null, rec.num_book || null, rec.chapter || null, rec.cat, grades, ...langValues];
  });

  return [collRow, ...dataRows];
}

// Helpers
export async function getLanguageFullName(languageShortName: string[]) {
  const languageObject = await languagePromise;
  return languageShortName
    .map((shortName) => {
      const lang = languageObject.find((item: any[]) => item[0] === shortName);
      return lang ? lang[1] : null;
    })
    .filter(Boolean);
}
