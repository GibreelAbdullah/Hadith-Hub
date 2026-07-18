<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import HadithContainer from '$lib/components/hadithContainer.svelte';
	import MetaTags from '$lib/components/common/MetaTags.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import HadithPlaceholder from '$lib/components/hadithPlaceholder.svelte';
	import { getHadithChunked, type ChunkedHadithLoader } from '$lib/functions/utilsV2';
	import { getMetadata } from '$lib/data/db';
	import UnavailableLanguagesNotice from '$lib/components/common/UnavailableLanguagesNotice.svelte';

	let title = $state(`Book ${$page.params.bookNumber} - ${$page.params.collection} | HadithHub`);
	const loaderPromise = $derived(getHadithChunked($page.params));

	$effect(() => {
		getMetadata($page.params.collection).then(meta => {
			if (!meta) return;
			const lang = languageStore.value[0] || 'en';
			const collName = meta.collection_info?.[lang] || meta.collection_info?.en || $page.params.collection;
			const book = meta.books.find(b => b.number === $page.params.bookNumber);
			const bookName = book ? (book as any)[lang] || (book as any).en || `Book ${$page.params.bookNumber}` : `Book ${$page.params.bookNumber}`;
			title = `${bookName} - ${collName} | HadithHub`;
		});
	});
</script>

<MetaTags {title} />
<main>
	{#if languageStore.value.length != 0}
		{#await loaderPromise}
			<div class="sticky top-0 card p-4 !preset-tonal-secondary max-w-[90rem] m-auto my-4">
				<div class="px-5">
					<ol class="breadcrumb">
						<li class="crumb anchor"><a href="{base}/">Home</a></li>
						<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
						<div class="placeholder w-52 m-auto animate-pulse"></div>
					</ol>
				</div>
			</div>
			<div class="card flex-wrap !bg-transparent max-w-[90rem] m-auto my-4">
				<div class="hadithGroup grid">
					<div class="break-words leading-7 m-3">
						<div class="placeholder animate-pulse"></div>
					</div>
					<div class="break-words leading-7 m-3 text-right justify-end">
						<div class="placeholder animate-pulse"></div>
					</div>
				</div>
			</div>
			<HadithPlaceholder />
		{:then loader}
			<UnavailableLanguagesNotice unavailableLanguages={loader.unavailableLanguages} />
			{#if loader.totalRecords === 0}
				{#await getMetadata($page.params.collection) then meta}
				<div class="card p-4 m-4 max-w-[90rem] mx-auto text-center">
					<div class="py-8">
						<h2 class="text-2xl font-bold mb-2">Book Not Found</h2>
						<p class="text-surface-600-400 mb-4">
							Book <strong>{$page.params.bookNumber}</strong> does not exist in this collection.
						</p>
						<a href="{base}/{$page.params.collection}?lang={languageStore.value.toString()}" class="btn preset-filled-primary-500">
							Browse {meta?.collection_info?.[languageStore.value[0]] || meta?.collection_info?.en || $page.params.collection}
						</a>
					</div>
				</div>
				{/await}
			{:else}
				{#if loader.availableLanguages.length > 0}
					<HadithContainer dataListRecord={loader.initialData} availableLanguages={loader.availableLanguages} loadMore={loader.loadMore} hasMore={loader.hasMore} />
				{/if}
			{/if}
		{:catch data}
			<div class="card p-4 m-4">
				<div class="hadithGroup font-medium p-2 grid">
					<div class="break-words leading-7 m-3">Error. Try clearing the cache.</div>
				</div>
			</div>
		{/await}
	{:else}
		<div class="card p-4 m-4">
			<div class="hadithGroup font-medium p-2 grid">
				<div class="break-words leading-7 m-3">Select at least 1 language.</div>
			</div>
		</div>
	{/if}
</main>

<style>
	.hadithGroup {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}
</style>
