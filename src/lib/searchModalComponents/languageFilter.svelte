<script lang="ts" context="module">
	import { Accordion, AccordionItem, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { writable, type Writable } from 'svelte/store';
	import { languagePromise } from '$lib/common/utils';

	let selectedLanguagesSearchStore: Writable<Array<string>> = writable();

	export { selectedLanguagesSearchStore };

	function getSelectedLanguages(
		data: { Name: string; Prefix: string }[],
		selectedLanguagesShortName: string[]
	) {
		let selectedLanguages: string = '';
		switch (selectedLanguagesShortName.length) {
			case 0:
				selectedLanguages = 'All Languages';
				break;
			default:
				for (let languageObject in data) {
					if (selectedLanguagesShortName.includes(data[languageObject]['Prefix'])) {
						selectedLanguages += data[languageObject]['Name'] + ', ';
					}
				}
				selectedLanguages = selectedLanguages.substring(0, selectedLanguages.length - 2);
				break;
		}
		return selectedLanguages;
	}
</script>

{#await languagePromise}
	<div class="text-primary-500 font-bold uppercase">Languages</div>
	<div class="text-sm">
		<div class="placeholder animate-pulse w-32" />
	</div>
{:then data}
<Accordion>
	<AccordionItem>
		<svelte:fragment slot="summary">
			<div class="text-primary-500 font-bold uppercase">Languages</div>
			<div class="text-sm">
				{getSelectedLanguages(data, $selectedLanguagesSearchStore)}
			</div>
		</svelte:fragment>

		<svelte:fragment slot="content">
			<ListBox
				multiple
				active="variant-filled-primary"
				hover="hover:variant-soft-primary"
				class="p-4"
			>
				{#each Object.keys(data) as languageObject}
					<ListBoxItem
						bind:group={$selectedLanguagesSearchStore}
						name={data[languageObject]['Prefix']}
						value={data[languageObject]['Prefix']}
					>
						<div class="max-h-4 pb-5">{data[languageObject]['Name']}</div>
					</ListBoxItem>
				{/each}
			</ListBox>
		</svelte:fragment>
	</AccordionItem>
</Accordion>
{:catch data}
	Error...Could Not Load Data
{/await}
