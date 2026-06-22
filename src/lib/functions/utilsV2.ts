import { getCollections, getMetadata, fetchLines, type Metadata } from "$lib/data/db";
import { languageStore } from "$lib/functions/store.svelte";
import { browser } from "$app/environment";

// Languages
export async function getLanguages(): Promise<any[]> {
  const data = await getCollections();
  return data.languages.map((l) => [l.short_name, l.full_name, l.rtl]);
}

let _languagePromise: Promise<any[]> | null = null;
export const languagePromise: Promise<any[]> = browser
  ? ((_languagePromise = getLanguages()), _languagePromise)
  : Promise.resolve([]);

// Collections: returns [[short_name, available_langs, name_lang1, name_lang2, ...], ...]
export function getCollectionPromise() {
  return getCollectionsList();
}

async function getCollectionsList(): Promise<any[]> {
  const data = await getCollections();
  const langs = languageStore.value.length ? languageStore.value : ["ar", "en"];
  return data.collections.map((coll: any) => {
    const availableLangs = coll.languages || ["ar", "en"];
    const langValues = langs.map((l: string) => coll[l] || "");
    return [coll.short_name, availableLangs, ...langValues, ...langValues, coll.short_name];
  });
}

// Books page: returns rows for BookContainer
export async function getBooks(collection: string): Promise<any[]> {
  const meta = await getMetadata(collection);
  if (!meta) return [];
  const langs = languageStore.value.length ? languageStore.value : ["ar", "en"];

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
  const selectedLanguages = languageStore.value.length ? languageStore.value : ["ar", "en"];
  const meta = await getMetadata(collection);
  if (!meta) return [selectedLanguages, [], []];
  const availableLanguages = selectedLanguages.filter((l) => meta.languages.includes(l));
  const unavailableLanguages = selectedLanguages.filter((l) => !meta.languages.includes(l));
  const data = await getHadithInBook(collection, bookNumber, availableLanguages, meta);
  return [availableLanguages, unavailableLanguages, data];
}

async function getHadithInBook(collection: string, bookNumber: string, langs: string[], meta: Metadata): Promise<any[]> {
  // Get all records for this book + the collection record
  const records = meta.records.filter(
    (r) => r.cat === "collection" || r.book === bookNumber
  );
  if (!records.length) return [];

  // Fetch text for contiguous book records (excluding the collection record which is at line 0)
  const bookOnlyRecords = records.filter((r) => r.cat !== "collection");
  const collectionRecord = records.find((r) => r.cat === "collection");

  const textByLang: { [lang: string]: { collection: string; book: string[] } } = {};
  await Promise.all(
    langs.map(async (lang) => {
      if (!meta.offsets[lang]) return;
      // Fetch collection line
      const collText = collectionRecord ? (await fetchLines(collection, lang, collectionRecord.line, collectionRecord.line, meta))[0] || "" : "";
      // Fetch contiguous book block
      let bookTexts: string[] = [];
      if (bookOnlyRecords.length) {
        const firstLine = bookOnlyRecords[0].line;
        const lastLine = bookOnlyRecords[bookOnlyRecords.length - 1].line;
        bookTexts = await fetchLines(collection, lang, firstLine, lastLine, meta);
      }
      textByLang[lang] = { collection: collText, book: bookTexts };
    })
  );

  return records.map((rec) => {
    let langValues: string[];
    if (rec.cat === "collection") {
      langValues = langs.map((l) => textByLang[l]?.collection || "");
    } else {
      const idx = rec.line - bookOnlyRecords[0].line;
      langValues = langs.map((l) => textByLang[l]?.book[idx] || "");
    }
    return [collection, rec.num || null, rec.book || null, rec.num_book || null, rec.chapter || null, rec.cat, null, ...langValues];
  });
}

// Single hadith: returns dataRows for HadithContainer
export async function getSingleHadith(collection: string, hadithNumber: string, langs: string[]): Promise<any[]> {
  const meta = await getMetadata(collection);
  if (!meta) return [];

  // Find the hadith record
  const hadithRec = meta.records.find((r) => r.cat === "hadith" && r.num === hadithNumber);
  if (!hadithRec) return [];

  // Get context: collection + book + chapter + the hadith itself
  const records = meta.records.filter(
    (r) =>
      r.cat === "collection" ||
      (r.cat === "book" && r.book === hadithRec.book) ||
      (r.cat === "book_intro" && r.book === hadithRec.book) ||
      (r.cat === "chapter" && r.book === hadithRec.book && r.chapter === hadithRec.chapter) ||
      (r.cat === "chapter_intro" && r.book === hadithRec.book && r.chapter === hadithRec.chapter) ||
      (r.cat === "hadith" && r.num === hadithNumber)
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

  return records.map((rec, idx) => {
    const langValues = langs.map((l) => textByLang[l]?.[idx] || "");
    return [collection, rec.num || null, rec.book || null, rec.num_book || null, rec.chapter || null, rec.cat, null, ...langValues];
  });
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

export async function isRtl(languageShortName: string) {
  const languageObject = await languagePromise;
  const lang = languageObject.find((item: any[]) => item[0] === languageShortName);
  return lang ? lang[2] : false;
}

export const getHadithData = async (collection: string, book: string, languageStoreValue: string[]) => {
  const meta = await getMetadata(collection);
  if (!meta) return [[], languageStoreValue, []];
  const availableLanguages = languageStoreValue.filter((l) => meta.languages.includes(l));
  const unavailableLanguages = languageStoreValue.filter((l) => !meta.languages.includes(l));
  const data = await getHadithInBook(collection, book, availableLanguages, meta);
  return [availableLanguages, unavailableLanguages, data];
};

// Scholar stub (not in text files)
export async function getScholar(_lang: string, _name: string): Promise<any[]> {
  return [];
}

// Search stub (will be a dedicated service)
export async function searchHadith(_text: string, _language: string | null, _collection: string | null): Promise<any[]> {
  return [];
}

// getData compatibility shim (for any remaining callers)
export async function getData(_url: string): Promise<any[]> {
  return [];
}
