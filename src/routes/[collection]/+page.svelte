<script lang="ts">
  import { page } from "$app/stores";
  import { urlPrefix } from "$lib/common/constants";
  import ChapterContainer from "$lib/components/chapterContainer.svelte";
  import { getData } from '$lib/common/utils'

  let title = `${$page.params.collection} | HadithHub`;

  let collectionPromise: Promise<any>;

  let collections = `${urlPrefix}/updates/sections/${$page.params.collection}.json`;
  collectionPromise = getData(collections);
</script>

<svelte:head>
  <!-- HTML Meta Tags -->
  <title>{title}</title>
  <meta name="description" content="A Multi Language collection of Hadith" />

  <!-- Facebook Meta Tags -->
  <meta property="og:url" content={$page.url.toString()} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta
    property="og:description"
    content="A Multi Language collection of Hadith"
  />
  <meta property="og:image" content="/favicon.png" />

  <!-- Twitter Meta Tags -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={$page.url.hostname} />
  <meta property="twitter:url" content={$page.url.toString()} />
  <meta property="twitter:title" content={title} />
  <meta
    property="twitter:description"
    content="A Multi Language collection of Hadith"
  />
  <meta property="twitter:image" content="/favicon.png" />
</svelte:head>

<main>
  <ChapterContainer
    dataPromise={collectionPromise}
    bookURL={$page.params.collection}
  />
</main>
