<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import HadithPlaceholder from '$lib/components/hadithPlaceholder.svelte';

	let searchQuery = $state($page.url.searchParams.get('text') || '');
	let results = $state<any[]>([]);
	let loading = $state(false);
	let pagefind: any = null;

	onMount(async () => {
		if (!browser) return;
		pagefind = await import(/* @vite-ignore */ `${base}/pagefind/pagefind.js`);
		await pagefind.init();
		if (searchQuery) doSearch();
	});

	async function doSearch() {
		if (!pagefind || !searchQuery.trim()) {
			results = [];
			return;
		}
		loading = true;
		const search = await pagefind.search(searchQuery);
		const loaded = await Promise.all(search.results.slice(0, 30).map((r: any) => r.data()));
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
				<a href="{result.url}" class="block">
					<div class="flex items-center gap-2 mb-2">
						<span class="text-sm font-medium text-primary-600 dark:text-primary-400">
							{result.meta.title}
						</span>
						{#if result.meta.book}
							<span class="text-xs opacity-60">· {result.meta.book}</span>
						{/if}
					</div>
					<p class="text-sm leading-relaxed">{@html result.excerpt}</p>
				</a>
			</div>
		{/each}
	{:else if searchQuery && !loading}
		<div class="card p-4 text-center">
			<p>No results found for "{searchQuery}"</p>
		</div>
	{/if}
</main>
