<script lang="ts">
	import { page } from "$app/stores";
	import Topbar from "../../common/topbarOld.svelte";
	import ChapterContainer from "../../components/chapterContainer.svelte";
	import BookLogo from "../../common/bookLogo.svelte";

	const collections =
		"https://raw.githubusercontent.com/GibreelAbdullah/hadith-api/2/sections/" +
		$page.params["book"] +
		".json";

	let collectionPromise = getData(collections);

	async function getData(url: string) {
		console.log(url);
		return await fetch(url).then((response) => {
			return response.json();
		});
		// return Promise.resolve(obj);
	}
</script>

<Topbar />
<BookLogo bookName={$page.params["book"]} />
<!-- <LeftSidePanelScaffold /> -->

<main>
	<ChapterContainer
		dataPromise={collectionPromise}
		bookName={$page.params["book"]}
	/>
</main>
