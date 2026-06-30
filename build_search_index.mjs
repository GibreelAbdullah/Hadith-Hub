import * as pagefind from "pagefind";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "static", "db");
const OUTPUT_DIR = process.env.PAGEFIND_DEV
  ? join(__dirname, "static", "pagefind")
  : join(__dirname, "build", "pagefind");

async function main() {
  const collectionsData = JSON.parse(readFileSync(join(DATA_DIR, "collections.json"), "utf-8"));
  const basePath = process.env.BASE_PATH || "";

  const { index } = await pagefind.createIndex({ forceLanguage: "en" });

  let totalIndexed = 0;

  for (const coll of collectionsData.collections) {
    const metaPath = join(DATA_DIR, coll.short_name, "metadata.json");
    let meta;
    try {
      meta = JSON.parse(readFileSync(metaPath, "utf-8"));
    } catch {
      continue;
    }

    const textByLang = {};
    for (const lang of meta.languages) {
      try {
        textByLang[lang] = readFileSync(join(DATA_DIR, coll.short_name, `${lang}.txt`), "utf-8").split("\n");
      } catch {}
    }

    for (const rec of meta.records) {
      if (rec.cat !== "hadith") continue;

      const contentParts = [];
      for (const lang of meta.languages) {
        const lines = textByLang[lang];
        if (!lines) continue;
        const line = lines[rec.line] || "";
        const secondPipe = line.indexOf("|", line.indexOf("|") + 1);
        const text = secondPipe !== -1 ? line.slice(secondPipe + 1) : line;
        const clean = text.replace(/<[^>]*>/g, "").replace(/\\n/g, " ");
        if (clean) contentParts.push(clean);
      }

      if (contentParts.length === 0) continue;

      const collName = coll.en || coll.ar || coll.short_name;
      const book = meta.books.find(b => b.number === rec.book);
      const bookName = book ? (book.en || book.ar || `Book ${rec.book}`) : "";

      // Boost collection name and hadith number by repeating them
      const boostText = `${collName} ${rec.num} `.repeat(10);

      await index.addCustomRecord({
        url: `${basePath}/${coll.short_name}:${rec.num}`,
        content: boostText + contentParts.join(" "),
        language: "en",
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

      totalIndexed++;
    }

    console.log(`  ${coll.short_name}: ${meta.records.filter(r => r.cat === "hadith").length} hadiths`);
  }

  console.log(`\nTotal: ${totalIndexed} hadiths indexed`);

  await index.writeFiles({ outputPath: OUTPUT_DIR });
  console.log(`Index written to ${OUTPUT_DIR}`);

  await pagefind.close();
}

main().catch(console.error);
