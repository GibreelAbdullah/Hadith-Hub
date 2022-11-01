<script lang="ts">
	import { page } from "$app/stores";
	import HadithContainer from "../../../components/hadithContainer.svelte";
	import { selectedLanguagesStore } from "../../../common/sideBarContents.svelte";
	import { browser } from "$app/environment";
    import { urlPrefix } from "../../../common/constants.svelte";

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
			const url =
				urlPrefix+"editions/" +
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
			<div class="card card-body m-4">
				<div class="hadithGroup font-medium p-2 grid">
					<div class="break-words leading-7 m-3">LOADING...</div>
				</div>
			</div>
		{:then data}
			<HadithContainer allHadiths={data} book={$page.params["book"]} />
		{:catch data}
			<div class="card card-body m-4">
				<div class="hadithGroup font-medium p-2 grid">
					<div class="break-words leading-7 m-3">Error. Try clearing the cache.</div>
				</div>
			</div>
		{/await}
	{:else}
		<div class="card card-body m-4">
			<div class="hadithGroup font-medium p-2 grid">
				<div class="break-words leading-7 m-3">
					Select at least 1 language.
				</div>
			</div>
		</div>
	{/if}
</main>
