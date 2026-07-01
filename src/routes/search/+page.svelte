<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { languageStore } from '$lib/functions/store.svelte';
	import { getMetadata, fetchLines } from '$lib/data/db';
	import { isRtl } from '$lib/functions/utilsV2';
	import GradingSection from '$lib/components/hadithCardComponents/gradingSection.svelte';
	import Reference from '$lib/components/hadithCardComponents/reference.svelte';
	import HadithPlaceholder from '$lib/components/hadithPlaceholder.svelte';

	const PAGEFIND_BASE = `${base}/pagefind`;

	let searchQuery = $state($page.url.searchParams.get('text') || '');
	let results = $state<any[]>([]);
	let loading = $state(false);
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
			const { getCollections } = await import('$lib/data/db');
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
		// No filter = search ALL available languages (sidebar selection doesn't affect search)
		const allAvailableLanguages = ['ar', 'en', 'bn', 'fr', 'id', 'ru', 'ta', 'tr', 'ur'];
		const langsToSearch = languageFilter
			? [languageFilter]
			: allAvailableLanguages;

		const searchOptions: any = {};
		if (collectionFilter) {
			searchOptions.filters = { collection: [collectionFilter] };
		}

		// Search across selected language indexes and merge results
		const allResults: { url: string; lang: string; score: number; collShort: string; hadithNum: string }[] = [];

		for (const lang of langsToSearch) {
			const pf = await loadPagefindForLang(lang);
			if (!pf) continue;

			const search = await pf.search(searchQuery, searchOptions);
			for (const r of search.results.slice(0, 15)) {
				try {
					const data = await r.data();
					// Parse URL to get collection and hadith number
					const match = data.url.match(/\/([^/:]+):([^?]+)$/);
					if (match) {
						allResults.push({ url: data.url, lang, score: r.score || 0, collShort: match[1], hadithNum: match[2] });
					}
				} catch {}
			}
		}

		// Deduplicate by collection:hadithNum
		const seen = new Map();
		for (const r of allResults) {
			const key = `${r.collShort}:${r.hadithNum}`;
			if (!seen.has(key) || r.score > seen.get(key).score) {
				seen.set(key, r);
			}
		}
		const uniqueResults = [...seen.values()].slice(0, 20);

		// Build highlight regex
		const searchTerms = searchQuery.trim().split(/\s+/).filter(t => t.length > 1);
		const highlightRegex = searchTerms.length > 0
			? new RegExp(`(${searchTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
			: null;

		function highlightText(text: string): string {
			if (!highlightRegex || !text) return text;
			return text.replace(highlightRegex, '<span class="text-error-500 font-semibold">$1</span>');
		}

		// Enrich results with hadith text
		const enriched = [];
		for (const { collShort, hadithNum, lang: matchedLang } of uniqueResults) {
			const meta = await getMetadata(collShort);
			if (!meta) continue;

			const rec = meta.records.find(r => r.cat === "hadith" && r.num?.split(",").includes(hadithNum));
			if (!rec) continue;

			// Show only the matched language
			const lines = await fetchLines(collShort, matchedLang, rec.line, rec.line, meta);
			const text = highlightText(lines[0] || "");

			const gradings = (meta as any).gradings?.[rec.num] || null;
			const book = meta.books.find(b => b.number === rec.book);
			const collTitle = meta.collection_info?.en || meta.collection_info?.[matchedLang] || collShort;
			const bookTitle = book?.en || book?.[matchedLang as keyof typeof book] || book?.ar || '';

			enriched.push({
				collShort,
				hadithNum: rec.num,
				bookNum: rec.book,
				numBook: rec.num_book,
				collTitle,
				bookTitle,
				texts: [{ lang: matchedLang, text }],
				gradings,
			});
		}

		results = enriched;
		loading = false;
	}
</script>

<svelte:head>
	<title>Search{searchQuery ? ` for "${searchQuery}"` : ''} | HadithHub</title>
</svelte:head>

<main>
	{#if loading}
		<HadithPlaceholder />
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
								{#await isRtl(lang) then rtl}
									<div class="break-words leading-7 m-3 pb-4" dir={rtl ? 'rtl' : 'ltr'}>
										{#if text}
											<article>{@html text}</article>
										{:else}
											<center><code class="!text-white !bg-red-500">Hadith translation not found</code></center>
										{/if}
									</div>
								{/await}
							{/each}
						</div>
						<GradingSection grades={result.gradings} hadithIndex={result.hadithNum} />
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
	{:else if searchQuery && !loading}
		<div class="card p-4 m-4 text-center">
			<p>No results found for "{searchQuery}"</p>
		</div>
	{/if}
</main>

<style>
	:global(.hadithGroup) {
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		word-wrap: normal;
	}
</style>
