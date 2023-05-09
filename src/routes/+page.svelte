<script lang="ts">
  import "@skeletonlabs/skeleton/styles/all.css";
  import CollectionContainer from "$lib/components/collectionContainer.svelte";
  import { page } from "$app/stores";
	import { collectionPromise } from "$lib/common/utils";
</script>

<svelte:head>
  <!-- HTML Meta Tags -->
  <title>HadithHub</title>
  <meta name="description" content="A Multi Language collection of Hadith" />

  <!-- Facebook Meta Tags -->
  <meta property="og:url" content={$page.url.toString()} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="HadithHub" />
  <meta
    property="og:description"
    content="A Multi Language collection of Hadith"
  />
  <meta property="og:image" content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg" />

  <!-- Twitter Meta Tags -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={$page.url.hostname} />
  <meta property="twitter:url" content={$page.url.toString()} />
  <meta property="twitter:title" content="HadithHub" />
  <meta
    property="twitter:description"
    content="A Multi Language collection of Hadith"
  />
  <meta property="twitter:image" content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg" />
</svelte:head>

<main>
  <CollectionContainer dataPromise={collectionPromise} />
</main>
