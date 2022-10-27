<script lang="ts" context="module">
	import "@brainandbones/skeleton/themes/theme-skeleton.css";
	import "@brainandbones/skeleton/styles/all.css";
	import "../app.postcss";
	// import { selectedLanguagesStore } from "../stores";

	import {
		AppShell,
		AppBar,
		GradientHeading,
		LightSwitch,
		ListBox,
		ListBoxItem,
	} from "@brainandbones/skeleton";
	import { writable, type Writable } from "svelte/store";

	const languages =
		"https://raw.githubusercontent.com/GibreelAbdullah/hadith-api/2/04-Languages/languages.json";

	let languagePromise = getData(languages);

	async function getData(url: string) {
		console.log(url);
		return await fetch(url).then((response) => {
			return response.json();
		});
	}

	const selectedLanguagesStore: Writable<Array<string>> = writable([
		"ara",
		"eng",
		"ben",
	]);
	export { selectedLanguagesStore };
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4 hidden md:block">
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/"
					><GradientHeading
						tag="h1"
						direction="bg-gradient-to-r"
						from="from-primary-500"
						to="to-accent-500">HadithHub</GradientHeading
					></a
				>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<nav class="list-nav">
			<ListBox selected={selectedLanguagesStore} label="Languages">
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
	</svelte:fragment>
	<slot />
</AppShell>
