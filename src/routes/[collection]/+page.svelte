<script lang="ts">
  import { page } from "$app/stores";
  import { urlPrefix } from "$lib/common/constants.svelte";
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

<main>
  <ChapterContainer
    dataPromise={collectionPromise}
    bookURL={$page.params.collection}
  />
</main>
