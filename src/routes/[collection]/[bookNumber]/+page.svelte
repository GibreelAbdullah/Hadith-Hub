<script lang="ts">
	import { page } from '$app/stores';
	import HadithContainer from '$lib/components/hadithContainer.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import { hadithInBookQueryString, urlPrefix } from '$lib/data/constantsV2';
	import { getData } from '$lib/functions/utilsV2';
	import HadithPlaceholder from '$lib/components/hadithPlaceholder.svelte';

	let title = `Book ${$page.params.bookNumber} - ${$page.params.collection} | HadithHub`;

	let bookTitle = $page.params.bookNumber;

	///Some data points (like book name in breadcrumbs) is taken from the first
	///element of the Promises. But if the first element errors out because the translation
	///in that language is not available, need to go to the next element to get the data.
	///variable i will be used to track that
	// let i: number = 0;

	// let allHadithPromises: { language: string; promise: Promise<any> }[] = [];

	// let unavailableLanguages: string[] = [];

	// ///If the promises are rejected, need to move forward ignoring those promises.
	// ///This function will make the value of all rejected promises = null and it
	// ///will be removed in the next step
	// function allResolvingErrors(allHadithPromises: { language: string; promise: Promise<any> }[]) {
	// 	unavailableLanguages = [];
	// 	return Promise.all(
	// 		allHadithPromises.map(async function (p, index) {
	// 			return p.promise.catch(function nullifyErroredPromises(error) {
	// 				if (i == index) {
	// 					i++;
	// 					if (i >= allHadithPromises.length) {
	// 						i = -1; //i=-1 when no selected language has data
	// 					}
	// 				}
	// 				unavailableLanguages.push(p.language);
	// 				return null;
	// 			});
	// 		})
	// 	);
	// }

	// $: {
	// 	i = 0;
	// 	allHadithPromises = [];
	// 	for (const language in $selectedLanguagesStore) {
	// 		const url = `${urlPrefix}/editions/${$selectedLanguagesStore[language]}-${$page.params.collection}/sections/${$page.params.bookNumber}.min.json`;
	// 		const hadithPromise = getData(url);
	// 		allHadithPromises.push({
	// 			language: $selectedLanguagesStore[language],
	// 			promise: hadithPromise
	// 		});
	// 	}
	// }
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

<main>
	{#if languageStore.value.length != 0}
		{#await getData(`${urlPrefix}${hadithInBookQueryString}&langs=${languageStore.value.toString()}&collection=${$page.params.collection}&book_number=${$page.params.bookNumber}`)}
			<div class="sticky top-0 card p-4 !variant-glass-secondary max-w-[90rem] m-auto my-4">
				<div class="hadithGroup grid px-5">
					<ol class="breadcrumb">
						<li class="crumb anchor"><a href="/">Home</a></li>
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
		{:then dataList}
		<HadithContainer dataListRecord={dataList} book={$page.params.collection} />

			<!-- {#each dataList as data}
				{#if data[5] == 'collection'}
					<div class="sticky top-0 card p-4 !variant-glass-secondary max-w-[90rem] m-auto my-4">
						<div class="hadithGroup grid px-5">
							<ol class="breadcrumb">
								<li class="crumb anchor"><a href="/">Home</a></li>
								<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
								<li class="crumb anchor">
									<a href="/{$page.params.collection}">{data[7]}</a>
								</li>
								<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
								<li id="bookCrumb" class="crumb">{bookTitle}</li>
							</ol>
						</div>
					</div>
				{:else if data[5] == 'book'}
					{@const dummy = bookTitle = data[7]}
				{:else}
				{/if}
			{/each} -->
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
