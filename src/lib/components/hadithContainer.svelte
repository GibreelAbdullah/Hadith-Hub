<script lang="ts">
	import { page } from '$app/stores';
	import { languageStore } from '$lib/functions/store.svelte';
	import { base } from '$app/paths';
	import GradingSection from '$lib/components/hadithCardComponents/gradingSection.svelte';
	import Reference from './hadithCardComponents/reference.svelte';
	import { settingsStore, getFontStyleForText } from '$lib/functions/settingsStore';
	import { getDirForText } from '$lib/functions/language';
	export let dataListRecord: any[] = [];
	export let availableLanguages: string[] = [];
	export let hideBreadcrumb: boolean = false;

	$: fontSettings = $settingsStore;

	$: displayLanguages = languageStore.value.filter(l => availableLanguages.includes(l));
	$: langCount = displayLanguages.length || 2;

	$: collectionTitle = dataListRecord.find(d => d[5] === 'collection')?.[7] || '';
	$: collectionShortName = dataListRecord.find(d => d[5] === 'collection')?.[0] || '';
	$: bookTitle = dataListRecord.find(d => d[5] === 'book')?.[7] || '';
</script>
{#each dataListRecord as data}
	{#if data[5] == 'collection'}
	{#if !hideBreadcrumb}
	<div class="p-4">
		<div class="sticky top-0 card p-4 !variant-glass-secondary max-w-[90rem] m-auto">
			<div class="hadithGroup grid px-5">
				<ol class="breadcrumb">
					<li class="crumb anchor">
						<a href="{base}/{$page.params.home}?lang={languageStore.value.toString()}">Home</a>
					</li>
					<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
					<li class="crumb anchor">
						<a href="{base}/{$page.params.collection}?lang={languageStore.value.toString()}">{data[7]}</a>
					</li>
					<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
					<li id="bookCrumb" class="crumb">{bookTitle}</li>
				</ol>
			</div>
		</div>
	</div>
	{/if}
	{:else if data[5] == 'book'}
	{:else if ['chapter', 'chapter_intro'].includes(data[5])}
		<div class="p-4">
			<div
				class="px-4 card max-w-[90rem] m-auto {data[5] == 'chapter' ? 'variant-glass-primary' : ''}"
			>
				<div class="hadithGroup font-medium grid">
					{#each { length: langCount } as _, i}
						<div class="break-words leading-7 m-3 pb-4" dir={getDirForText(data[i + 7] || '', displayLanguages[i])} style={getFontStyleForText(data[i + 7] || '', displayLanguages[i], fontSettings)}>
							<article id="myDiv">{@html data[i + 7]}</article>
						</div>
					{/each}
				</div>
			</div>
		</div>

	{:else if data[5] == 'hadith'}
		<div class="p-4">
			<div class="p-4 card max-w-[90rem] m-auto" id="hadith{data[0]}{data[1]}">
				<!-- Compact reference at top center -->
				<div class="text-center mb-3">
					<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-500/15 text-primary-700 dark:text-primary-300 text-sm font-medium">
						<span>{collectionTitle}</span>
						<span dir="ltr">: {data[1]}</span>
					</span>
				</div>
				<div class="card flex-wrap">
					<div class="hadithGroup font-medium grid">
						{#each { length: langCount } as _, i}
							<div class="break-words leading-7 m-3 pb-4" dir={getDirForText(data[i + 7] || '', displayLanguages[i])} style={getFontStyleForText(data[i + 7] || '', displayLanguages[i], fontSettings)}>
								{#if data[i + 7]}
									<article id="myDiv">{@html data[i + 7]}</article>
								{:else}
									<center><code class="!text-white !bg-red-500">Hadith translation not found</code></center>
								{/if}
							</div>
						{/each}
					</div>
					<!-- GRADINGS -->
					<GradingSection grades={data[6]} hadithIndex={data[1]} collection={collectionShortName} />
					<!-- FULL REFERENCE AND BUTTONS at bottom -->
					<Reference
						{collectionShortName}
						hadithNumberInCollection={data[1]}
						hadithNumberInBook={data[3]}
						bookNumber={data[2]}
						{collectionTitle}
						{bookTitle}
					/>
				</div>
			</div>
		</div>
	{/if}
{/each}
