<script lang="ts" context="module">
    import { browser } from "$app/environment";
    import { ListBox, ListBoxItem } from "@brainandbones/skeleton";
    import { writable, type Writable } from "svelte/store";
    
    async function getData(url: string) {
		console.log(url);
		return await fetch(url).then((response) => {
			return response.json();
		});
	}
	const languages =
		"https://raw.githubusercontent.com/GibreelAbdullah/hadith-api/2/04-Languages/languages.json";

	let languagePromise = getData(languages);

    const storedLanguagesList = browser
		? window.localStorage.getItem("storedLanguagesList") ?? "ara,eng"
		: "ara,eng";

	const selectedLanguagesStore: Writable<Array<string>> = writable(
		storedLanguagesList.split(",")
	);
	console.log(storedLanguagesList);
	export { selectedLanguagesStore };


</script>
<nav class="list-nav">
    <ListBox selected={selectedLanguagesStore} class="text-primary-500 text-sm font-bold uppercase p-4" label="Languages">
        {#await languagePromise}
            LOADING...
        {:then data}
            {#each Object.keys(data) as languageObject}
                <ListBoxItem class= "text-primary-500 text-sm font-normal normal-case p-5" value={data[languageObject]["Prefix"]}>
                    {data[languageObject]["Name"]}
                </ListBoxItem>
            {/each}
        {:catch data}
            Error...Could Not Load Data
        {/await}
    </ListBox>
</nav>