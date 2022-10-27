<script lang="ts">
	import { page } from "$app/stores";
	import HadithContainer from "../../../components/hadithContainer.svelte";
	import { selectedLanguagesStore } from "../../../common/sideBarContents.svelte";
	import { browser } from "$app/environment";

	let allHadithPromises: any[] = [];
	async function getData(url: string) {
		console.log(url);
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
				"https://cdn.jsdelivr.net/gh/GibreelAbdullah/hadith-api@2/editions/" +
				$selectedLanguagesStore[language] +
				"-" +
				$page.params["book"] +
				"/sections/" +
				$page.params["hadithId"] +
				".min.json";

			const hadithPromise = getData(url);
			allHadithPromises.push(hadithPromise);
		}
	}
</script>

<main>
	{#if allHadithPromises.length != 0}
		{#await Promise.all(allHadithPromises)}
			<HadithContainer allHadiths={["Loading..."]} />
		{:then data}
			<HadithContainer allHadiths={data} />
		{:catch data}
			Error...
		{/await}
	{:else}
		Select at least 1 language.
	{/if}
</main>
