<script lang="ts">
	import { page } from '$app/stores';
	import { languageStore } from '$lib/functions/store.svelte';
	import GradingSection from '$lib/components/hadithCardComponents/gradingSection.svelte';
	import Reference from './hadithCardComponents/reference.svelte';
	export let dataListRecord: any[] = [];
	let bookTitle = '';
	let collectionTitle = '';
	let collectionShortName: string = '';

	// let gradingColorClass = '';
	// const gradingColor = (grade: string) => {
	// 	if (!grade) {
	// 		return;
	// 	} else if (['hasan', 'mursal', 'jayyid'].some((i) => grade.toLowerCase().includes(i))) {
	// 		gradingColorClass = 'bg-indigo-600 text-white';
	// 	} else if (grade.toLowerCase().includes('sahih')) {
	// 		gradingColorClass = 'bg-emerald-500 text-black';
	// 	} else if (['mawdu', 'batil', 'munkar'].some((i) => grade.toLowerCase().includes(i))) {
	// 		gradingColorClass = 'bg-red-500 text-black';
	// 	} else if (grade.toLowerCase().includes('daif')) {
	// 		gradingColorClass = 'bg-orange-500 text-black';
	// 	} else {
	// 		gradingColorClass = 'bg-gray-500';
	// 	}
	// 	return gradingColorClass;
	// };
</script>


{#each dataListRecord as data}
	{#if data[5] == 'collection'}
		{@const dummy1 = collectionTitle = data[7]}
		{@const dummy2 = collectionShortName = data[0]}
		<div class="sticky top-0 card p-4 !variant-glass-secondary max-w-[90rem] m-auto my-4">
			<div class="hadithGroup grid px-5">
				<ol class="breadcrumb">
					<li class="crumb anchor"><a href="/?lang={languageStore.value.toString()}">Home</a></li>
					<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
					<li class="crumb anchor">
						<a href="/{$page.params.collection}?lang={languageStore.value.toString()}">{data[7]}</a>
					</li>
					<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
					<li id="bookCrumb" class="crumb">{bookTitle}</li>
				</ol>
			</div>
		</div>
	{:else if data[5] == 'book'}
		{@const dummy = bookTitle = data[7]}
	{:else if data[5] == 'chapter'}
		<div class="p-4">
			<div class="px-4 card variant-glass-primary max-w-[90rem] m-auto">
				<div class="hadithGroup font-medium grid">
					{#each { length: languageStore.value.length ? languageStore.value.length : 2 } as _, i}
						<div class="break-words leading-7 m-3 pb-4">
							<article id="myDiv">({data[4]}) {@html data[i + 7]}</article>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else if data[5] == 'chapter_intro'}
		<div class="p-4 max-w-[90rem] m-auto">
			<!-- <div class="card flex-wrap"> -->
			<div class="hadithGroup font-medium grid">
				{#each { length: languageStore.value.length ? languageStore.value.length : 2 } as _, i}
					<div class="break-words leading-7 m-3 pb-4">
						<article id="myDiv">{@html data[i + 7]}</article>
					</div>
				{/each}
			</div>
			<!-- </div> -->
		</div>
	{:else if data[5] == 'hadith'}
		<div class="p-4">
			<div class="p-4 card max-w-[90rem] m-auto">
				<div class="card flex-wrap" id="hadith{data[0]}{data[1]}">
					<div class="hadithGroup font-medium grid">
						{#each { length: languageStore.value.length ? languageStore.value.length : 2 } as _, i}
							<div class="break-words leading-7 m-3 pb-4">
								<article id="myDiv">{@html data[i + 7]}</article>
							</div>
						{/each}
					</div>
					<!-- GRADINGS -->
					<GradingSection grades={data[6]} hadithIndex={data[1]} />
					<!-- REFERENCE AND BUTTONS -->
					<Reference {collectionShortName} hadithNumberInCollection={data[1]} hadithNumberInBook={data[3]} bookNumber={data[2]} {collectionTitle} {bookTitle} />
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
