# Hadith Hub (Frontend) - Technical Documentation for AI Agents

> **This file covers the frontend (SvelteKit web app) only.** The hadith data,
> its formats, ingestion scripts (`convert.py`, OpenITI/mARkdown), and the data
> deployment pipeline live in the **hadith-db** repo. See
> `../hadith-db/AGENTS.md` for the data-layer documentation.

## Project Overview

Hadith Hub (hadithhub.com) is an open-source website for reading and studying Hadith (prophetic traditions) in multiple languages. It consists of two repositories:

- **Frontend**: [Hadith-Hub](https://github.com/GibreelAbdullah/Hadith-Hub) — The SvelteKit web application (**this repo**)
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

There is no backend server. All data is static and lives in the **hadith-db**
repo (see `../hadith-db/AGENTS.md` for the full data format). From the
frontend's perspective:
- Hadith text is fetched from `.txt` files via HTTP `Range` requests
- Metadata (`metadata.json`) describes book structure and byte offsets
- Content (about page, blog posts) is fetched as `.html` files

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
│       │   ├── recentStore.svelte.ts # Recently Read store (Svelte 5 runes, LZW compressed localStorage)
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
│       │   ├── RecentlyRead.svelte    # Home-page "Recently Read" strip
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

## Consuming the Data (hadith-db)

The frontend reads hadith data produced by the **hadith-db** repo. Only the
consumption contract is documented here; for how the data is produced and its
authoring formats, see `../hadith-db/AGENTS.md`.

### Data Fetching with Byte-Range Requests

The app uses HTTP `Range` headers to fetch specific hadiths from large text files without downloading the entire file. This is critical since some text files are 10MB+.

```typescript
// From db.ts - fetches specific bytes from a text file
fetch(url, { headers: { Range: `bytes=${startByte}-${endByte}` } })
```

The byte offsets for each line come from the `offsets` object in each
collection's `metadata.json`.

### Metadata the frontend relies on

- `collections.json` — list of all collections and their languages
- `{collection}/metadata.json` — book structure, `records`, and per-line byte
  `offsets` used for range fetches
- `{collection}/gradings.json` — authenticity gradings (fetched cross-origin
  from the hadith-db GitHub Pages)
- `references.json`, `gradeTranslations.json`, `about.html`, `blogs/blogs.json`

The optional `author` object in `metadata.json` (`name` / `aka` / `died`, plus
an optional nested `compiler` of the same shape) is surfaced in the collection
header by `bookContainer.svelte`. The `Author` interface in
`src/lib/data/db.ts` has a recursive optional `compiler?: Author` field, and
the compiler is rendered on a second line with the Arabic label "جمعه:".

## Key Technical Patterns

### State Management

- **Language selection**: Stored in URL query params (`?lang=en,ar`) and synced to a Svelte 5 rune store
- **Theme**: Stored in localStorage via Skeleton's theme system
- **Settings**: Custom font families and sizes via settingsStore (localStorage)
- **Notes**: User notes stored in localStorage with LZW compression via notesStore (Svelte 5 runes)
- **Recently Read**: Last 5 books read (with resume position) stored in localStorage with LZW compression via recentStore (Svelte 5 runes)
- **UI state**: Drawer and search modal managed by `.svelte.ts` rune stores

### Routing

- `/` — Collection list (home). Shows a "Recently Read" strip above the collections when history exists
- `/[collection]` — Books within a collection
- `/[collection]/[bookNumber]` — Hadiths within a book (auto-loads all chunks silently)
- `/[collection]:[hadithNumber]` — Direct link to a specific hadith. Opens on that hadith with a "Load More" button that appends following hadiths in the book (downward only); shows "Reached end of the book" at the end. Also the resume target for Recently Read
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

### Recently Read

A client-side feature that tracks the last few books the user was reading and
lets them resume where they left off. No backend is required.

**Architecture:**
- Store: `src/lib/functions/recentStore.svelte.ts` (Svelte 5 runes with `$state`, same LZW/localStorage pattern as notesStore)
- localStorage key: `hadithHub_recent`
- Dedup key is **collection + book**: revisiting a book updates that entry's hadith position + timestamp and moves it to the front. The list is capped at the **last 5 books** (`MAX_ENTRIES`), so it is "last 5 books you were reading, each remembering where you left off" — not last 5 hadiths.
- `record({ collectionShortName, bookNumber, hadithNum, hadithNumberInBook })` upserts by collection+book; a no-op guard skips redundant writes when the same hadith is already at the front.
- Deliberately disposable: **no delete / clear-UI / export / import** (unlike Notes). Cleared with the browser cache.

**Recording (in `hadithContainer.svelte`):**
- A single `IntersectionObserver` per container tracks which hadith cards are on-screen (candidate set); final selection uses `getBoundingClientRect`.
- The recorded hadith is the one crossing a **"reading line"** near the top of the viewport (`READING_LINE = 0.33`) — the card whose top is at/above the line and whose bottom is still below it. This deliberately does **not** use "fully visible": a hadith taller than the viewport is never fully visible and would otherwise never be recorded (its shorter predecessor would win).
- A rAF-throttled `scroll` listener recomputes the reading-line owner, because a card taller than the viewport fires no intersection events while scrolling through its middle.
- Writes are debounced ~1000ms so the hadith the user settles on is recorded, not every card scrolled past.
- Hadith cards are wrapped in a `[data-hadith-card]` element carrying `data-hadith-num` / `data-hadith-num-book` for the observer to read.

**Resume:**
- Recent entries navigate to `/[collection]:[hadithNumber]?lang=...` (the direct-hadith route), which already renders a single hadith — so resume opens directly on it with no scroll-into-view/jitter.
- The user's **current** language is kept on resume (any stored language is ignored, by design).

**Components:**
- `src/lib/components/RecentlyRead.svelte` — Home-page strip of small buttons (collection display name + `:hadithNum`, e.g. `Sahih Al Bukhari:53`). Language-aware names + fonts via `getCollectionDisplayInfo()` / `getFontStyleForText`. **Hidden entirely when empty.**
- `src/lib/components/hadithContainer.svelte` — Hosts the IntersectionObserver recording, the book-crumb link fix, and the manual "Load More" button.

**Related change — hadith-route reading continuity:**
- The breadcrumb book crumb on the hadith route is now a real link to `/[collection]/[bookNumber]` (previously plain text that looked clickable).
- The hadith route uses `getSingleHadithChunked()` (in `utilsV2.ts`) and passes `manualLoadMore={true}` to `HadithContainer`, adding a **"Load More" button** that appends following hadiths within the same book (downward only — no upward load, avoiding scroll-compensation). At the end it shows **"Reached end of the book"**. The book route (`/[collection]/[bookNumber]`) still auto-loads all chunks silently (`manualLoadMore` defaults to `false`).

**Recent entry data structure:**
```typescript
interface RecentEntry {
  collectionShortName: string; // e.g., "bukhari"
  bookNumber: string;          // book number within the collection
  hadithNum: string;           // hadith number in collection (used for resume URL)
  hadithNumberInBook: string;  // hadith number within its book (informational)
  updatedAt: string;           // ISO date string
}
```

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
3. Clones `hadith-db`, then runs `convert.py` to **generate** `metadata.json`
   from the text sources (metadata is no longer committed in `hadith-db`)
4. Copies the freshly generated collection metadata to the build output (for same-origin fast loading)
5. Builds Pagefind search index (cached by content hash)
6. Deploys to GitHub Pages

### Data Updates

When data in `hadith-db` changes, it triggers a `repository_dispatch` event to rebuild and redeploy the frontend. The hadith text files are served directly from GitHub Pages of the `hadith-db` repo (cross-origin), while metadata is bundled with the frontend build (same-origin).

For details on how `metadata.json` is generated (it is a build artifact, not
version-controlled) and how `gradings.json` is handled, see
`../hadith-db/AGENTS.md`.

## Supported Languages

Arabic (ar), Bengali (bn), English (en), French (fr), Indonesian (id), Russian (ru), Tamil (ta), Turkish (tr), Urdu (ur)

## Collections

Bukhari, Muslim, Tirmidhi, Nasa'i, Abu Dawud, Ibn Majah, Malik's Muwatta, Musnad Ahmad, Musnad Darimi, Musnad Shafi'i, Riyad as-Salihin, Mishkat al-Masabih, Bulugh al-Maram, Ma'ani al-Athaar, Al-Adab Al-Mufrad, Shama'il Muhammadiyah, Hadith Qudsi, Nawawi's 40, Hisn al-Muslim, Abu Hanifa's Musnad, Dehlawi, Fada'il Ayaat wa Suwar
