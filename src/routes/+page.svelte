<script lang="ts">
  import "@brainandbones/skeleton/styles/all.css";
  import BookContainer from "$lib/components/bookContainer.svelte";
  import { urlPrefix } from "$lib/common/constants.svelte";

  const collections = urlPrefix + "01-Collections/collections.min.json";

  let collectionPromise = getData(collections);

  async function getData(url: string) {
    return await fetch(url).then((response) => {
      return response.json();
    });
  }
</script>

<svelte:head>
  <title>HadithHub</title>
</svelte:head>

<main>
  <BookContainer dataPromise={collectionPromise} />
</main>
