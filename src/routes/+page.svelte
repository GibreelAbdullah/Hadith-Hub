<script lang="ts">
  import "@brainandbones/skeleton/styles/all.css";
  import BookContainer from "$lib/components/bookContainer.svelte";
  import { urlPrefix } from "$lib/common/constants";
  import { getData } from '$lib/common/utils'
  import { page } from "$app/stores";

  const collections = `${urlPrefix}/updates/collections/collections.min.json`;

  let collectionPromise = getData(collections);
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
  <meta property="og:image" content="/favicon.png" />

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={$page.url.hostname} />
  <meta property="twitter:url" content={$page.url.toString()} />
  <meta name="twitter:title" content="HadithHub" />
  <meta
    name="twitter:description"
    content="A Multi Language collection of Hadith"
  />
  <meta name="twitter:image" content="/favicon.png" />
</svelte:head>

<main>
  <BookContainer dataPromise={collectionPromise} />
</main>
