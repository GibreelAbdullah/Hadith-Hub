[![ReadMeSupportPalestine](https://cdn.jsdelivr.net/gh/Safouene1/support-palestine-banner@master/banner-support.svg)](https://techforpalestine.org/)

![FROM THE RIVER TO THE SEA, PALESTINE WILL BE FREE](https://img.shields.io/badge/%F0%9F%87%B5%F0%9F%87%B8_FROM_THE_RIVER_TO_THE_SEA,_PALESTINE_WILL_BE_FREE-techforpalestine.org-000?labelColor=grey&color=D83838&link=https%3A%2F%2Ftechforpalestine.org%2Flearn-more)

# HADITH HUB (حديث حب)

With the name of Allah, the All-Merciful, the Very-Merciful.

All praise and thanks are due to Allah, the Master and King of existence, the All-Merciful, Beneficent, who has power over all things. May peace and blessings be upon His final Messenger, Sayyidina Muhammad ﷺ, and his Family, and his Companions.

## About

HadithHub.com started in October 2022. It aims to make it easy for anyone to read, study, and learn the ahadith of Sayyidina Rasulullah ﷺ. This project is open source.

This repo is the frontend of [hadithhub.com](https://hadithhub.com), the data is in the [hadith-db](https://github.com/GibreelAbdullah/hadith-db) repo. We will be grateful if you contribute in this project to make it better.

It would be a grave injustice to omit the mention of [Fawaz Ahmed](https://github.com/fawazahmed0) who made the enormous effort in collecting Ahadith in multiple languages and their gradings by multiple scholars. This project wouldn't be possible without his efforts. May Allah ﷻ reward him immensely.

## Credits

[Fawaz Ahmed](https://github.com/fawazahmed0) : For collecting all the [Ahadith data](https://github.com/fawazahmed0/hadith-api). A complete list of sources of the data can be found [here](https://github.com/fawazahmed0/hadith-api/blob/1/References.md).

[Contributors - UI](https://github.com/GibreelAbdullah/Hadith-Hub/graphs/contributors) : Contributors who helped in creating the website.

[Contributors - Data](https://github.com/GibreelAbdullah/hadith-db/graphs/contributors) : Contributors who helped in collecting hadith/gradings or correcting them.

[Svelte](https://svelte.dev/) : A front-end, open-source JavaScript framework for making interactive webpages.

[Skeleton](https://www.skeleton.dev/) : A fully featured UI Toolkit for Svelte.

[html-to-image](https://github.com/bubkoo/html-to-image/) : A javascript library to convert HTML to image, allowing us to download screenshots of Ahadith.

## Prerequisites

`npm` should be installed in the system.

## Local Development

The frontend has **no backend**. All hadith data lives in the separate
[hadith-db](https://github.com/GibreelAbdullah/hadith-db) repository. In local
development the app reads that data through a symlink at `static/db`, so
GitHub Actions is **not** involved when running locally.

1. Clone both repos side by side:

   ```
   Projects/
   ├── Hadith-Hub/   (this repo)
   └── hadith-db/    (data repo)
   ```

2. Create the data symlink (from the frontend repo root). `static/db` is
   git-ignored, so it must be created once per clone:

   ```bash
   ln -s ../hadith-db/data static/db
   ```

   Verify it resolves (should list `ar.txt`, `metadata.json`, `gradings.json`):

   ```bash
   ls static/db/books/bukhari/
   ```

   Whatever branch `hadith-db` is checked out to is what the symlink serves,
   so you can test unreleased data (e.g. a `dev` branch) without pushing.

3. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

   Vite's dev server supports HTTP `Range` requests, which the app relies on to
   fetch individual hadiths from large text files, so byte-range reads work
   out of the box.

### Testing DB (hadith-db) changes locally

Because `static/db` is a live symlink to your local `hadith-db` checkout, any
change there (including re-running `convert.py` to regenerate `metadata.json`)
is reflected immediately — no rebuild needed. To test data changes:

1. Make/verify the changes in `../hadith-db` (and run `python3 convert.py`
   there if you edited any `.txt` files).
2. With the frontend dev server running, browse the affected collection, e.g.
   `/{collection}` for the book list and `/{collection}/{bookNumber}` for
   hadiths (this exercises the byte-range fetch against the new offsets).

Notes:

- **Full-text search** uses pre-built Pagefind indices in `static/pagefind/`.
  New/changed collections will not appear in search results until the index is
  rebuilt with `npm run build:search`. Browsing and reading work immediately.
- To mimic the production split (metadata same-origin, text cross-origin), you
  can instead serve the data dir over HTTP and point env vars at it:

  ```bash
  npx serve ../hadith-db/data -l 8081 --cors        # supports Range requests
  VITE_DB_BASE_URL=http://localhost:8081 npm run dev
  ```

### Common commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run preview      # preview production build
npm run check        # type-check
npm run lint         # lint + format check
npm run test         # Playwright e2e tests
npm run test:unit    # Vitest unit tests
npm run build:search # rebuild the Pagefind search index locally
```

## Contribution Guide

See the [Contribution Guide](https://github.com/GibreelAbdullah/Hadith-Hub/blob/prod/CONTRIBUTING.md)
