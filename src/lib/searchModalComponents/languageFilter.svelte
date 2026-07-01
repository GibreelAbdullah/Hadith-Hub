<script lang="ts" context="module">
	import { Accordion, AccordionItem, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { writable, type Writable } from 'svelte/store';
	import { languagePromise } from '$lib/functions/utilsV2';

	let selectedLanguagesSearchStore: Writable<string> = writable('');

	export { selectedLanguagesSearchStore };

	function getSelectedLanguageName(languages: any[], selected: string): string {
		if (!selected) return 'All Languages';
		const lang = languages.find(l => l[0] === selected);
		return lang ? lang[1] : selected;
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
			<div class="text-primary-500 font-bold uppercase">Language</div>
			<div class="text-sm">
				{getSelectedLanguageName(data, $selectedLanguagesSearchStore)}
			</div>
		</svelte:fragment>

		<svelte:fragment slot="content">
			<ListBox
				active="variant-filled-primary"
				hover="hover:variant-soft-primary"
				class="p-4"
			>
				<ListBoxItem
					bind:group={$selectedLanguagesSearchStore}
					name="all"
					value=""
				>
					<div class="max-h-4 pb-5">All Languages</div>
				</ListBoxItem>
				{#each data as languageObject}
					<ListBoxItem
						bind:group={$selectedLanguagesSearchStore}
						name={languageObject[0]}
						value={languageObject[0]}
					>
						<div class="max-h-4 pb-5">{languageObject[1]}</div>
					</ListBoxItem>
				{/each}
			</ListBox>
		</svelte:fragment>
	</AccordionItem>
</Accordion>
{:catch data}
	Error...Could Not Load Data
{/await}
