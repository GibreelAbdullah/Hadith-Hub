<script lang=ts>
	import "@brainandbones/skeleton/styles/all.css";
	import { AppBar, AppShell } from "@brainandbones/skeleton";
	import TopBar from "../common/shell.svelte";
	import BookContainer from "../components/bookContainer.svelte";
	import "../common/global.css";
    import Shell from "../common/shell.svelte";
	// import LeftSidePanelScaffold from '../../../common/leftSidePanelScaffold.svelte';
	// import {obj} from '../../../common/constants.svelte';

	const collections =
		"https://raw.githubusercontent.com/GibreelAbdullah/hadith-api/2/01-Collections/collections.min.json";

	let collectionPromise = getData(collections);

	async function getData(url: string) {
		console.log(url);
		return await fetch(url).then((response) => {
			return response.json();
		});
		// return Promise.resolve(obj);
	}
</script>

<main>
	<BookContainer dataPromise={collectionPromise} />
</main>

