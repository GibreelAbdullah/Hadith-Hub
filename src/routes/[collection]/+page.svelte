<script lang="ts">
  import { page } from "$app/stores";
  import { urlPrefix } from "$lib/common/constants.svelte";
  import ChapterContainer from "$lib/components/chapterContainer.svelte";

  let title = `${$page.params.collection} | HadithHub`;

  let collectionPromise: Promise<any>;

  let collections = `${urlPrefix}sections/${$page.params.collection}.json`;
  collectionPromise = getData(collections);

  async function getData(url: string) {
    return await fetch(url).then((response) => {
      return response.json();
    });
  }

  collectionPromise.then((data) => (title = `${data.name} | HadithHub`));
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
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={$page.url.hostname} />
  <meta property="twitter:url" content={$page.url.toString()} />
  <meta name="twitter:title" content={title} />
  <meta
    name="twitter:description"
    content="A Multi Language collection of Hadith"
  />
  <meta name="twitter:image" content="/favicon.png" />
</svelte:head>

<main>
  <ChapterContainer
    dataPromise={collectionPromise}
    bookURL={$page.params.collection}
  />
</main>
