<script lang="ts">
	import { page } from '$app/stores';
	import { getData } from '$lib/functions/utilsV2';
	import HadithPlaceholder from '$lib/components/hadithPlaceholder.svelte';
	import { searchQueryString, urlPrefix } from '$lib/data/constantsV2';
	import Reference from '$lib/components/hadithCardComponents/reference.svelte';
	import GradingSection from '$lib/components/hadithCardComponents/gradingSection.svelte';

	const title = `Search for "${$page.url.searchParams.get('text')}" | HadithHub`;
	const language = $page.url.searchParams.get('language');
	const collection = $page.url.searchParams.get('collection');

	let url = '';
	
	$: {
		let params = [];
		const text = $page.url.searchParams.get('text');
		if (text) params.push(`text=${encodeURIComponent(text)}`);
		if (language) params.push(`language=${encodeURIComponent(language)}`);
		if (collection) params.push(`collection=${encodeURIComponent(collection)}`);
		url = `${urlPrefix}${searchQueryString}${params.length ? '&' + params.join('&') : ''}`;
	}

	$: allHadithPromises = getData(url);

</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content="A Multi Language collection of Hadith" />

	<meta property="og:url" content={$page.url.toString()} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content="A Multi Language collection of Hadith" />
	<meta
		property="og:image"
		content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg"
	/>

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
	<div class="card flex-wrap variant-glass-primary z-[-1] relative max-w-[90rem] m-auto my-4">
		<div class="hadithGroup grid">
			<div class="break-words leading-7 m-3">
				{#if $page.url.searchParams.get('text') != null}
					<span class="chip variant-ringed block w-full break-words whitespace-pre-line">
						Search For : {$page.url.searchParams.get('text')}
					</span>
				{/if}
			</div>
		</div>
	</div>
	{#await allHadithPromises}
		<HadithPlaceholder />
	{:then data}
		{#each data as hadith}
			<!-- {@const dummy2 = bookTitle = hadith[2]} -->
			<div class="p-4">
				<div class="p-4 card max-w-[90rem] m-auto">
					<div class="card flex-wrap">
						<div class="hadithGroup font-medium grid">
							<div class="break-words leading-7 m-3 pb-4">
								<article id="myDiv">{@html hadith[6]}</article>
							</div>
						</div>
						<GradingSection grades={hadith[5]} hadithIndex={hadith[1][0]} />
						<Reference collectionShortName={hadith[0]} hadithNumberInCollection={hadith[1][0]} hadithNumberInBook={hadith[3]} bookNumber={hadith[2]} collectionTitle={hadith[7]} bookTitle={hadith[8]} />
					</div>
				</div>
			</div>
		{/each}
	{:catch error}
		<div class="card p-4 max-w-[90rem] m-auto my-4">
			<div class="hadithGroup font-medium p-2 grid">
				<div class="break-words leading-7 m-3">
					Something went wrong. Kindly report this to our twitter account <a
						href="https://twitter.com/TheHadithHub"
						target="blank">TheHadithHub</a
					>
				</div>
				<div class="break-words leading-7 m-3">
					{error}
				</div>
			</div>
		</div>
	{/await}
</main>

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
