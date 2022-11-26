<script lang="ts">
  import { page } from "$app/stores";
  import { urlPrefix } from "$lib/common/constants";
  import ChapterContainer from "$lib/components/chapterContainer.svelte";

  let collectionPromise: Promise<any>;

  let collections = `${urlPrefix}sections/${$page.params.collection}.json`;
  collectionPromise = getData(collections);

  async function getData(url: string) {
    return await fetch(url).then((response) => {
      return response.json();
    });
  }
</script>

<svelte:head>
  {#await collectionPromise}
    <title>{$page.params.collection} | HadithHub</title>
  {:then data}
    <title>{data.name} | HadithHub</title>
  {/await}
</svelte:head>

<main>
  <ChapterContainer
    dataPromise={collectionPromise}
    bookURL={$page.params.collection}
  />
</main>
