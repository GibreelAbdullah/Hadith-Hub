<script lang="ts">
	import { page } from "$app/stores";
	import ChapterContainer from "../../components/chapterContainer.svelte";
	import HadithContainer from "../../components/hadithContainer.svelte";
	import { selectedLanguagesStore } from "../../common/sideBarContents.svelte";
	import { browser } from "$app/environment";
	import { urlPrefix } from "../../common/constants.svelte";
	import { Breadcrumb, Crumb } from "@brainandbones/skeleton";

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
					urlPrefix +
					"editions/" +
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
				urlPrefix + "sections/" + $page.params["book"] + ".json";

			collectionPromise = getData(collections);
		}
	}
	async function getData(url: string) {
		return await fetch(url).then((response) => {
			return response.json();
		});
	}
</script>

<main>
	{#if $page.params["book"].includes(":")}
		{#if hadithGroupPromise.length != 0}
			{#await Promise.all(hadithGroupPromise)}
				<div class="card card-body m-4">
					<div class="hadithGroup font-medium p-2 grid">
						<div class="break-words leading-7 m-3">LOADING...</div>
					</div>
				</div>
			{:then data}
				<div class="sticky top-0 card card-body m-4">
					<div class="hadithGroup text-xs grid px-5">
						<Breadcrumb>
							<Crumb href="/">Home</Crumb>
							<Crumb href="/{$page.params['book'].split(':')[0]}">
								{data[0].metadata.name}
							</Crumb>
							<Crumb>
								{data[0].metadata.section[
									data[0].hadiths[0].reference.book
								].englishName}
							</Crumb>
						</Breadcrumb>
					</div>
				</div>
				<HadithContainer
					allHadiths={data}
					book={$page.params["book"].split(":")[0]}
				/>
			{:catch data}
				<div class="card card-body m-4">
					<div class="hadithGroup font-medium p-2 grid">
						<div class="break-words leading-7 m-3">
							Error. Try clearing the cache.
						</div>
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
	{:else}
		<ChapterContainer
			dataPromise={collectionPromise}
			bookURL={$page.params["book"]}
		/>
	{/if}
</main>

<style>
	.hadithGroup {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}
</style>
