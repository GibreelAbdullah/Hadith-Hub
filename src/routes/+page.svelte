<script lang="ts">
	import CollectionContainer from '$lib/components/collectionContainer.svelte';
	import MetaTags from '$lib/components/common/MetaTags.svelte';
	import { getCollectionPromise } from '$lib/functions/utilsV2';
  	const collectionPromise = getCollectionPromise();
</script>

<MetaTags
	title="HadithHub | حدیث Hadith হাদিস хадис Hadis"
	description="Hadith with Tahqeeq in العربية, বাংলা, English, français, Bahasa Indonesia, Русский, தமிழ், Türkçe, اردو"
/>

<main>
	<CollectionContainer collectionPromise={collectionPromise} />
</main>
