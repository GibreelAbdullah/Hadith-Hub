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

## Contribution Guide

There are 2 repositories of interest.

1. [Hadith Hub](https://github.com/GibreelAbdullah/Hadith-Hub) (This Repo) - The frontend of the application written in Svelte 5 with SvelteKit. Deployed to GitHub Pages.

2. [hadith-db](https://github.com/GibreelAbdullah/hadith-db) - Holds all the hadith data (text files, metadata, gradings, scholar information). Served via GitHub Pages with Range request support. Data is organized as:
   - `data/books/` — Hadith collections (text files and metadata per collection)
   - `data/muhaddith/` — Scholar/Muhaddith biographical data
   - `data/collections.json` — Collection listing
   - `data/gradeTranslations.json` — Grade and scholar name translations

Search is handled client-side using [Pagefind](https://pagefind.app/), with per-language indexes built at deploy time.

You may raise a PR, give suggestions, or raise issues for any of them.

## To run the project

1. Clone the repository.
  ```bash
  git clone https://github.com/GibreelAbdullah/Hadith-Hub.git
  cd Hadith-Hub
  ```

2. Clone the [hadith-db](https://github.com/GibreelAbdullah/hadith-db) repo and create a symlink:
   ```bash
   git clone https://github.com/GibreelAbdullah/hadith-db.git ../hadith-db
   ln -sf ../hadith-db/data static/db
   ```

3. Run `npm install` to install dependencies.

4. Run `npm run dev` to run the application in dev mode.

5. Go to `http://localhost:5173` in your browser.
