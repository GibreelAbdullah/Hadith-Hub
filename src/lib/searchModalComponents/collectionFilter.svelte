<script lang="ts" context="module">
	import { Accordion, AccordionItem, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { writable, type Writable } from 'svelte/store';
	import { getCollectionPromise } from '$lib/functions/utilsV2';

	let selectedCollectionsSearchStore: Writable<Array<string>> = writable([]);

	export { selectedCollectionsSearchStore };

	function getSelectedCollectionNames(collections: any[], selected: string[]): string {
		if (!selected.length) return 'All Collections';
		const names = collections
			.filter(c => selected.includes(c.short_name))
			.map(c => c.en || c.ar || c.short_name);
		return names.join(', ');
	}
</script>

{#await getCollectionPromise()}
	<div class="text-primary-500 font-bold uppercase">Collections</div>
	<div class="text-sm">
		<div class="placeholder animate-pulse w-32" />
	</div>
{:then data}
	<Accordion>
		<AccordionItem>
			<svelte:fragment slot="summary">
				<div class="text-primary-500 font-bold uppercase">Collections</div>
				<div class="text-sm">
					{getSelectedCollectionNames(data.collections, $selectedCollectionsSearchStore)}
				</div>
			</svelte:fragment>

			<svelte:fragment slot="content">
				<ListBox
					multiple
					active="variant-filled-primary"
					hover="hover:variant-soft-primary"
					class="p-4"
				>
					{#each data.collections as coll}
						<ListBoxItem
							bind:group={$selectedCollectionsSearchStore}
							name={coll.short_name}
							value={coll.short_name}
						>
							<div class="max-h-4 pb-5">{coll.en || coll.ar || coll.short_name}</div>
						</ListBoxItem>
					{/each}
				</ListBox>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>
{:catch data}
	Error...Could Not Load Data
{/await}
