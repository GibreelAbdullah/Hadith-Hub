<script lang="ts">
	import { page } from "$app/stores";
	import ChapterContainer from "../../components/chapterContainer.svelte";
	import HadithContainer from "../../components/hadithContainer.svelte";
	import { selectedLanguagesStore } from "../../common/sideBarContents.svelte";
	import { browser } from "$app/environment";

	let collectionPromise: Promise<any>;
	let hadithGroupPromise: Promise<any>[] = [];

	$: {
		if ($page.params["book"].includes(":")) {
			const bookHadith = $page.params["book"].split(":");
			hadithGroupPromise = [];
			if (browser) {
				window.localStorage.setItem(
					"storedLanguagesList",
					$selectedLanguagesStore.toString()
				);
			}
			for (const language in $selectedLanguagesStore) {
				let hadith =
					"https://raw.githubusercontent.com/GibreelAbdullah/hadith-api/2/editions/" +
					$selectedLanguagesStore[language] +
					"-" +
					bookHadith[0] +
					"/" +
					bookHadith[1] +
					".json";
				const hadithPromise = getData(hadith);
				hadithGroupPromise.push(hadithPromise);
			}
		} else {
			let collections =
				"https://raw.githubusercontent.com/GibreelAbdullah/hadith-api/2/sections/" +
				$page.params["book"] +
				".json";

			collectionPromise = getData(collections);
		}
	}
	async function getData(url: string) {
		console.log(url);
		return await fetch(url).then((response) => {
			return response.json();
		});
	}
</script>

<main>
	{#if $page.params["book"].includes(":")}
		{#if hadithGroupPromise.length != 0}
			{#await Promise.all(hadithGroupPromise)}
				<HadithContainer allHadiths={["Loading..."]} />
			{:then data}
				<HadithContainer
					allHadiths={data}
					book={$page.params["book"].split(":")[0]}
				/>
			{:catch data}
				Error...
			{/await}
		{:else}
			Select at least 1 language.
		{/if}
	{:else}
		<ChapterContainer
			dataPromise={collectionPromise}
			bookName={$page.params["book"]}
		/>
	{/if}
</main>
