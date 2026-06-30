<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import HadithPlaceholder from '$lib/components/hadithPlaceholder.svelte';

	import { DATA_BASE_URL } from '$lib/data/db';
	import { languageStore } from '$lib/functions/store.svelte';

	const PAGEFIND_URL = import.meta.env.VITE_PAGEFIND_URL || '/pagefind';

	let searchQuery = $state($page.url.searchParams.get('text') || '');
	let results = $state<any[]>([]);
	let loading = $state(false);
	let pagefind: any = null;

	onMount(async () => {
		if (!browser) return;
		try {
			pagefind = await import(/* @vite-ignore */ `${PAGEFIND_URL}/pagefind.js`);
			await pagefind.init();
		} catch (e) {
			console.error('Failed to load pagefind:', e);
		}
		if (searchQuery && pagefind) doSearch();
	});

	async function doSearch() {
		if (!pagefind || !searchQuery.trim()) {
			results = [];
			return;
		}
		loading = true;
		const search = await pagefind.search(searchQuery);
		// Load metadata only (no excerpts since fragments are removed)
		const loaded = await Promise.all(search.results.slice(0, 30).map(async (r: any) => {
			try {
				return await r.data();
			} catch {
				// Fragment not available - return metadata from the result ID
				return { url: r.id, meta: {}, excerpt: "" };
			}
		}));
		results = loaded;
		loading = false;
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		const url = new URL(window.location.href);
		url.searchParams.set('text', searchQuery);
		window.history.replaceState({}, '', url.toString());
		doSearch();
	}
</script>

<svelte:head>
	<title>Search{searchQuery ? ` for "${searchQuery}"` : ''} | HadithHub</title>
</svelte:head>

<main class="max-w-[90rem] m-auto p-4">
	<form class="mb-4" onsubmit={handleSubmit}>
		<input
			class="input w-full"
			type="text"
			placeholder="Search hadith..."
			bind:value={searchQuery}
		/>
	</form>

	{#if loading}
		<HadithPlaceholder />
	{:else if results.length > 0}
		<p class="text-sm opacity-70 mb-4">{results.length} results</p>
		{#each results as result}
			<div class="card p-4 mb-4">
				<a href="{base}{result.url}?lang={languageStore.value.toString()}" class="block">
					<div class="flex items-center gap-2">
						<span class="font-medium text-primary-600 dark:text-primary-400">
							{result.meta?.title || result.url}
						</span>
						{#if result.meta?.book}
							<span class="text-xs opacity-60">· {result.meta.book}</span>
						{/if}
					</div>
				</a>
			</div>
		{/each}
	{:else if searchQuery && !loading}
		<div class="card p-4 text-center">
			<p>No results found for "{searchQuery}"</p>
		</div>
	{/if}
</main>
