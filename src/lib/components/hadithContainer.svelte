<script lang="ts">
	import { page } from '$app/stores';
	import { languageStore } from '$lib/functions/store.svelte';
	import { base } from '$app/paths';
	import HadithCard from './hadithCardComponents/HadithCard.svelte';
	import { settingsStore, getFontStyleForText } from '$lib/functions/settingsStore';
	import { getDirForText } from '$lib/functions/language';
	export let dataListRecord: any[] = [];
	export let availableLanguages: string[] = [];
	export let hideBreadcrumb: boolean = false;
	export let loadMore: (() => Promise<any[]>) | null = null;
	export let hasMore: (() => boolean) | null = null;

	$: fontSettings = $settingsStore;

	$: displayLanguages = languageStore.value.filter((l) => availableLanguages.includes(l));
	$: langCount = displayLanguages.length || 2;

	$: collectionTitle = dataListRecord.find((d) => d[5] === 'collection')?.[7] || '';
	$: collectionShortName = dataListRecord.find((d) => d[5] === 'collection')?.[0] || '';
	$: bookTitle = dataListRecord.find((d) => d[5] === 'book')?.[7] || '';

	let loadingMore = false;

	// Auto-load: fetch and append chunks continuously as they arrive
	async function loadNextChunk() {
		if (loadingMore || !hasMore?.() || !loadMore) return;
		loadingMore = true;
		const moreData = await loadMore();
		if (moreData.length) {
			dataListRecord = [...dataListRecord, ...moreData];
		}
		loadingMore = false;
		// Keep loading if there's more
		if (hasMore?.()) {
			loadNextChunk();
		}
	}

	// Start loading remaining chunks after initial render
	$: if (dataListRecord.length > 0 && hasMore?.()) {
		loadNextChunk();
	}
</script>

{#each dataListRecord as data}
	{#if data[5] == 'collection'}
		{#if !hideBreadcrumb}
			<div class="p-4">
				<div class="sticky top-0 card p-4 !preset-tonal-secondary max-w-360 m-auto">
					<div class="px-5">
						<ol class="breadcrumb">
							<li class="crumb anchor">
							<a href="{base}/?lang={languageStore.value.toString()}">Home</a>
							</li>
							<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
							<li class="crumb anchor">
								<a href="{base}/{$page.params.collection}?lang={languageStore.value.toString()}"
									>{data[7]}</a
								>
							</li>
							<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
							<li id="bookCrumb" class="crumb">{bookTitle}</li>
						</ol>
					</div>
				</div>
			</div>
		{/if}
	{:else if data[5] == 'book'}{:else if ['chapter', 'chapter_intro'].includes(data[5])}
		<div class="p-4">
			<div
				class="px-4 card max-w-360 m-auto {data[5] == 'chapter' ? '!preset-tonal-primary' : '!preset-tonal-tertiary'}"
			>
				<div class="hadithGroup font-medium grid">
					{#each { length: langCount } as _, i}
						<div
							class="wrap-break-word leading-7 m-3 pb-4"
							dir={getDirForText(data[i + 7] || '', displayLanguages[i])}
							style={getFontStyleForText(data[i + 7] || '', displayLanguages[i], fontSettings)}
						>
							<article id="myDiv">{@html data[i + 7]}</article>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else if data[5] == 'hadith'}
		<HadithCard
			id="{data[0]}{data[1]}"
			{collectionTitle}
			{collectionShortName}
			hadithNum={data[1]}
			{bookTitle}
			bookNumber={data[2]}
			hadithNumberInBook={data[3]}
			texts={Array.from({ length: langCount }, (_, i) => ({
				text: data[i + 7] || '',
				lang: displayLanguages[i] || '',
				dir: getDirForText(data[i + 7] || '', displayLanguages[i]),
				style: getFontStyleForText(data[i + 7] || '', displayLanguages[i], fontSettings),
			}))}
			grades={data[6]}
		/>
	{/if}
{/each}
