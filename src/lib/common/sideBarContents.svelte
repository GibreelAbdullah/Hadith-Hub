<script lang="ts" context="module">
  import { browser } from "$app/environment";
  import { LightSwitch, ListBox, ListBoxItem } from "@brainandbones/skeleton";
  import { writable, type Writable } from "svelte/store";
  import { getData } from '$lib/common/utils'

  const languages =
    "https://raw.githubusercontent.com/GibreelAbdullah/hadith-api/3/04-Languages/languages.json";

  let languagePromise = getData(languages);

  const storedLanguagesList = browser
    ? window.localStorage.getItem("storedLanguagesList") ?? "ara,eng"
    : "ara,eng";

  const selectedLanguagesStore: Writable<Array<string>> = writable(
    storedLanguagesList.split(",")
  );
  export { selectedLanguagesStore };
</script>

<nav class="list-nav">
  <div class="text-primary-500 text-sm font-bold uppercase px-4 pt-8">
    Languages
  </div>
  <ListBox selected={selectedLanguagesStore} class="p-4">
    {#await languagePromise}
      LOADING...
    {:then data}
      {#each Object.keys(data) as languageObject}
        <ListBoxItem value={data[languageObject]["Prefix"]}>
          {data[languageObject]["Name"]}
        </ListBoxItem>
      {/each}
    {:catch data}
      Error...Could Not Load Data
    {/await}
  </ListBox>
</nav>
<div class="text-primary-500 text-sm font-bold uppercase px-4 py-8">
  Set Theme <span style="float:right;">
    <LightSwitch />
  </span>
</div>
