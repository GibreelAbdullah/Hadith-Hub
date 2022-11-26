<script lang="ts">
  import { page } from "$app/stores";
  import HadithContainer from "$lib/components/hadithContainer.svelte";
  import { selectedLanguagesStore } from "$lib/common/sideBarContents.svelte";
  import { browser } from "$app/environment";
  import { urlPrefix } from "$lib/common/constants";
  import { Breadcrumb, Crumb } from "@brainandbones/skeleton";

  let title = `Book ${$page.params.bookNumber} - ${$page.params.collection} | HadithHub`;

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
      const url = `${urlPrefix}/editions/${$selectedLanguagesStore[language]}-${$page.params.collection}/sections/${$page.params.bookNumber}.min.json`
      const hadithPromise = getData(url);
      allHadithPromises.push(hadithPromise);
    }
    allHadithPromises[0].then(
      (data: any) =>
        (title = `${
          data.metadata.section[data.hadiths[0].reference.book].englishName
        } - ${data.metadata.name} | HadithHub`)
    );
  }
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
