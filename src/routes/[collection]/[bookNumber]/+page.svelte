<script lang="ts">
  import { page } from "$app/stores";
  import HadithContainer from "$lib/components/hadithContainer.svelte";
  import { selectedLanguagesStore } from "$lib/common/sideBarContents.svelte";
  import { browser } from "$app/environment";
  import { urlPrefix } from "$lib/common/constants.svelte";
  import { Breadcrumb, Crumb } from "@brainandbones/skeleton";

  let allHadithPromises: any[] = [];
  async function getData(url: string) {
    return await fetch(url).then((response) => response.json());
  }
  $: {
    allHadithPromises = [];
    if (browser) {
      window.localStorage.setItem(
        "storedLanguagesList",
        $selectedLanguagesStore.toString()
      );
    }
    for (const language in $selectedLanguagesStore) {
      const url =
        urlPrefix +
        "editions/" +
        $selectedLanguagesStore[language] +
        "-" +
        $page.params.collection +
        "/sections/" +
        $page.params.bookNumber +
        ".min.json";

      const hadithPromise = getData(url);
      allHadithPromises.push(hadithPromise);
    }
  }
</script>

<svelte:head>
  {#await Promise.all(allHadithPromises)}
    <title
      >Book {$page.params.bookNumber} - {$page.params.collection} | HadithHub</title
    >
  {:then data}
    <title
      >{data[0].metadata.section[data[0].hadiths[0].reference.book].englishName}
      - {data[0].metadata.name} | HadithHub</title
    >
  {/await}
</svelte:head>

<main>
  {#if allHadithPromises.length != 0}
    {#await Promise.all(allHadithPromises)}
      <div class="card card-body m-4">
        <div class="hadithGroup font-medium p-2 grid">
          <div class="break-words leading-7 m-3">LOADING...</div>
        </div>
      </div>
    {:then data}
      <div class="sticky top-0 card card-body m-4">
        <div class="hadithGroup text-xs grid px-5">
          <Breadcrumb>
            <Crumb href="/">Home</Crumb>
            <Crumb href="/{$page.params.collection}"
              >{data[0].metadata.name}</Crumb
            >
            <Crumb
              >{data[0].metadata.section[data[0].hadiths[0].reference.book]
                .englishName}</Crumb
            >
          </Breadcrumb>
        </div>
      </div>
      <HadithContainer allHadiths={data} book={$page.params.collection} />
    {:catch _data}
      <div class="card card-body m-4">
        <div class="hadithGroup font-medium p-2 grid">
          <div class="break-words leading-7 m-3">
            Error. Try clearing the cache.
          </div>
        </div>
      </div>
    {/await}
  {:else}
    <div class="card card-body m-4">
      <div class="hadithGroup font-medium p-2 grid">
        <div class="break-words leading-7 m-3">Select at least 1 language.</div>
      </div>
    </div>
  {/if}
</main>

<style>
  .hadithGroup {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
</style>
