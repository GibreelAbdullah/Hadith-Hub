<script lang="ts">
  import { page } from "$app/stores";
  import { urlPrefix } from "$lib/common/constants.svelte";
  import ChapterContainer from "$lib/components/chapterContainer.svelte";
  import { getData } from '$lib/common/utils'

  let collectionPromise: Promise<any>;

  let collections = `${urlPrefix}sections/${$page.params.collection}.json`;
  collectionPromise = getData(collections);
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
