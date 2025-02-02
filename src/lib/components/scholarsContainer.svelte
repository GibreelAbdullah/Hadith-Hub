<!-- <script lang="ts">
    import { selectedLanguagesStore } from "$lib/common/sideBarContents.svelte";
    import { getLanguageFullName } from "$lib/common/utils";
    export let dataPromise: Promise<any>;
  
    function getUnavailableCollections(
      availbleLanguagesOfCollection: string[],
      selectedLanguages: string[]
    ) {
      let unavailableLanguagesShortName: string[] = [];
      selectedLanguages.forEach((collection) => {
        if (!availbleLanguagesOfCollection.includes(collection)) unavailableLanguagesShortName.push(collection);
      });
      unavailableLanguagesShortName = unavailableLanguagesShortName;
      return getLanguageFullName(unavailableLanguagesShortName);
    }
  </script>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
    {#await dataPromise}
      {#each { length: 7 } as _, i}
        <div class="card p-4 h-20 ">
          <div class="placeholder w-40 m-auto animate-pulse my-1" />
          <div class="placeholder w-40 m-auto animate-pulse my-1" />
        </div>
      {/each}
    {:then data}
      {#each data["collections"] as collection}
        <a class="card p-4 text-center" href="/{collection['name']}">
          {collection["eng-name"]}
          <br />
          {collection["ara-name"]}
          <br />
        </a>
      {/each}
    {:catch data}
      <div class="card p-4 hvr-reveal">Error...Could Not Load Data</div>
    {/await}
  </div>
   -->