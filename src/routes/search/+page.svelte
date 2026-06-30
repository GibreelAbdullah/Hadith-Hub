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
	let pagefind: any = null;

	onMount(async () => {
		if (!browser) return;
		try {
			pagefind = await import(/* @vite-ignore */ `${PAGEFIND_BASE}/pagefind.js`);
			await pagefind.init();
		} catch (e) {
			console.error('Failed to load pagefind:', e);
		}
		if (searchQuery && pagefind) doSearch();
	});

	$effect(() => {
		const text = $page.url.searchParams.get('text') || '';
		if (text !== searchQuery) {
			searchQuery = text;
			if (pagefind && searchQuery) doSearch();
		}
	});

	async function doSearch() {
		if (!pagefind || !searchQuery.trim()) {
			results = [];
			return;
		}
		loading = true;
		const search = await pagefind.search(searchQuery);
		const loaded = [];
		for (const r of search.results.slice(0, 20)) {
			try {
				loaded.push(await r.data());
			} catch {}
		}

		const searchTerms = searchQuery.trim().split(/\s+/).filter(t => t.length > 1);
		const highlightRegex = searchTerms.length > 0
			? new RegExp(`(${searchTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
			: null;

		function highlightText(text: string): string {
			if (!highlightRegex || !text) return text;
			return text.replace(highlightRegex, '<span class="text-error-500 font-semibold">$1</span>');
		}

		const allLangs = languageStore.value.length ? languageStore.value : ["ar", "en"];
		const enriched = [];

		for (const result of loaded) {
			const collShort = result.meta?.collection_short;
			const hadithNum = result.meta?.hadith_num;
			if (!collShort || !hadithNum) continue;

			const meta = await getMetadata(collShort);
			if (!meta) continue;

			const rec = meta.records.find(r => r.cat === "hadith" && r.num?.split(",").includes(hadithNum));
			if (!rec) continue;

			const availLangs = allLangs.filter(l => meta.offsets[l]);
			const texts = await Promise.all(availLangs.map(async (lang) => {
				const lines = await fetchLines(collShort, lang, rec.line, rec.line, meta);
				return { lang, text: highlightText(lines[0] || "") };
			}));

			const gradings = (meta as any).gradings?.[rec.num] || null;
			const book = meta.books.find(b => b.number === rec.book);
			const collTitle = meta.collection_info?.[availLangs[0]] || meta.collection_info?.en || collShort;
			const bookTitle = book?.[availLangs[0] as keyof typeof book] || book?.en || book?.ar || '';

			enriched.push({
				collShort,
				hadithNum: rec.num,
				bookNum: rec.book,
				numBook: rec.num_book,
				collTitle,
				bookTitle,
				texts,
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
