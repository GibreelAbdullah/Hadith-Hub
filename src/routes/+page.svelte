<script lang="ts">
	import "@brainandbones/skeleton/styles/all.css";
	import BookContainer from "../components/bookContainer.svelte";

	const collections =
		"https://raw.githubusercontent.com/GibreelAbdullah/hadith-api/2/01-Collections/collections.min.json";

	let collectionPromise = getData(collections);

	async function getData(url: string) {
		console.log(url);
		return await fetch(url).then((response) => {
			return response.json();
		});
	}
</script>

<main>
	<BookContainer dataPromise={collectionPromise} />
</main>
