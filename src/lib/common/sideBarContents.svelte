<script lang="ts" context="module">
	import { browser } from '$app/environment';
	import { AccordionItem, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { writable, type Writable } from 'svelte/store';
	import SvgIcon from './svgIcon.svelte';
	import { languagePromise } from './utils';

	const storedLanguagesList = browser
		? (window.localStorage.getItem('storedLanguagesList') ?? 'ara,eng')
		: 'ara,eng';

	const selectedLanguagesStore: Writable<Array<string>> = writable(storedLanguagesList.split(','));
	export { selectedLanguagesStore };

	function getSelectedLanguages(
		data: { Name: string; Prefix: string }[],
		selectedLanguagesShortName: string[]
	) {
		let selectedLanguages: string = '';
		switch (selectedLanguagesShortName.length) {
			case 0:
				selectedLanguages = 'No Language Selected';
				break;
			case 1:
			case 2:
			case 3:
				for (let languageObject in data) {
					if (selectedLanguagesShortName.includes(data[languageObject]['Prefix'])) {
						selectedLanguages += data[languageObject]['Name'] + ', ';
					}
				}
				selectedLanguages = selectedLanguages.substring(0, selectedLanguages.length - 2);
				break;
			default:
				selectedLanguages = selectedLanguagesShortName.length + ' languages selected';
		}
		if (browser) {
			window.localStorage.setItem('storedLanguagesList', selectedLanguagesShortName.toString());
		}
		return selectedLanguages;
	}
</script>

<aside>
	{#await languagePromise}
		<div class="text-primary-500 font-bold uppercase">Languages</div>
		<div class="text-sm">
			<div class="placeholder animate-pulse w-32" />
		</div>
	{:then data}
		<span class="md:hidden">
			<SvgIcon class="!w-10" name="icon" />
			<SvgIcon class="!w-40" name="hadithHub" />
		</span>

		<div class="text-primary-500 font-bold uppercase pt-4">Languages</div>
		<div class="text-sm">
			{getSelectedLanguages(data, $selectedLanguagesStore)}
		</div>

		<ListBox
			multiple
			active="variant-filled-primary"
			hover="hover:variant-soft-primary"
			class="p-4 pointer-events-auto"
		>
			{#each Object.keys(data) as languageObject}
				<ListBoxItem
					bind:group={$selectedLanguagesStore}
					name={data[languageObject]['Prefix']}
					value={data[languageObject]['Prefix']}
				>
					<div class="max-h-4 pb-5">{data[languageObject]['Name']}</div>
				</ListBoxItem>
			{/each}
		</ListBox>
	{:catch data}
		Error...Could Not Load Data
	{/await}
</aside>
