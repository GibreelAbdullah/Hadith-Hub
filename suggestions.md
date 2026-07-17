  High Impact — User Experience

  1. Infinite scroll on hadith pages — Currently loads all hadiths in a book at once. Lazy-loading as the user scrolls would drastically reduce initial page load time for large books.
  2. Shareable hadith cards — A "copy shareable link" or "share to WhatsApp/Twitter" button would increase engagement since this is how hadith content spreads.
  3. Bookmark/favorites system — Let users save hadiths to localStorage. A simple "heart" icon per hadith that persists across sessions. No backend needed.
  4. Keyboard shortcuts — Next/previous hadith navigation with arrow keys when viewing a single hadith. Makes reading through a book much faster.

  Medium Impact — Visual/UI

  5. Reading progress indicator — A thin progress bar at the top showing how far through a book you've scrolled.
  6. Better empty states — When a language isn't available or search returns no results, show more helpful suggestions (e.g., "Try searching in Arabic" or "This collection is available in: en, ar").
  7. Consistent card sizing on the front page — Collection cards have varying heights depending on how many language names are shown. A fixed minimum height would make the grid look cleaner.
  8. Dark mode for the grading popup — The scholar popup text may not be fully readable in dark mode depending on the bio content.

  Low Impact — Optimization

  9. Preload next book's metadata — When viewing a book, prefetch the adjacent book's metadata so navigation feels instant.
  10. Service Worker for offline reading — Cache viewed hadiths so users can read them offline. Particularly useful for the target audience who may have unreliable internet.
  11. Move gradeTranslations.json fetch to on-demand — It's only needed for non-English users, could be skipped entirely for English-only users.

  Architecture/Data

  12. Structured hadith data — A future migration to separate files per book (rather than one massive file per collection per language) would eliminate the need for range requests entirely.
  13. RSS feed — A "hadith of the day" RSS feed that cycles through well-known hadiths. Low effort, high SEO value.
