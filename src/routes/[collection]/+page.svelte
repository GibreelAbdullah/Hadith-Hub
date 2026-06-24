<script lang="ts">
	import { page } from '$app/stores';
	import BookContainer from '$lib/components/bookContainer.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import { getBooks } from '$lib/functions/utilsV2';
	import { getMetadata } from '$lib/data/db';

	let title = $state(`${$page.params.collection} | HadithHub`);

	$effect(() => {
		getMetadata($page.params.collection).then(meta => {
			if (!meta) return;
			const lang = languageStore.value[0] || 'en';
			const collName = meta.collection_info?.[lang] || meta.collection_info?.en || $page.params.collection;
			title = `${collName} | HadithHub`;
		});
	});

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
	<BookContainer bookPromise={getBooks($page.params.collection)} bookURL={$page.params.collection} />
</main>
