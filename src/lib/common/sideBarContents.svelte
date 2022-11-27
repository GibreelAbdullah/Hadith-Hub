<script lang="ts" context="module">
  import { browser } from "$app/environment";
  import {
    AccordionItem,
    LightSwitch,
    ListBox,
    ListBoxItem,
  } from "@brainandbones/skeleton";
  import { writable, type Writable } from "svelte/store";
  import { getData } from "$lib/common/utils";

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

  function getSelectedLanguages(data:any, selectedLanguagesShortName:string[]){
    let selectedLanguages:string = ''
    switch(selectedLanguagesShortName.length) {
      case 0:
        selectedLanguages = 'No Language Selected'
        break
      case 1:
      case 2:
      case 3:
        for (let languageObject in data){
          if(selectedLanguagesShortName.includes(data[languageObject]["Prefix"])){
            selectedLanguages += data[languageObject]["Name"] + ', '
          }
        }
        selectedLanguages = selectedLanguages.substring(0, selectedLanguages.length-2)
        break
      default:
        selectedLanguages = selectedLanguagesShortName.length + ' languages selected'
    }
    return (selectedLanguages)
  }
</script>

{#await languagePromise}
  LOADING...
{:then data}
  <AccordionItem>
    <svelte:fragment slot="summary">
      <div class="text-primary-500 font-bold uppercase">Languages</div>
      <div class="text-sm">{getSelectedLanguages(data, $selectedLanguagesStore)}</div>
    </svelte:fragment>

    <svelte:fragment slot="content">
      <ListBox selected={selectedLanguagesStore} class="p-4">
        {#each Object.keys(data) as languageObject}
          <ListBoxItem value={data[languageObject]["Prefix"]}>
            {data[languageObject]["Name"]}
          </ListBoxItem>
        {/each}
      </ListBox>
    </svelte:fragment>
  </AccordionItem>
{:catch data}
  Error...Could Not Load Data
{/await}

<div class="text-primary-500 text-sm font-bold uppercase py-8">
  Set Theme <span style="float:right;">
    <LightSwitch />
  </span>
</div>
