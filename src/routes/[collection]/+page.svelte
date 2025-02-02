<script lang="ts">
	import { page } from '$app/stores';
	import BookContainer from '$lib/components/bookContainer.svelte';
	import { booksQueryString, urlPrefix } from '$lib/data/constantsV2';
	import { languageStore } from '$lib/functions/store.svelte';
	import { getData } from '$lib/functions/utilsV2';

	let title = `${$page.params.collection} | HadithHub`;

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
	<meta property="og:image" content="/favicon.png" />

	<!-- Twitter Meta Tags -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={$page.url.hostname} />
	<meta property="twitter:url" content={$page.url.toString()} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content="A Multi Language collection of Hadith" />
	<meta property="twitter:image" content="/favicon.png" />
</svelte:head>

<main>
	<!-- <CollectionContainer collectionPromise={getData(`${urlPrefix}${collectionsQueryString}&langs=${languageStore.value.toString()}`)} /> -->
	<BookContainer bookPromise={getData(`${urlPrefix}${booksQueryString}&langs=${languageStore.value.toString()}&collection=${$page.params.collection}`)} bookURL={$page.params.collection} />
</main>
