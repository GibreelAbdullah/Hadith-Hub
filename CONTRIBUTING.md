# Contributing to Hadith Hub

Jazak Allah Khair for your interest in contributing to Hadith Hub! Whether you're fixing a typo in a Hadith translation, adding a new collection, or tweaking the UI, your help is incredibly valuable.

This guide will help you understand how the project is structured and get you set up locally.

---

## 🗺️ Which Repo Do You Need?

The project is split into two repositories to keep things fast and lightweight. Depending on what you want to change, you will work in a different place:

| If you want to change... | ...You will work in this repo |
| --- | --- |
| **The Website UI, CSS, or Search Features** | 🖥️ **[Hadith-Hub](https://github.com/GibreelAbdullah/Hadith-Hub)** (Frontend - SvelteKit SPA) |
| **Hadith Text, Typo Corrections, Gradings, or Scholar Bios** | 📦 **[hadith-db](https://github.com/GibreelAbdullah/hadith-db)** (Data - Flat text files and JSON) |

---

## 🛠️ Local Development Setup

To test your changes locally, you will need to clone both repositories and link them so the frontend can read the data.

1. **Clone both repositories:** Prerequisite.
Open your terminal and clone both repositories into the same parent folder:

```bash
git clone https://github.com/GibreelAbdullah/Hadith-Hub.git
git clone https://github.com/GibreelAbdullah/hadith-db.git

```


2. **Link the data folder:** Crucial Step.
Navigate into the frontend folder and create a symbolic link (symlink) to the data repository. This lets the frontend see the database files locally:

```bash
cd Hadith-Hub
ln -sf ../hadith-db/data static/db

```

*(Windows users: Use `mklink /d static\db ..\hadith-db\data` in Command Prompt running as Administrator).*


3. **Install dependencies:** Frontend.
Install the required Node packages for the SvelteKit application:

```bash
npm install

```


4. **Start the development server:** Launch.
Run the development script to boot up the site:

```bash
npm run dev

```

Open your browser and navigate to **`http://localhost:5173`**.


### 🔍 Optional: Testing Search Locally

Search index files are normally built automatically during deployment. If you are specifically working on or testing search features locally, generate the index manually by running:

```bash
npm run build:search

```

---

## ⚙️ How the Architecture Works (Simply Explained)

If you are curious about *why* we set things up this way, here is the quick breakdown:

### 1. The On-Demand Data Strategy

The full database (`hadith-db`) is roughly 2GB—way too massive to bundle directly into a browser app. To get around this, the frontend uses **HTTP Range Requests**.

* Think of this like asking a server, *"Hey, instead of sending me the whole 100MB file for Sahih al-Bukhari, just send me bytes 50,000 to 52,000."*
* To make this work, a Python script (`convert.py`) reads the raw text files in `hadith-db`, calculates exactly where every Hadith starts/stops, and saves those coordinates in a small `metadata.json` file. The frontend reads this tiny metadata file first, so it knows exactly what byte chunks to pull on demand.

### 2. The Search Layer

Search is completely client-side and powered by **Pagefind**. When the frontend builds in our automated pipeline (CI/CD), a script automatically pulls the latest text from `hadith-db`, indexes it, and bundles the search index files directly into the frontend build.

### 3. CI/CD Workflow

* A push to **`hadith-db`** triggers a GitHub Action that recalculates the metadata and tells the **Hadith-Hub** repo to rebuild itself automatically.
* A push to **`Hadith-Hub`** builds the SvelteKit application, builds the Pagefind index, and deploys it live to GitHub Pages.

---

## 📄 Data Layout formats

If you are updating or adding data to `hadith-db`, here is what you need to know.

### The Pipe-Delimited `.txt` Format

Every Hadith collection text file uses a strict line-by-line format separated by pipes (`|`):

```text
category|identifier|text content

```

Available categories include: `collection`, `collection_intro`, `book`, `book_intro`, `chapter`, `chapter_intro`, and `hadith`.

For example:

```text
book|1|Revelation
chapter|1|How the Divine Revelation started
hadith|1|Narrated 'Umar bin Al-Khattab: I heard Allah's Messenger saying...

```

---

## 🚀 Step-by-Step Contribution Tasks

### A. Adding a New Collection

1. Inside `hadith-db`, create a new folder: `data/books/{short_name}/`.
2. Add your pipe-delimited text files (e.g., `ar.txt`, `en.txt`).
3. Open `data/collections.json` and add your new collection profile.
4. Run `python3 convert.py` in the database directory to update the `metadata.json` byte offsets.
5. (Optional) Add a `gradings.json` file if you have scholar grading data.

### B. Adding a New Language Translation

1. Find the target collection folder inside `hadith-db/data/books/{collection_name}/`.
2. Add your new language text file (e.g., `fr.txt` for French) using the pipe-delimited layout.
3. Open `data/collections.json` and add the new language string (e.g., `"fr"`) into that collection's `languages` array. The frontend will instantly detect it!

---

### Tech Stack Checklist for Frontend Devs

* **Framework:** SvelteKit
* **UI styling:** Skeleton UI + TailwindCSS
* **Search Engine:** Pagefind (client-side, multi-language)

If you have any questions or hit a wall while setting up, don't hesitate to open an Issue or start a discussion in either repository!
