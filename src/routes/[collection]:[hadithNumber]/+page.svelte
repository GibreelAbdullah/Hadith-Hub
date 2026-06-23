<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { languageStore } from '$lib/functions/store.svelte';
	import HadithContainer from '$lib/components/hadithContainer.svelte';
	import { getSingleHadith } from '$lib/functions/utilsV2';
	import { getMetadata } from '$lib/data/db';
	import HadithPlaceholder from '$lib/components/hadithPlaceholder.svelte';

	let title = `${$page.params.collection}:${$page.params.hadithNumber} | HadithHub`;

	const getHadithData = $derived(getSingleHadith(
		$page.params.collection,
		$page.params.hadithNumber,
		languageStore.value.length ? languageStore.value : ["ar", "en"]
	));
</script>

<svelte:head>
	<!-- HTML Meta Tags -->
	<title>{title}</title>
	<meta name="description" content="A Multi Language collection of Hadith" />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content={$page.url.toString()} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content="A Multi Language collection of Hadith" />
	<meta
		property="og:image"
		content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg"
	/>

	<!-- Twitter Meta Tags -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={$page.url.hostname} />
	<meta property="twitter:url" content={$page.url.toString()} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content="A Multi Language collection of Hadith" />
	<meta
		property="twitter:image"
		content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg"
	/>
</svelte:head>

{#if languageStore.value.length != 0}
	{#await getHadithData}
		<div class="sticky top-0 card p-4 !variant-glass-secondary max-w-[90rem] m-auto my-4">
			<div class="hadithGroupgrid px-5">
				<ol class="breadcrumb">
					<li class="crumb anchor"><a href="{base}/">Home</a></li>
					<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
					<div class="placeholder w-52 m-auto animate-pulse"></div>
				</ol>
			</div>
		</div>
		<div class="card variant-glass-primary z-[-1] relative max-w-[90rem] m-auto">
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
	{:then dataList}
		{#if dataList.length === 0}
			{#await getMetadata($page.params.collection) then meta}
			<div class="card p-4 m-4 max-w-[90rem] mx-auto text-center">
				<div class="py-8">
					<h2 class="text-2xl font-bold mb-2">Hadith Not Found</h2>
					<p class="text-surface-600 dark:text-surface-400 mb-4">
						The hadith <strong>{$page.params.collection}:{$page.params.hadithNumber}</strong> does not exist in this collection.
					</p>
					<a href="{base}/{$page.params.collection}?lang={languageStore.value.toString()}" class="btn variant-filled-primary">
						Browse {meta?.collection_info?.[languageStore.value[0]] || meta?.collection_info?.en || $page.params.collection}
					</a>
				</div>
			</div>
			{/await}
		{:else}
			<HadithContainer dataListRecord={dataList} />
		{/if}
	{:catch _data}
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

<style>
	.hadithGroup {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}
</style>
