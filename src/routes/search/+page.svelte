<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { languageStore } from '$lib/functions/store.svelte';
	import { getMetadata, fetchLines, getCollections } from '$lib/data/db';
	import { getLanguageFullName } from '$lib/functions/utilsV2';
	import { getDirForText } from '$lib/functions/language';
	import GradingSection from '$lib/components/hadithCardComponents/gradingSection.svelte';
	import Reference from '$lib/components/hadithCardComponents/reference.svelte';
	import HadithPlaceholder from '$lib/components/hadithPlaceholder.svelte';
	import { detectAll } from 'tinyld/light';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	function openSearchModal() {
		const modal: ModalSettings = {
			type: 'component',
			component: 'searchModal',
			meta: { query: searchQuery },
		};
		modalStore.trigger(modal);
	}

	function highlightFromExcerpt(fullText: string, excerpt: string): string {
		if (!excerpt || !fullText) return fullText;
		// Extract the words that pagefind marked in the excerpt
		const markRegex = /<mark>(.*?)<\/mark>/g;
		const markedWords = new Set<string>();
		let match;
		while ((match = markRegex.exec(excerpt)) !== null) {
			markedWords.add(match[1]);
		}
		if (markedWords.size === 0) return fullText;

		// Build a regex from marked words, escaping special chars
		const pattern = [...markedWords]
			.sort((a, b) => b.length - a.length) // longest first
			.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
			.join('|');
		const highlightRegex = new RegExp(`(${pattern})`, 'gi');
		return fullText.replace(highlightRegex, '<mark>$1</mark>');
	}

	function detectLanguages(query: string): string[] {
		const text = query.trim();
		if (!text) return ['en', 'ar'];

		const OUR_LANGUAGES = ['ar', 'en', 'bn', 'fr', 'id', 'ru', 'ta', 'tr', 'ur'];

		// Try tinyld first
		try {
			const results = detectAll(text);
			// Filter to only our languages
			const matches = results.filter((r: any) => OUR_LANGUAGES.includes(r.lang));
			if (matches.length > 0 && matches[0].accuracy > 0.3) {
				// High confidence - use just that language
				return [matches[0].lang];
			}
			if (matches.length > 0 && matches[0].accuracy > 0.15) {
				// Medium confidence - use top 2-3 matches
				return matches.slice(0, 3).map((r: any) => r.lang);
			}
		} catch {}

		// Fallback: script-based detection
		return detectByScript(text);
	}

	function detectByScript(text: string): string[] {
		let hasArabic = false;
		let hasBengali = false;
		let hasTamil = false;
		let hasCyrillic = false;
		let hasLatin = false;

		for (const char of text) {
			const code = char.codePointAt(0) || 0;
			if ((code >= 0x0600 && code <= 0x06FF) || (code >= 0x0750 && code <= 0x077F) || (code >= 0xFB50 && code <= 0xFDFF) || (code >= 0xFE70 && code <= 0xFEFF)) {
				hasArabic = true;
			} else if (code >= 0x0980 && code <= 0x09FF) {
				hasBengali = true;
			} else if (code >= 0x0B80 && code <= 0x0BFF) {
				hasTamil = true;
			} else if (code >= 0x0400 && code <= 0x04FF) {
				hasCyrillic = true;
			} else if ((code >= 0x0041 && code <= 0x007A) || (code >= 0x00C0 && code <= 0x024F)) {
				hasLatin = true;
			}
		}

		const langs: string[] = [];
		if (hasArabic) langs.push('ar', 'ur');
		if (hasBengali) langs.push('bn');
		if (hasTamil) langs.push('ta');
		if (hasCyrillic) langs.push('ru');
		if (hasLatin) langs.push('en', 'fr', 'id', 'tr');

		return langs.length > 0 ? [...new Set(langs)] : ['en', 'ar'];
	}

	const PAGEFIND_BASE = `${base}/pagefind`;

	async function getCollectionFullName(shortName: string): Promise<string> {
		const data = await getCollections();
		const coll = data.collections.find((c: any) => c.short_name === shortName);
		return coll?.en || coll?.ar || shortName;
	}

	let searchQuery = $state($page.url.searchParams.get('text') || '');
	let results = $state<any[]>([]);
	let loading = $state(false);
	let loadingMore = $state(false);
	let allUniqueResults = $state<any[]>([]);
	let displayCount = $state(15);
	let pagefindInstances: Map<string, any> = new Map();

	async function loadPagefindForLang(lang: string) {
		if (pagefindInstances.has(lang)) return pagefindInstances.get(lang);
		try {
			const pf = await import(/* @vite-ignore */ `${PAGEFIND_BASE}/${lang}/pagefind.js`);
			await pf.init();
			pagefindInstances.set(lang, pf);
			return pf;
		} catch {
			return null;
		}
	}

	onMount(async () => {
		if (!browser) return;
		if (searchQuery) doSearch();
	});

	$effect(() => {
		const text = $page.url.searchParams.get('text') || '';
		const _collection = $page.url.searchParams.get('collection') || '';
		const _language = $page.url.searchParams.get('language') || '';
		if (text !== searchQuery) {
			searchQuery = text;
		}
		if (browser && searchQuery) doSearch();
	});

	async function doSearch() {
		if (!searchQuery.trim()) {
			results = [];
			return;
		}

		// Check if the query is a direct hadith reference (e.g., "bukhari 1", "muslim 224a")
		const directMatch = searchQuery.trim().match(/^(\w+)[:\s]+(\d+\w*)$/i);
		if (directMatch) {
			const [, collName, num] = directMatch;
			// Try to find the collection by short_name or partial name
			const data = await getCollections();
			const coll = data.collections.find((c: any) =>
				c.short_name.toLowerCase() === collName.toLowerCase() ||
				c.en?.toLowerCase().includes(collName.toLowerCase()) ||
				c.short_name.toLowerCase().includes(collName.toLowerCase())
			);
			if (coll) {
				const meta = await getMetadata(coll.short_name);
				if (meta) {
					const rec = meta.records.find(r => r.cat === "hadith" && r.num?.split(",").includes(num));
					if (rec) {
						// Direct navigation
						window.location.href = `${base}/${coll.short_name}:${num}?lang=${languageStore.value.toString()}`;
						return;
					}
				}
			}
		}

		loading = true;

		const collectionFilter = $page.url.searchParams.get('collection') || '';
		const languageFilter = $page.url.searchParams.get('language') || '';

		// Determine which language indexes to search
		// Language filter from search bar = specific language only
		// No filter = auto-detect from the script of the typed text
		const allAvailableLanguages = ['ar', 'en', 'bn', 'fr', 'id', 'ru', 'ta', 'tr', 'ur'];
		const langsToSearch = languageFilter
			? [languageFilter]
			: detectLanguages(searchQuery);

		console.log(`[Search] Query: "${searchQuery}" → Languages: [${langsToSearch.join(', ')}]`);

		const searchOptions: any = {};
		if (collectionFilter) {
			searchOptions.filters = { collection: collectionFilter.split(',') };
		}

		// Search across selected language indexes and merge results
		const allResults: { result: any; lang: string; score: number }[] = [];

		for (const lang of langsToSearch) {
			const pf = await loadPagefindForLang(lang);
			if (!pf) continue;

			const search = await pf.search(searchQuery, searchOptions);
			for (const r of search.results) {
				allResults.push({ result: r, lang, score: r.score || 0 });
			}
		}

		// Deduplicate by score (keep highest scoring per result id)
		const seen = new Map();
		for (const r of allResults) {
			const key = r.result.id;
			if (!seen.has(key) || r.score > seen.get(key).score) {
				seen.set(key, r);
			}
		}
		// Sort by score descending so best matches come first regardless of language
		const uniqueResults = [...seen.values()].sort((a, b) => b.score - a.score);

		// No custom highlighting - pagefind provides excerpts via r.data()

		// Store all unique results for pagination
		allUniqueResults = uniqueResults;
		displayCount = 15;

		// Enrich only the first page
		results = await enrichResults(uniqueResults.slice(0, displayCount));
		loading = false;
	}

	async function loadMore() {
		if (loadingMore) return;
		loadingMore = true;
		const nextBatch = allUniqueResults.slice(displayCount, displayCount + 15);
		const enriched = await enrichResults(nextBatch);
		results = [...results, ...enriched];
		displayCount += 15;
		loadingMore = false;
	}

	async function enrichResults(items: any[]) {
		const results = await Promise.all(items.map(async ({ result, lang: matchedLang }) => {
			let collShort: string, hadithNum: string, excerpt: string;
			try {
				const data = await result.data();
				const match = data.url.match(/\/([^/:]+):([^?]+)$/);
				if (!match) return null;
				collShort = match[1];
				hadithNum = match[2];
				excerpt = data.excerpt || "";
			} catch { return null; }

			const meta = await getMetadata(collShort);
			if (!meta) return null;

			const rec = meta.records.find(r => r.cat === "hadith" && r.num?.split(",").includes(hadithNum));
			if (!rec) return null;

			const lines = await fetchLines(collShort, matchedLang, rec.line, rec.line, meta);
			const text = lines[0] || "";

			const gradings = (meta as any).gradings?.[rec.num] || null;
			const book = meta.books.find(b => b.number === rec.book);
			const collTitle = meta.collection_info?.en || meta.collection_info?.[matchedLang] || collShort;
			const bookTitle = book?.en || book?.[matchedLang as keyof typeof book] || book?.ar || '';

			return {
				collShort,
				hadithNum: rec.num,
				bookNum: rec.book,
				numBook: rec.num_book,
				collTitle,
				bookTitle,
				texts: [{ lang: matchedLang, text }],
				excerpt,
				gradings,
			};
		}));
		return results.filter(Boolean);
	}
</script>

<svelte:head>
	<title>Search{searchQuery ? ` for "${searchQuery}"` : ''} | HadithHub</title>
</svelte:head>

<main>
	<!-- Search details card -->
	{#if searchQuery}
	<div class="p-4">
		<div class="card p-4 max-w-[90rem] m-auto variant-glass-primary cursor-pointer hover:brightness-95" on:click={openSearchModal} on:keydown={openSearchModal} role="button" tabindex="0">
			<div class="flex flex-wrap items-center gap-2 justify-center">
				<span class="font-medium">Search:</span>
				<span class="badge variant-filled-primary">{searchQuery}</span>
				<span class="font-medium ml-2">Language:</span>
				{#if $page.url.searchParams.get('language')}
					{#await getLanguageFullName([$page.url.searchParams.get('language') || '']) then names}
						<span class="badge variant-filled-secondary">{names[0] || $page.url.searchParams.get('language')}</span>
					{/await}
				{:else}
					<span class="badge variant-filled-secondary">All Languages</span>
				{/if}
				<span class="font-medium ml-2">Collections:</span>
				{#if $page.url.searchParams.get('collection')}
					{#each $page.url.searchParams.get('collection')?.split(',') || [] as coll}
						{#await getCollectionFullName(coll) then name}
							<span class="badge variant-filled-secondary">{name}</span>
						{/await}
					{/each}
				{:else}
					<span class="badge variant-filled-secondary">All Collections</span>
				{/if}
				{#if results.length > 0}
					<span class="text-sm opacity-60 ml-2">({results.length} results)</span>
				{/if}
			</div>
		</div>
	</div>
	{/if}

	{#if loading}
		<div class="px-4">
			<HadithPlaceholder />
		</div>
	{:else if results.length > 0}
		{#each results as result}
			<div class="p-4">
				<div class="p-4 card max-w-[90rem] m-auto" id="hadith{result.collShort}{result.hadithNum}">
					<!-- Top reference -->
					<div class="text-center mb-3">
						<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-500/15 text-primary-700 dark:text-primary-300 text-sm font-medium">
							<span>{result.collTitle}</span>
							<span dir="ltr">: {result.hadithNum}</span>
						</span>
					</div>
					<div class="card flex-wrap">
						<div class="hadithGroup font-medium grid">
							{#each result.texts as { lang, text }}
								<div class="break-words leading-7 m-3 pb-4" dir={getDirForText(text || '', lang)}>
									{#if text}
										<article>{@html highlightFromExcerpt(text, result.excerpt)}</article>
									{:else}
										<center><code class="!text-white !bg-red-500">Hadith translation not found</code></center>
									{/if}
								</div>
							{/each}
						</div>
						<GradingSection grades={result.gradings} hadithIndex={result.hadithNum} collection={result.collShort} />
						<Reference
							collectionShortName={result.collShort}
							hadithNumberInCollection={result.hadithNum}
							hadithNumberInBook={result.numBook}
							bookNumber={result.bookNum}
							collectionTitle={result.collTitle}
							bookTitle={result.bookTitle}
						/>
					</div>
				</div>
			</div>
		{/each}
		{#if displayCount < allUniqueResults.length}
			<div class="p-4 text-center">
				<button class="btn variant-filled-primary" on:click={loadMore} disabled={loadingMore}>
					{loadingMore ? 'Loading...' : `Load More (${allUniqueResults.length - displayCount} remaining)`}
				</button>
			</div>
		{/if}
	{:else if searchQuery && !loading}
		<div class="card p-4 m-4 text-center">
			<p>No results found for "{searchQuery}"</p>
		</div>
	{/if}
</main>

<style>
	:global(mark) {
		background: none;
		color: rgb(var(--color-primary-500));
		font-weight: 600;
	}
</style>
