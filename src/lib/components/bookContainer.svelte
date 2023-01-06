<script lang="ts">
  import { selectedLanguagesStore } from "$lib/common/sideBarContents.svelte";
  import { getBookName } from "$lib/common/utils";
  export let dataPromise: Promise<any>;

  function getUnavailableBooks(
    availbleBooks: string[],
    selectedLanguages: string[]
  ) {
    let unavailableBooksShortName: string[] = [];
    selectedLanguages.forEach((book) => {
      if (!availbleBooks.includes(book)) unavailableBooksShortName.push(book);
    });
    unavailableBooksShortName = unavailableBooksShortName;
    return getBookName(unavailableBooksShortName);
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
  {#await dataPromise}
    {#each { length: 7 } as _, i}
      <div class="card card-body p-4 h-20 ">
        <div class="placeholder w-40 m-auto animate-pulse my-1" />
        <div class="placeholder w-40 m-auto animate-pulse my-1" />
      </div>
    {/each}
  {:then data}
    {#each data["collections"] as book}
      <a class="card card-body p-4 text-center" href="/{book['name']}">
        {book["eng-name"]}
        <br />
        {book["ara-name"]}
        <br />
        {#await getUnavailableBooks(book["availableLanguages"], $selectedLanguagesStore)}
          <div class="placeholder w-40 m-auto animate-pulse" />
        {:then bookNames}
          {#if bookNames.length != 0}
            <code class="!text-white !bg-red-500"
              >Not available in {bookNames}</code
            >
          {/if}
        {/await}
      </a>
    {/each}
  {:catch data}
    <div class="card card-body p-4 hvr-reveal">Error...Could Not Load Data</div>
  {/await}
</div>
