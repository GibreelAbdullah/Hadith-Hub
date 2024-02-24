<!-- <script lang="ts">
	import { page } from '$app/stores';
	import { collectionPromiseNew } from '$lib/common/utils';
	import CollectionContainerNew from '$lib/components/collectionContainerNew.svelte';
</script>

<svelte:head>
	<title>HadithHub</title>
	<meta name="description" content="A Multi Language collection of Hadith" />

	<meta property="og:url" content={$page.url.toString()} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="HadithHub" />
	<meta property="og:description" content="A Multi Language collection of Hadith" />
	<meta
		property="og:image"
		content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg"
	/>

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={$page.url.hostname} />
	<meta property="twitter:url" content={$page.url.toString()} />
	<meta property="twitter:title" content="HadithHub" />
	<meta property="twitter:description" content="A Multi Language collection of Hadith" />
	<meta
		property="twitter:image"
		content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg"
	/>
</svelte:head>

<main>
	<CollectionContainerNew dataPromise={collectionPromiseNew} />
</main> -->
