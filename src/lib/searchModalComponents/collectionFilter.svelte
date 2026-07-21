<script lang="ts" module>
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

<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import { get } from 'svelte/store';

	let selected = $state<string[]>(get(selectedCollectionsSearchStore));
	selectedCollectionsSearchStore.subscribe(v => selected = v);

	function toggleCollection(shortName: string) {
		if (selected.includes(shortName)) {
			selected = selected.filter(s => s !== shortName);
		} else {
			selected = [...selected, shortName];
		}
		selectedCollectionsSearchStore.set(selected);
	}
</script>

{#await getCollectionPromise()}
	<div class="text-primary-500 font-bold uppercase">Collections</div>
	<div class="text-sm">
		<div class="placeholder animate-pulse w-32"></div>
	</div>
{:then data}
	<Accordion collapsible>
		<Accordion.Item value="collections">
			<Accordion.ItemTrigger class="flex items-center justify-between w-full">
				<div>
					<div class="text-primary-500 font-bold uppercase">Collections</div>
					<div class="text-sm">
						{getSelectedCollectionNames(data.collections, selected)}
					</div>
				</div>
				<Accordion.ItemIndicator class="group">
					<span class="transition group-data-[state=open]:rotate-180 inline-block">▼</span>
				</Accordion.ItemIndicator>
			</Accordion.ItemTrigger>
			<Accordion.ItemContent>
				<ul class="p-4 space-y-1">
					{#each data.collections as coll}
						<li>
							<button
								class="w-full text-left px-3 py-2 rounded-md transition-colors
								{selected.includes(coll.short_name) ? 'preset-filled-primary-500' : 'hover:preset-tonal-primary'}"
								onclick={() => toggleCollection(coll.short_name)}
							>
								<div class="max-h-4 pb-5">{coll.en || coll.ar || coll.short_name}</div>
							</button>
						</li>
					{/each}
				</ul>
			</Accordion.ItemContent>
		</Accordion.Item>
	</Accordion>
{:catch}
	Error...Could Not Load Data
{/await}
