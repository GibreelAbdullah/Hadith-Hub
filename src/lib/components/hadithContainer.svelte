<script lang="ts">
	import { page } from '$app/stores';
	import { languageStore } from '$lib/functions/store.svelte';
	import { base } from '$app/paths';
	import GradingSection from '$lib/components/hadithCardComponents/gradingSection.svelte';
	import Reference from './hadithCardComponents/reference.svelte';
	import { isRtl } from '$lib/functions/utilsV2';
	export let dataListRecord: any[] = [];
	let bookTitle = '';
	let collectionTitle = '';
	let collectionShortName: string = '';
</script>
{#each dataListRecord as data}
	{#if data[5] == 'collection'}
		{@const dummy1 = collectionTitle = data[7]}
		{@const dummy2 = collectionShortName = data[0]}
		<div class="sticky top-0 card p-4 !variant-glass-secondary max-w-[90rem] m-auto my-4">
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
	{:else if data[5] == 'book'}
		{@const dummy = bookTitle = data[7]}
	{:else if ['chapter', 'chapter_intro'].includes(data[5])}
		<div class="p-4">
			<div
				class="px-4 card max-w-[90rem] m-auto {data[5] == 'chapter' ? 'variant-glass-primary' : ''}"
			>
				<div class="hadithGroup font-medium grid">
					{#each { length: languageStore.value.length ? languageStore.value.length : 2 } as _, i}
						{#await isRtl(languageStore.value[i]) then rtl}
							<div class="break-words leading-7 m-3 pb-4" dir={rtl ? 'rtl' : 'ltr'}>
								<article id="myDiv">{@html data[i + 7]}</article>
							</div>
						{/await}
					{/each}
				</div>
			</div>
		</div>

	{:else if data[5] == 'hadith'}
		<div class="p-4">
			<div class="p-4 card max-w-[90rem] m-auto">
				<div class="card flex-wrap" id="hadith{data[0]}{data[1]}">
					<div class="hadithGroup font-medium grid">
						{#each { length: languageStore.value.length ? languageStore.value.length : 2 } as _, i}
							{#await isRtl(languageStore.value[i]) then rtl}
								<div class="break-words leading-7 m-3 pb-4" dir={rtl ? 'rtl' : 'ltr'}>
									<article id="myDiv">{@html data[i + 7]}</article>
								</div>
							{/await}
						{/each}
					</div>
					<!-- GRADINGS -->
					<GradingSection grades={data[6]} hadithIndex={data[1]} />
					<!-- REFERENCE AND BUTTONS -->
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

<style>
	:global(.hadithGroup) {
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		word-wrap: normal;
	}

	:global(qbl, b3d) {
		text-wrap: auto;
		display: block;
		color: rgb(var(--color-primary-900));
		font-family: 'KFGQPC Uthman Taha Naskh';
	}

	:global(.dark qbl, .dark b3d) {
		text-wrap: auto;
		color: rgb(var(--color-primary-300));
	}

	:global(text) {
		text-wrap: auto;
	}
</style>
