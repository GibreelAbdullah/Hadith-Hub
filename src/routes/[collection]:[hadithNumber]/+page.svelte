<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { languageStore } from '$lib/functions/store.svelte';
	import HadithContainer from '$lib/components/hadithContainer.svelte';
	import MetaTags from '$lib/components/common/MetaTags.svelte';
	import { getSingleHadith } from '$lib/functions/utilsV2';
	import { getMetadata } from '$lib/data/db';
	import HadithPlaceholder from '$lib/components/hadithPlaceholder.svelte';
	import UnavailableLanguagesNotice from '$lib/components/common/UnavailableLanguagesNotice.svelte';

	let title = `${$page.params.collection}:${$page.params.hadithNumber} | HadithHub`;

	const getHadithData = $derived(getSingleHadith(
		$page.params.collection,
		$page.params.hadithNumber,
		languageStore.value.length ? languageStore.value : ["ar", "en"]
	));
</script>

<MetaTags {title} />

{#if languageStore.value.length != 0}
	{#await getHadithData}
		<div class="sticky top-0 card p-4 !preset-tonal-secondary max-w-[90rem] m-auto my-4">
			<div class="px-5">
				<ol class="breadcrumb">
					<li class="crumb anchor"><a href="{base}/">Home</a></li>
					<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
					<div class="placeholder w-52 m-auto animate-pulse"></div>
				</ol>
			</div>
		</div>
		<div class="card preset-tonal-primary z-[-1] relative max-w-[90rem] m-auto">
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
					<p class="text-surface-600-400 mb-4">
						The hadith <strong>{$page.params.collection}:{$page.params.hadithNumber}</strong> does not exist in this collection.
					</p>
					<a href="{base}/{$page.params.collection}?lang={languageStore.value.toString()}" class="btn preset-filled-primary-500">
						Browse {meta?.collection_info?.[languageStore.value[0]] || meta?.collection_info?.en || $page.params.collection}
					</a>
				</div>
			</div>
			{/await}
		{:else}
			{#await getMetadata($page.params.collection) then meta}
				{@const unavailable = languageStore.value.filter(l => !(meta?.languages || []).includes(l))}
				<UnavailableLanguagesNotice unavailableLanguages={unavailable} />
				{#if unavailable.length < languageStore.value.length}
					<HadithContainer dataListRecord={dataList} availableLanguages={meta?.languages || []} />
				{/if}
			{/await}
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
