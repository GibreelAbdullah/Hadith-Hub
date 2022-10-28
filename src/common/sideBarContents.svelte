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
    <div class="text-primary-500 text-sm font-bold uppercase px-4 pt-8">Languages</div>
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