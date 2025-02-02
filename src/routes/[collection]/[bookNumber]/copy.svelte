<script lang="ts">
	import { page } from '$app/stores';
	import HadithContainer from '$lib/components/hadithContainer.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import { hadithInBookQueryString, urlPrefix } from '$lib/data/constantsV2';
	import { getData } from '$lib/functions/utilsV2';
	import HadithPlaceholder from '$lib/components/hadithPlaceholder.svelte';
	import { getLanguageFullName } from '$lib/components/common/sideBarContents.svelte';

	let title = `Book ${$page.params.bookNumber} - ${$page.params.collection} | HadithHub`;

	///Some data points (like book name in breadcrumbs) is taken from the first
	///element of the Promises. But if the first element errors out because the translation
	///in that language is not available, need to go to the next element to get the data.
	///variable i will be used to track that
	let i: number = 0;

	// let allHadithPromises: { language: string; promise: Promise<any> }[] = [];
	let allHadithPromises = getData(`${urlPrefix}${hadithInBookQueryString}&langs=${languageStore.value.toString()}&collection=${$page.params.collection}&book_number=${$page.params.bookNumber}`);

	let unavailableLanguages: string[] = [];

	///If the promises are rejected, need to move forward ignoring those promises.
	///This function will make the value of all rejected promises = null and it
	///will be removed in the next step
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
	// 	for (const language in languageStore.value) {
	// 		const url = `${urlPrefix}/editions/${languageStore.value[language]}-${$page.params.collection}/sections/${$page.params.bookNumber}.min.json`;
	// 		const hadithPromise = getData(url);
	// 		allHadithPromises.push({
	// 			language: languageStore.value[language],
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
	{#await getData(`${urlPrefix}${hadithInBookQueryString}&langs=${languageStore.value.toString()}&collection=${$page.params.collection}&book_number=${$page.params.bookNumber}`)}
		<HadithPlaceholder />
	{:then allHadiths}
		{allHadiths}
		<!-- {#if i != -1}
		{:else}
			<div class="flex flex-col items-center justify-center h-screen">
				<h1 class="text-4xl font-bold text-gray-600">	
					{languageStore.value}
				</h1>
				<h2 class="text-2xl font-bold text-gray-600">
					No data found for this book in {languageStore.value}
				</h2>
			</div>
		{/if} -->
	{/await}
</main>