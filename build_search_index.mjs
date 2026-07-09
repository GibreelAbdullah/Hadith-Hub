import * as pagefind from "pagefind";
import { readFileSync, rmSync, mkdirSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.PAGEFIND_DATA_DIR || join(__dirname, "static", "db");
const OUTPUT_BASE = process.env.PAGEFIND_OUTPUT_DIR
  || (process.env.PAGEFIND_DEV
    ? join(__dirname, "static", "pagefind")
    : join(__dirname, "build", "pagefind"));

async function buildLanguageIndex(lang, collectionsData) {
  const { index } = await pagefind.createIndex({ forceLanguage: lang });
  const basePath = process.env.BASE_PATH || "";

  let totalIndexed = 0;

  for (const coll of collectionsData.collections) {
    const metaPath = join(DATA_DIR, "books", coll.short_name, "metadata.json");
    let meta;
    try {
      meta = JSON.parse(readFileSync(metaPath, "utf-8"));
    } catch { continue; }

    // Skip if this language doesn't exist for this collection
    if (!meta.offsets[lang]) continue;

    let lines;
    try {
      lines = readFileSync(join(DATA_DIR, "books", coll.short_name, `${lang}.txt`), "utf-8").split("\n");
    } catch { continue; }

    let count = 0;
    for (const rec of meta.records) {
      if (rec.cat !== "hadith") continue;

      const line = lines[rec.line] || "";
      const secondPipe = line.indexOf("|", line.indexOf("|") + 1);
      const text = secondPipe !== -1 ? line.slice(secondPipe + 1) : line;
      const clean = text.replace(/<[^>]*>/g, "").replace(/\\n/g, " ");
      if (!clean) continue;

      // Also index a normalized version (without apostrophes/diacritics) for fuzzy matching
      const normalized = clean.replace(/[''`ʿʾ]/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const collName = coll.en || coll.ar || coll.short_name;
      const book = meta.books.find(b => b.number === rec.book);
      const bookName = book ? (book.en || book.ar || `Book ${rec.book}`) : "";

      // Boost collection name and hadith number
      const boostText = `${collName} ${rec.num} `.repeat(5);

      await index.addCustomRecord({
        url: `${basePath}/${coll.short_name}:${rec.num}`,
        content: boostText + clean + " " + normalized,
        language: lang,
        meta: {
          title: `${collName} : ${rec.num}`,
          collection: collName,
          book: bookName,
          hadith_num: rec.num || "",
          collection_short: coll.short_name,
        },
        filters: {
          collection: [coll.short_name],
        },
      });

      count++;
      totalIndexed++;
    }

    if (count > 0) console.log(`    ${coll.short_name}: ${count} hadiths`);
  }

  if (totalIndexed === 0) {
    await index.deleteIndex();
    return 0;
  }

  const outputDir = join(OUTPUT_BASE, lang);
  await index.writeFiles({ outputPath: outputDir });

  return totalIndexed;
}

async function main() {
  const collectionsData = JSON.parse(readFileSync(join(DATA_DIR, "collections.json"), "utf-8"));
  const languages = process.env.PAGEFIND_LANGS
    ? process.env.PAGEFIND_LANGS.split(",")
    : collectionsData.languages.map(l => l.short_name);

  mkdirSync(OUTPUT_BASE, { recursive: true });

  // Load previous build hashes for change detection
  const hashFile = join(OUTPUT_BASE, ".build_hashes.json");
  let prevHashes = {};
  try { prevHashes = JSON.parse(readFileSync(hashFile, "utf-8")); } catch {}

  console.log(`Building search indexes for ${languages.length} languages...\n`);

  const newHashes = {};
  let grandTotal = 0;
  for (const lang of languages) {
    // Compute hash of all txt files for this language
    const { createHash } = await import("crypto");
    const hash = createHash("md5");
    for (const coll of collectionsData.collections) {
      const txtPath = join(DATA_DIR, coll.short_name, `${lang}.txt`);
      try { hash.update(readFileSync(txtPath)); } catch {}
    }
    const currentHash = hash.digest("hex");
    newHashes[lang] = currentHash;

    // Skip if unchanged and index already exists
    const indexExists = existsSync(join(OUTPUT_BASE, lang, "pagefind-entry.json"));
    if (currentHash === prevHashes[lang] && indexExists) {
      console.log(`  [${lang}] Unchanged, skipping\n`);
      continue;
    }

    console.log(`  [${lang}]`);
    const count = await buildLanguageIndex(lang, collectionsData);
    if (count > 0) {
      console.log(`  [${lang}] Total: ${count} hadiths indexed\n`);
      grandTotal += count;
    } else {
      console.log(`  [${lang}] Skipped (no content)\n`);
    }
  }

  console.log(`\nGrand total: ${grandTotal} hadiths across ${languages.length} languages`);
  console.log(`Index written to ${OUTPUT_BASE}`);

  // Save hashes for next run
  writeFileSync(hashFile, JSON.stringify(newHashes, null, 2));

  await pagefind.close();
}

main().catch(console.error);
