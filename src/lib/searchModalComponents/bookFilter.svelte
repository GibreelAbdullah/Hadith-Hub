<!-- <script lang="ts" context="module">
	import { AccordionItem, ListBox, ListBoxItem } from "@skeletonlabs/skeleton";
	import { collectionsUrl, urlPrefix } from "$lib/common/constants";
	import { getData } from "$lib/common/utils";
	import { writable, type Writable } from "svelte/store";
	import { browser } from "$app/environment";

	const collections = `${urlPrefix}${collectionsUrl}`;

	let collectionPromise = getData(collections);

	let selectedcollectionsSearchStore: Writable<Array<string>> = writable(
		browser
			? window.localStorage.getItem('storedcollectionsList')?.split(',') ?? ['ara', 'eng']
			: ['ara', 'eng']
	);

	export { selectedcollectionsSearchStore };
</script>


{#await collectionPromise}
	<div class="text-primary-500 font-bold uppercase">collections</div>
	<div class="text-sm">
		<div class="placeholder animate-pulse w-32" />
	</div>
{:then data}
	<AccordionItem>
		<svelte:fragment slot="summary">
			<div class="text-primary-500 font-bold uppercase">collections</div>
			<div class="text-sm">
				{getSelectedcollections(data, $selectedcollectionsSearchStore)}
			</div>
		</svelte:fragment>

		<svelte:fragment slot="content">
			<ListBox
				multiple
				active="variant-filled-primary"
				hover="hover:variant-soft-primary"
				class="p-4"
			>
				{#each Object.keys(data) as collectionObject}
					<ListBoxItem
						bind:group={$selectedcollectionsSearchStore}
						name={data[collectionObject]['Prefix']}
						value={data[collectionObject]['Prefix']}
					>
						<div class="max-h-4 pb-5">{data[collectionObject]['Name']}</div>
					</ListBoxItem>
				{/each}
			</ListBox>
		</svelte:fragment>
	</AccordionItem>
{:catch data}
	Error...Could Not Load Data
{/await} -->
