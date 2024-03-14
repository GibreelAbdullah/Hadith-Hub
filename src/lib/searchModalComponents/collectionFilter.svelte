<script lang="ts" context="module">
	import { Accordion, AccordionItem, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { writable, type Writable } from 'svelte/store';
	import { collectionPromise } from '$lib/common/utils';

	let selectedcollectionsSearchStore: Writable<Array<string>> = writable();

	export { selectedcollectionsSearchStore };

	function getSelectedcollections(collections: any[], selectedcollectionsShortName: string[]) {
		let selectedcollections: string = '';
		switch (selectedcollectionsShortName.length) {
			case 0:
				selectedcollections = 'All Collections';
				break;
			default:
				collections.forEach((collectionCategories) => {
					collectionCategories['books'].forEach((collection: { [x: string]: string }) => {
						if (selectedcollectionsShortName.includes(collection['name'])) {
							selectedcollections += collection['eng-name'] + ', ';
						}
					});
				});
				selectedcollections = selectedcollections.substring(0, selectedcollections.length - 2);
				break;
		}
		return selectedcollections;
	}
</script>

{#await collectionPromise}
	<div class="text-primary-500 font-bold uppercase">collections</div>
	<div class="text-sm">
		<div class="placeholder animate-pulse w-32" />
	</div>
{:then data}
	<Accordion>
		<AccordionItem>
			<svelte:fragment slot="summary">
				<div class="text-primary-500 font-bold uppercase">collections</div>
				<div class="text-sm">
					{getSelectedcollections(data.collections, $selectedcollectionsSearchStore)}
				</div>
			</svelte:fragment>

			<svelte:fragment slot="content">
				<ListBox
					multiple
					active="variant-filled-primary"
					hover="hover:variant-soft-primary"
					class="p-4"
				>
					{#each data.collections as collectionCategoriesObject}
						{#each collectionCategoriesObject['books'] as collectionObject}
							<ListBoxItem
								bind:group={$selectedcollectionsSearchStore}
								name={collectionObject['name']}
								value={collectionObject['name']}
							>
								<div class="max-h-4 pb-5">{collectionObject['eng-name']}</div>
							</ListBoxItem>
						{/each}
					{/each}
				</ListBox>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>
{:catch data}
	Error...Could Not Load Data
{/await}
