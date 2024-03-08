<script lang="ts">
	import { page } from '$app/stores';
	import { urlPrefix } from '$lib/common/constants';
	import { selectedLanguagesStore } from '$lib/common/sideBarContents.svelte';
	import HadithContainer from '$lib/components/hadithContainer.svelte';
	import { getLanguageFullName, getData } from '$lib/common/utils';
	import HadithPlaceholder from '$lib/common/hadithPlaceholder.svelte';

	let title = `${$page.params.collection}:${$page.params.hadithNumber} | HadithHub`;

	///Some data points (like book name in breadcrumbs) is taken from the first
	///element of the Promises. But if the first element errors out because the translation
	///in that language is not available, need to go to the next element to get the data.
	///variable i will be used to track that
	let i: number = 0;

	let hadithGroupPromise: { language: string; promise: Promise<any> }[] = [];

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

	$: {
		i = 0;
		hadithGroupPromise = [];
		for (const language in $selectedLanguagesStore) {
			let hadith = `${urlPrefix}/editions/${$selectedLanguagesStore[language]}-${$page.params.collection}/${$page.params.hadithNumber}.json`;
			const hadithPromise = getData(hadith);
			hadithGroupPromise.push({
				language: $selectedLanguagesStore[language],
				promise: hadithPromise
			});
		}
	}
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

{#if hadithGroupPromise.length != 0}
	{#await allResolvingErrors(hadithGroupPromise)}
		<div class="sticky top-0 card p-4 m-4 !variant-glass-secondary">
			<div class="hadithGroupgrid px-5">
				<ol class="breadcrumb">
					<li class="crumb anchor"><a href="/">Home</a></li>
					<li class="crumb-separator" aria-hidden>&rsaquo;</li>
					<div class="placeholder w-52 m-auto animate-pulse" />
				</ol>
			</div>
		</div>
		<div class="card m-4 flex-wrap !bg-transparent">
			<div class="hadithGroup grid">
				<div class="break-words leading-7 m-3">
					<div class="placeholder animate-pulse" />
				</div>
				<div class="break-words leading-7 m-3 text-right justify-end">
					<div class="placeholder animate-pulse" />
				</div>
			</div>
		</div>
		<HadithPlaceholder />
	{:then data}
		{#if i != -1}
			<div class="sticky top-0 card p-4 m-4 !variant-glass-secondary">
				<div class="hadithGroup grid px-5 pt-1">
					<ol class="breadcrumb">
						<li class="crumb anchor"><a href="/">Home</a></li>
						<li class="crumb-separator" aria-hidden>&rsaquo;</li>
						<li class="crumb anchor">
							<a href="/{$page.params.collection}">{data[0].metadata.name}</a>
						</li>
						<li class="crumb-separator" aria-hidden>&rsaquo;</li>
						<li class="crumb anchor">
							<a href="/{$page.params.collection}/{data[0].hadiths[0].reference.book}">
								{data[0].metadata.section[data[i].hadiths[0].reference.book]}
							</a>
						</li>
						<li class="crumb-separator" aria-hidden>&rsaquo;</li>
						<li class="crumb">
							Hadith {data[0].hadiths[0].reference.hadith}
						</li>
					</ol>
				</div>
			</div>
		{/if}
		{#if unavailableLanguages.length != 0}
			<div class="card p-4 m-4 !bg-red-500">
				<div class="hadithGroup font-medium p-2 grid text-center">
					{#await getLanguageFullName(unavailableLanguages)}
						<div class="placeholder w-40 m-auto animate-pulse my-1" />
					{:then langauges}
						This book is not available in {langauges}
					{/await}
				</div>
			</div>
		{/if}
		{#if i != -1}
			<HadithContainer allHadiths={data} book={$page.params.collection} singleHadithView={true} />
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
