<script lang="ts">
  import "@brainandbones/skeleton/styles/all.css";
  import BookContainer from "$lib/components/bookContainer.svelte";
  import { urlPrefix } from "$lib/common/constants.svelte";
  import { getData } from '$lib/common/utils'

  const collections = urlPrefix + "01-Collections/collections.min.json";

  let collectionPromise = getData(collections);
</script>

<svelte:head>
  <title>HadithHub</title>
</svelte:head>

<main>
  <BookContainer dataPromise={collectionPromise} />
</main>
