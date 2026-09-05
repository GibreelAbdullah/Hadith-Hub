# Hadith Hub - Technical Documentation for AI Agents

## Project Overview

Hadith Hub (hadithhub.com) is an open-source website for reading and studying Hadith (prophetic traditions) in multiple languages. It consists of two repositories:

- **Frontend**: [Hadith-Hub](https://github.com/GibreelAbdullah/Hadith-Hub) — The SvelteKit web application
- **Data**: [hadith-db](https://github.com/GibreelAbdullah/hadith-db) — All hadith data, metadata, and static content

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | SvelteKit | 2.x |
| Language | Svelte 5 (runes + legacy mode) | 5.x |
| UI Kit | Skeleton (skeleton-svelte) | 5.x |
| CSS | TailwindCSS | 4.x |
| Build | Vite | 5.x |
| Adapter | @sveltejs/adapter-static (SPA mode) | 3.x |
| Search | Pagefind (static search index) | 1.x |
| Testing | Playwright (e2e), Vitest (unit) | |
| Hosting | GitHub Pages | |
| CI/CD | GitHub Actions | |

## Architecture

### SPA Mode

The app is built as a **single-page application** (SPA):
- `ssr = false` and `prerender = false` in `+layout.ts`
- Uses `adapter-static` with `fallback: 'index.html'`
- GitHub Pages serves `404.html` (copy of index.html) for client-side routing

### Data Layer (No Backend)

There is no backend server. All data is static:
- Hadith text stored as `.txt` files (one line per hadith, pipe-delimited fields)
- Metadata stored as `.json` files (book structure, offsets for byte-range fetches)
- Content (about page, blog posts) stored as `.html` files
- Data is served via GitHub Pages from the `hadith-db` repository

**Key URLs:**
- Production data: `https://gibreelabdullah.github.io/hadith-db/data`
- Local development: `/db` (symlink from `static/db` → `../hadith-db/data`)

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_DB_BASE_URL` | URL for hadith text files (supports range requests) | `/db` |
| `VITE_META_BASE_URL` | URL for metadata/collections JSON | Same as DB URL |
| `BASE_PATH` | Base path prefix for deployment | `''` |

## Project Structure

```
Hadith-Hub/
├── src/
│   ├── app.css                    # Global styles (TailwindCSS)
│   ├── app.html                   # HTML template
│   ├── app.d.ts                   # Type declarations
│   ├── routes/
│   │   ├── +layout.svelte         # Root layout (header, sidebar, footer, drawers)
│   │   ├── +layout.ts             # SPA config (ssr=false, prerender=false)
│   │   ├── +page.svelte           # Home page (collection list)
│   │   ├── [collection]/          # Collection pages (books list)
│   │   │   ├── +page.svelte
│   │   │   └── [bookNumber]/      # Book pages (hadith list)
│   │   │       └── +page.svelte
│   │   ├── [collection]:[hadithNumber]/ # Direct hadith link
│   │   │   └── +page.svelte
│   │   ├── about/                 # About page
│   │   ├── references/            # References page
│   │   ├── blogs/                 # Blog listing
│   │   │   └── [slug]/            # Individual blog post
│   │   ├── notes/                 # Notes management page
│   │   └── search/                # Search page
│   └── lib/
│       ├── data/
│       │   ├── db.ts              # Data fetching layer (collections, metadata, range requests)
│       │   ├── icons.ts           # SVG icon data
│       │   └── gradeTranslations.ts
│       ├── functions/
│       │   ├── utilsV2.ts         # Main utility functions
│       │   ├── store.svelte.ts    # Language store (Svelte 5 runes)
│       │   ├── settingsStore.ts   # Settings/theme/font store
│       │   ├── notesStore.svelte.ts # Notes store (Svelte 5 runes, LZW compressed localStorage)
│       │   ├── drawerState.svelte.ts
│       │   ├── searchModalState.svelte.ts
│       │   └── language.ts        # Language utilities
│       ├── components/
│       │   ├── common/            # Shared components (Header, Footer, MetaTags, etc.)
│       │   ├── hadithCardComponents/ # Hadith display components
│       │   │   ├── HadithCard.svelte
│       │   │   ├── HadithNotes.svelte # Inline notes UI on hadith cards
│       │   │   ├── reference.svelte
│       │   │   ├── gradingSection.svelte
│       │   │   └── gradingPopup.svelte
│       │   ├── collectionContainer.svelte
│       │   ├── bookContainer.svelte
│       │   ├── hadithContainer.svelte
│       │   └── searchModal.svelte
│       └── searchModalComponents/
├── static/
│   ├── db -> ../hadith-db/data    # Symlink to data repo (local dev)
│   ├── pagefind/                  # Pre-built search indices
│   ├── favicon.png
│   └── robots.txt
├── tests/                         # Playwright e2e tests
├── build_search_index.mjs         # Script to build Pagefind search index
├── svelte.config.js
├── vite.config.ts
├── package.json
└── Dockerfile
```

## Data Repository Structure (hadith-db)

```
hadith-db/data/
├── collections.json               # List of all collections and languages
├── references.json                # Source references table
├── gradeTranslations.json         # Grading label translations
├── about.html                     # About page content
├── blogs/
│   ├── blogs.json                 # Blog manifest (slug, title, description, date, author)
│   └── *.html                     # Individual blog post HTML files
├── muhaddith/                     # Scholar/muhaddith biographical data
│   └── *.min.json
└── books/
    └── {collection}/
        ├── metadata.json          # Book structure, byte offsets, collection info
        ├── gradings.json          # Hadith authenticity gradings
        ├── ar.txt                 # Arabic text
        ├── en.txt                 # English text
        └── {lang}.txt             # Other language texts
```

### Text File Format

Each `.txt` file contains one hadith per line in the format:
```
category|number|hadith_text
```
- `category`: Section/category identifier
- `number`: Hadith number within the book
- `hadith_text`: The hadith text (newlines escaped as `\n`)

### Metadata JSON Format

Each collection's `metadata.json` contains:
```json
{
  "collection": "bukhari",
  "languages": ["ar", "en", "bn", "fr", "id", "ru", "ta", "tr", "ur"],
  "collection_info": { "en": "Sahih al-Bukhari", "ar": "صحيح البخاري" },
  "collection_intro": { "en": "...", "ar": "..." },
  "author": { "name": "محمد بن إسماعيل البخاري", "aka": "البخاري", "died": "256" },
  "books": [
    { "number": "1", "ar": "بدء الوحي", "en": "Revelation", "hadith_start": 0, "hadith_end": 6 }
  ],
  "records": [
    { "line": 0, "cat": "chapter_name", "book": "1", "chapter": "1", "num": "1", "num_book": 1 }
  ],
  "offsets": {
    "en": [0, 245, 1023, ...],
    "ar": [0, 312, 987, ...]
  }
}
```

The `offsets` object provides byte offsets for each line, enabling HTTP Range requests to fetch individual hadiths without downloading entire files.

The optional `author` object (`name` / `aka` / `died`, all Arabic where
applicable) holds the collection's compiler. It is **not** derived from the
text files; it is passed through from the collection's entry in
`collections.json` by `convert.py`. The frontend surfaces it in the collection
header (see `bookContainer.svelte`). Collections without author data simply
omit the field.


## Key Technical Patterns

### Data Fetching with Byte-Range Requests

The app uses HTTP `Range` headers to fetch specific hadiths from large text files without downloading the entire file. This is critical since some text files are 10MB+.

```typescript
// From db.ts - fetches specific bytes from a text file
fetch(url, { headers: { Range: `bytes=${startByte}-${endByte}` } })
```

### State Management

- **Language selection**: Stored in URL query params (`?lang=en,ar`) and synced to a Svelte 5 rune store
- **Theme**: Stored in localStorage via Skeleton's theme system
- **Settings**: Custom font families and sizes via settingsStore (localStorage)
- **Notes**: User notes stored in localStorage with LZW compression via notesStore (Svelte 5 runes)
- **UI state**: Drawer and search modal managed by `.svelte.ts` rune stores

### Routing

- `/` — Collection list (home)
- `/[collection]` — Books within a collection
- `/[collection]/[bookNumber]` — Hadiths within a book
- `/[collection]:[hadithNumber]` — Direct link to a specific hadith
- `/about` — About page (HTML from data repo)
- `/references` — References table (JSON from data repo)
- `/blogs` — Blog listing (JSON from data repo)
- `/blogs/[slug]` — Individual blog post (HTML from data repo)
- `/search` — Full-text search (Pagefind)
- `/notes` — Notes management page (export/import, view all notes)

### Search

Full-text search is powered by [Pagefind](https://pagefind.app/), a static search library. The search index is pre-built during CI using `build_search_index.mjs` and stored in `static/pagefind/`. Indices are built per-language.

### Notes

User notes are a client-side feature allowing users to annotate individual hadiths. No backend is required.

**Architecture:**
- Store: `src/lib/functions/notesStore.svelte.ts` (Svelte 5 runes with `$state`)
- localStorage key: `hadithHub_notes`
- Data is compressed using LZW (UTF-16) before storage to reduce space usage
- Notes are keyed by `collectionShortName` + `hadithNum`

**Components:**
- `src/lib/components/hadithCardComponents/reference.svelte` — Contains the Notes button (alongside Screenshot and Link buttons) with toggle state bound to parent
- `src/lib/components/hadithCardComponents/HadithNotes.svelte` — Expandable notes panel on each hadith card (add/edit/delete), toggled via `showPanel` bindable prop
- `src/lib/components/hadithCardComponents/HadithCard.svelte` — Wires `notesOpen` state between Reference and HadithNotes via two-way binding
- `src/routes/notes/+page.svelte` — Management page (view all, export, import, clear, filter, sort)

**Features:**
- Add/edit/delete notes on any hadith via the "Notes" button on hadith cards
- Notes button is in the same button row as Screenshot and Link, uses the same filled icon style (`SvgIcon name="note"`)
- Button shows a count badge and switches to warning color (`preset-filled-warning-500`) when notes exist
- `/notes` page displays all notes grouped by collection with links to source hadiths
- Filter by collection (dropdown with full display names)
- Sort by hadith number (default), newest first, or oldest first
- Collection names resolve to the user's selected language (reactive to language changes) via `getCollectionDisplayInfo()`
- Collection names use language-appropriate font styling (via `getFontStyleForText`)
- Export all notes as a JSON file (uncompressed, human-readable)
- Import a previously exported JSON file (merges with existing, deduplicates by note ID)
- Clear all notes (with confirmation dialog)
- Warning banner explaining localStorage limitations (data loss on cache clear, no cross-device sync)

**Note data structure:**
```typescript
interface Note {
  id: string;                  // crypto.randomUUID()
  collectionShortName: string; // e.g., "bukhari"
  hadithNum: string;           // hadith number in collection
  text: string;                // user's note text
  createdAt: string;           // ISO date string
  updatedAt: string;           // ISO date string
}
```

**Utility functions (in `utilsV2.ts`):**
- `getCollectionDisplayName(shortName)` — Returns the display name for a collection in the user's selected language (with fallback to en → ar → shortName)
- `getCollectionDisplayInfo(shortName)` — Returns `{ name, lang }` so callers can apply language-appropriate font styling

## Development

### Prerequisites

- Node.js (v22+)
- npm
- Symlink `static/db` → `../hadith-db/data` (for local data access)

### Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Type-check
npm run lint         # Lint + format check
npm run format       # Auto-format code
npm run test         # Run Playwright e2e tests
npm run test:unit    # Run Vitest unit tests
npm run build:search # Build Pagefind search index locally
```

## Deployment

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`):

1. Triggered on push to `prod` branch or when `hadith-db` dispatches an update event
2. Builds the SvelteKit app with production env vars
3. Clones `hadith-db` for metadata and search index building
4. Copies collection metadata to the build output (for same-origin fast loading)
5. Builds Pagefind search index (cached by content hash)
6. Deploys to GitHub Pages

### Data Updates

When data in `hadith-db` changes, it triggers a `repository_dispatch` event to rebuild and redeploy the frontend. The hadith text files are served directly from GitHub Pages of the `hadith-db` repo (cross-origin), while metadata is bundled with the frontend build (same-origin).

## Adding Arabic Collections from OpenITI

Additional Arabic-only collections can be ingested from the
[OpenITI corpus](https://github.com/OpenITI) (Open Islamicate Texts Initiative).
This is done in the **hadith-db** repo, not the frontend.

Discovery: OpenITI publishes a master metadata TSV
(`kitab_metadata_for_DLME_latest_release.tsv` in the
`OpenITI/kitab-metadata-automation` repo) listing every text with a `tags`
column and a direct `text_url`. Hadith works are marked with the `_HADITH`
tag. There is no need to crawl the per-century year-range repos individually.

Conversion: OpenITI texts are in **mARkdown** format (a `#META#` header block
followed by a body with structural markers). The helper script
`openiti_convert.py` in hadith-db converts a mARkdown file into the
`category|num|text` `ar.txt` format:

- `#META#` header → author fields (`AuthorNAME` / `AuthorAKA` / `AuthorDIED`)
- `# | N ( title )` → `book||title`
- `### | ( title )` / `### | title` → `chapter||title` (nested sections)
- `# N text` (+ `~~` continuations) → `hadith|N|text`
- strips page markers (`PageVxxPyyy`), manuscript sigla (`msNNN`), and
  mARkdown tags (`@QB@`, `@QE@`, etc.)

```bash
python3 openiti_convert.py <markdown_file> -n "<arabic collection name>" -o data/books/<short_name>/ar.txt
# optional: --autonumber  (for books that lack per-hadith numbers in the source)
```

Steps to add a book:

1. Run `openiti_convert.py` to produce `data/books/{short_name}/ar.txt`.
2. Add a `collections.json` entry with `short_name`, `ar`, `en`,
   `languages: ["ar"]`, and an `author` object (from the script's stderr output).
   Add the `short_name` to a category in `collections.json`.
3. Run `python3 convert.py` to regenerate `metadata.json` (+ empty
   `gradings.json`; OpenITI has no gradings).
4. Verify with the frontend via the `static/db` symlink (see the frontend
   README's "Testing DB changes locally").

Caveats:

- Only books whose source carries **per-hadith numbering** (`# N`) convert
  cleanly. Books that separate the number from the text, or lack numbering,
  need bespoke handling or `--autonumber` and should be reviewed individually.
- `convert.py` reads each language file once and pre-indexes records by book;
  this matters because some OpenITI collections have thousands of "books"
  (e.g. al-Mu'jam al-Kabir has ~5,000 sections) which previously made metadata
  generation extremely slow.

## Supported Languages

Arabic (ar), Bengali (bn), English (en), French (fr), Indonesian (id), Russian (ru), Tamil (ta), Turkish (tr), Urdu (ur)

## Collections

Bukhari, Muslim, Tirmidhi, Nasa'i, Abu Dawud, Ibn Majah, Malik's Muwatta, Musnad Ahmad, Musnad Darimi, Musnad Shafi'i, Riyad as-Salihin, Mishkat al-Masabih, Bulugh al-Maram, Ma'ani al-Athaar, Al-Adab Al-Mufrad, Shama'il Muhammadiyah, Hadith Qudsi, Nawawi's 40, Hisn al-Muslim, Abu Hanifa's Musnad, Dehlawi, Fada'il Ayaat wa Suwar
