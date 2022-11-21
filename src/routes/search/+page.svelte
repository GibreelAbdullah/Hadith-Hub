<script lang="ts">
	import { page } from "$app/stores";
	import HadithContainer from "../../components/hadithContainer.svelte";

	async function getData(url: string) {
		return await fetch(url).then((response) => response.json());
	}
	// const url = "https://hadith-search-api-gibreelabdullah.koyeb.app/search" + $page.url.search;
	const url = "http://0.0.0.0:5000/search" + $page.url.search;

	const allHadithPromises = getData(url);

	function formatData(data: [string[]]) {
		let indiHadith: any[] = [];
		console.log("data");
		console.log(data);
		for (const hadithData of data) {
			let hadithDict: any = {};
			hadithDict.hadithnumber = hadithData[0];
			hadithDict.text = hadithData[1];
			let gradings: any[] = [];
			for (const grading of hadithData[2].split(" && ")) {
				gradings.push({
					name: grading.split("::")[0],
					grade: grading.split("::")[1],
				});
			}
			hadithDict.grades = gradings;
			hadithDict.reference = {
				book: hadithData[3],
				hadith: hadithData[4],
			};
			hadithDict.bookName = hadithData[5]
			indiHadith.push(hadithDict);
		}
		console.log({hadiths: indiHadith });
		return {hadiths: indiHadith };
	}
</script>

<main>
	{#await allHadithPromises}
		<div class="card card-body m-4">
			<div class="hadithGroup font-medium p-2 grid">
				<div class="break-words leading-7 m-3">LOADING...</div>
			</div>
		</div>
	{:then data}
		<HadithContainer
			allHadiths={[formatData(data)]}
			book={$page.params["book"]}
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
</main>
