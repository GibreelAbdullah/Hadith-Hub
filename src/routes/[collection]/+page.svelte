<script lang="ts">
	import { page } from '$app/stores';
	import BookContainer from '$lib/components/bookContainer.svelte';
	import MetaTags from '$lib/components/common/MetaTags.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import { getBooks } from '$lib/functions/utilsV2';
	import { getMetadata } from '$lib/data/db';

	let title = $state(`${$page.params.collection} | HadithHub`);
	// Re-fetch books when languages change - spread to ensure new array reference triggers $derived
	const bookPromise = $derived(getBooks($page.params.collection, [...languageStore.value]));

	$effect(() => {
		getMetadata($page.params.collection).then(meta => {
			if (!meta) return;
			const lang = languageStore.value[0] || 'en';
			const collName = meta.collection_info?.[lang] || meta.collection_info?.en || $page.params.collection;
			title = `${collName} | HadithHub`;
		});
	});

</script>

<MetaTags {title} />

<main>
	{#key languageStore.value.toString()}
		<BookContainer bookPromise={bookPromise} bookURL={$page.params.collection} />
	{/key}
</main>
