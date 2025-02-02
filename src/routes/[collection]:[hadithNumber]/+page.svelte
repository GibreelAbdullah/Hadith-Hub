<script lang="ts">
	import { page } from '$app/stores';
	import { singleHadith, urlPrefix } from '$lib/data/constantsV2';
	import { languageStore } from '$lib/functions/store.svelte';
	import HadithContainer from '$lib/components/hadithContainer.svelte';
	import { getData } from '$lib/functions/utilsV2';
	import HadithPlaceholder from '$lib/components/hadithPlaceholder.svelte';
	import { getLanguageFullName } from '$lib/components/common/sideBarContents.svelte';

	let title = `${$page.params.collection}:${$page.params.hadithNumber} | HadithHub`;

	///Some data points (like book name in breadcrumbs) is taken from the first
	///element of the Promises. But if the first element errors out because the translation
	///in that language is not available, need to go to the next element to get the data.
	///variable i will be used to track that
	let i: number = 0;

	// let hadithGroupPromise: { language: string; promise: Promise<any> }[] = [];
	// let hadith = ;
	// const hadithPromise = ;
	let unavailableLanguages: string[] = [];

	///If the promises are rejected, need to move forward ignoring those promises.
	///This function will make the value of all rejected promises = null and it
	///will be removed in the next step
	function allResolvingErrors(allHadithPromises: { language: string; promise: Promise<any> }[]) {
		unavailableLanguages = [];
		return Promise.all(
			allHadithPromises.map(async function (p, index) {
				return p.promise.catch(function nullifyErroredPromises(error) {
					if (i == index) {
						i++;
						if (i >= allHadithPromises.length) {
							i = -1; //i=-1 when no selected language has data
						}
					}
					unavailableLanguages.push(p.language);
					return null;
				});
			})
		);
	}

	// $: {
	// 	i = 0;
	// 	hadithGroupPromise = [];
	// 	for (const language in languageStore.value) {
	// 		let hadith = `${urlPrefix}${singleHadith}&langs=${languageStore.value.toString()}&collection=${$page.params.collection}&hadith_number=${$page.params.hadithNumber}`;
	// 		const hadithPromise = getData(hadith);
	// 		hadithGroupPromise.push({
	// 			language: language,
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

{#if languageStore.value.length != 0}
	{#await getData(`${urlPrefix}${singleHadith}&langs=${languageStore.value.toString()}&collection=${$page.params.collection}&hadith_number=${$page.params.hadithNumber}`)}
		<div class="sticky top-0 card p-4 !variant-glass-secondary max-w-[90rem] m-auto my-4">
			<div class="hadithGroupgrid px-5">
				<ol class="breadcrumb">
					<li class="crumb anchor"><a href="/">Home</a></li>
					<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
					<div class="placeholder w-52 m-auto animate-pulse"></div>
				</ol>
			</div>
		</div>
		<!-- <div class="p-4">
			<div class="card variant-glass-primary z-[-1] relative max-w-[90rem] m-auto">
				<div class="hadithGroup grid"> -->
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
		<HadithContainer dataListRecord={dataList} book={$page.params.collection} />
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
