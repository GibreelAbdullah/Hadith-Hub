<script lang=ts>
	import Topbar from "../../../common/topbarOld.svelte";
	import { page } from "$app/stores";
	import HadithContainer from "../../../components/hadithContainer.svelte";
	import {selectedLanguagesStore} from '../../+layout.svelte';

	let allHadithPromises: any[] = [];
	async function getData(url: string) {
		console.log(url);
		return await fetch(url).then((response) => response.json());
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
		allHadithPromises.push(hadithPromise)
	}


</script>

<Topbar />

<main>
	{#await Promise.all(allHadithPromises)}
		<HadithContainer allHadiths={["Loading..."]} />
	{:then data}
		<HadithContainer allHadiths={data} />
	{:catch data}
		Error...
	{/await}
</main>
