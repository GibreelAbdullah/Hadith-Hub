<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { urlPrefix } from "$lib/common/constants.svelte";
  import { selectedLanguagesStore } from "$lib/common/sideBarContents.svelte";
  import HadithContainer from "$lib/components/hadithContainer.svelte";
  import { Breadcrumb, Crumb } from "@brainandbones/skeleton";

  let hadithGroupPromise: Promise<any>[] = [];

  $: {
    hadithGroupPromise = [];
    if (browser) {
      window.localStorage.setItem(
        "storedLanguagesList",
        $selectedLanguagesStore.toString()
      );
    }
    for (const language in $selectedLanguagesStore) {
      let hadith =
        urlPrefix +
        "editions/" +
        $selectedLanguagesStore[language] +
        "-" +
        $page.params.collection +
        "/" +
        $page.params.hadithNumber +
        ".json";
      const hadithPromise = getData(hadith);
      hadithGroupPromise.push(hadithPromise);
    }
  }

  async function getData(url: string) {
    return await fetch(url).then((response) => {
      return response.json();
    });
  }
</script>

<svelte:head>
  {#await Promise.all(hadithGroupPromise)}
    <title
      >{$page.params.collection}:{$page.params.hadithNumber} | HadithHub</title
    >
  {:then data}
    <title
      >{data[0].metadata.name} {$page.params.hadithNumber} | HadithHub</title
    >
  {/await}
</svelte:head>

{#if hadithGroupPromise.length != 0}
  {#await Promise.all(hadithGroupPromise)}
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
          <Crumb href="/{$page.params.collection}">
            {data[0].metadata.name}
          </Crumb>
          <Crumb>
            {data[0].metadata.section[data[0].hadiths[0].reference.book]
              .englishName}
          </Crumb>
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

<style>
  .hadithGroup {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
</style>
