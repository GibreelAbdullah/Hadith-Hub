<script lang="ts">
	import { page } from '$app/stores';
	import HadithContainer from '$lib/components/hadithContainer.svelte';
	import { getLanguageFullName, getData, getCollectionFullName } from '$lib/common/utils';
	import HadithPlaceholder from '$lib/common/hadithPlaceholder.svelte';

	const title = `Search for "${$page.url.searchParams.get('q')}" | HadithHub`;

	$: url = 'https://hadith-search-api-gibreelabdullah.koyeb.app/search' + $page.url.search;
	// const url = "http://0.0.0.0:5000/search" + $page.url.search;
	$: allHadithPromises = getData(url);

	const formatData = (data: [string[]]) => {
		let indiHadith: any[] = [];
		for (const hadithData of data) {
			let hadithDict: any = {};
			hadithDict.hadithnumber = hadithData[0];
			hadithDict.arabicnumber = hadithData[1];
			hadithDict.text = hadithData[2];
			let gradings: any[] = [];
			for (const grading of hadithData[3].split(' && ')) {
				gradings.push({
					name: grading.split('::')[0],
					grade: grading.split('::')[1]
				});
			}
			hadithDict.grades = gradings;
			hadithDict.reference = {
				book: hadithData[4],
				hadith: hadithData[5]
			};
			hadithDict.bookName = hadithData[6];
			hadithDict.shortName = hadithData[8];
			indiHadith.push(hadithDict);
		}
		return { hadiths: indiHadith };
	};
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
	<div class="card card-body m-4 flex-wrap variant-glass-primary z-[-1] relative">
		<div class="hadithGroup grid">
			<div class="break-words leading-7 m-3">
				{#if $page.url.searchParams.get('q') != null}
					<span class="chip variant-ringed">Search For : {$page.url.searchParams.get('q')}</span>
				{/if}
				{#if $page.url.searchParams.get('lang') != null}
					<span class="chip variant-ringed">
						{#await getLanguageFullName($page.url.searchParams.get('lang').split(','))}
							<div class="placeholder w-40 m-auto animate-pulse my-1" />
						{:then languagesNames}
							Languages : {languagesNames}
						{/await}
					</span>
				{/if}
				{#if $page.url.searchParams.get('book') != null}
					<span class="chip variant-ringed">
						{#await getCollectionFullName($page.url.searchParams.get('book').split(','))}
							<div class="placeholder w-40 m-auto animate-pulse my-1" />
						{:then collectionNames}
							Collections : {collectionNames}
						{/await}
					</span>
				{/if}
			</div>
		</div>
	</div>
	{#await allHadithPromises}
		<HadithPlaceholder />
	{:then data}
		{#if data.length != 0}
			<HadithContainer allHadiths={[formatData(data)]} book={$page.params['book']} />
		{:else}
			<div class="card card-body p-4 m-4">
				<div class="hadithGroup font-medium p-2 grid">
					<div class="break-words leading-7 m-3">
						No results found for {$page.url.searchParams.get('q')}. Check if there are any spelling
						mistakes.
					</div>
				</div>
			</div>
		{/if}
	{:catch data}
		<div class="card card-body p-4 m-4">
			<div class="hadithGroup font-medium p-2 grid">
				<div class="break-words leading-7 m-3">
					Something went wrong. Kindly report this to our twitter account <a
						href="https://twitter.com/TheHadithHub"
						target="blank">TheHadithHub</a
					>
				</div>
			</div>
		</div>
	{/await}
</main>
