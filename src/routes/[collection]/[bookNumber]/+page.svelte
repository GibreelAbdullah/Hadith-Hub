<script lang="ts">
  import { page } from "$app/stores";
  import HadithContainer from "$lib/components/hadithContainer.svelte";
  import {
    selectedLanguagesStore,
  } from "$lib/common/sideBarContents.svelte";
  import { browser } from "$app/environment";
  import { urlPrefix } from "$lib/common/constants";
  import { Breadcrumb, Crumb } from "@skeletonlabs/skeleton";
  import { getBookName, getData } from "$lib/common/utils";

  let title = `Book ${$page.params.bookNumber} - ${$page.params.collection} | HadithHub`;

  ///Some data points (like book name in breadcrumbs) is taken from the first
  ///element of the Promises. But if the first element errors out because the translation
  ///in that language is not available, need to go to the next element to get the data.
  ///variable i will be used to track that
  let i: number = 0;

  let allHadithPromises: { language: string; promise: Promise<any> }[] = [];

  let unavailableBooks: string[] = [];

  ///If the promises are rejected, need to move forward ignoring those promises.
  ///This function will make the value of all rejected promises = null and it
  ///will be removed in the next step
  function allResolvingErrors(
    allHadithPromises: { language: string; promise: Promise<any> }[]
  ) {
    unavailableBooks = [];
    return Promise.all(
      allHadithPromises.map(async function (p, index) {
        return p.promise.catch(function nullifyErroredPromises(error) {
          if (i == index) {
            i++;
            if (i >= allHadithPromises.length) {
              i = -1; //i=-1 when no selected language has data
            }
          }
          unavailableBooks.push(p.language);
          return null;
        });
      })
    );
  }

  $: {
    i=0
    allHadithPromises = [];
    if (browser) {
      window.localStorage.setItem(
        "storedLanguagesList",
        $selectedLanguagesStore.toString()
      );
    }
    for (const language in $selectedLanguagesStore) {
      const url = `${urlPrefix}/editions/${$selectedLanguagesStore[language]}-${$page.params.collection}/sections/${$page.params.bookNumber}.min.json`;
      const hadithPromise = getData(url);
      allHadithPromises.push({
        language: $selectedLanguagesStore[language],
        promise: hadithPromise,
      });
    }
    // if (allHadithPromises.length != 0 && i != -1) {
    //   console.log("i="+i)
    //   allHadithPromises[i].promise.then(
    //     (data: any) =>
    //       (title = `${
    //         data.metadata.section[data.hadiths[i].reference.book]["eng-name"]
    //       } - ${data.metadata.name} | HadithHub`)
    //   );
    // }
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
  <meta property="og:image" content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg" />

  <!-- Twitter Meta Tags -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={$page.url.hostname} />
  <meta property="twitter:url" content={$page.url.toString()} />
  <meta property="twitter:title" content={title} />
  <meta
    property="twitter:description"
    content="A Multi Language collection of Hadith"
  />
  <meta property="twitter:image" content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg" />
</svelte:head>

<main>
  {#if allHadithPromises.length != 0}
    {#await allResolvingErrors(allHadithPromises)}
      <div class="card card-body p-4 m-4">
        <div class="hadithGroup font-medium p-2 grid">
          <div class="break-words leading-7 m-3">LOADING...</div>
        </div>
      </div>
    {:then data}
      {#if i != -1}
        <div class="sticky top-0 card card-body p-4 m-4">
          <div class="hadithGroup text-xs grid px-5">
            <Breadcrumb>
              <Crumb href="/">Home</Crumb>
              <Crumb href="/{$page.params.collection}">
                {data.filter((n) => n)[0].metadata.name}
              </Crumb>
              <Crumb>
                {data.filter((n) => n)[0].metadata.section[data[i].hadiths[0].reference.book][
                  "eng-name"
                ]}
              </Crumb>
            </Breadcrumb>
          </div>
        </div>
      {/if}
      {#if unavailableBooks.length != 0}
        <div class="card card-body p-4 m-4 !bg-red-500">
          <div class="hadithGroup font-medium p-2 grid text-center ">
            {#await getBookName(unavailableBooks)}
              Loading...
            {:then bookNames}
              This book is not available in {bookNames}
            {/await}
          </div>
        </div>
      {/if}
      {#if i != -1}
        <HadithContainer allHadiths={data.filter((n) => n)} book={$page.params.collection} />
      {/if}
    {:catch data}
      <div class="card card-body p-4 m-4">
        <div class="hadithGroup font-medium p-2 grid">
          <div class="break-words leading-7 m-3">
            Error. Try clearing the cache.
          </div>
        </div>
      </div>
    {/await}
  {:else}
    <div class="card card-body p-4 m-4">
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
