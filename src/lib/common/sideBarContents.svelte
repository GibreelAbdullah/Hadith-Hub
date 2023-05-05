<script lang="ts" context="module">
	import { browser } from '$app/environment';
	import { AccordionItem, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { writable, type Writable } from 'svelte/store';
	import { languageUrl, urlPrefix } from './constants';

	const languages = `${urlPrefix}${languageUrl}`;
	const getData = async (url: string) => {
		return await fetch(url).then((response) => {
			return response.json();
		});
	};

	let languagePromise = getData(languages);

	export { languagePromise };

	const storedLanguagesList = browser
		? window.localStorage.getItem('storedLanguagesList') ?? 'ara,eng'
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
		return selectedLanguages;
	}
</script>
{#await languagePromise}
	<div class="text-primary-500 font-bold uppercase">Languages</div>
	<div class="text-sm">
		<div class="placeholder animate-pulse w-32" />
	</div>
{:then data}
	<AccordionItem>
		<svelte:fragment slot="summary">
			<div class="text-primary-500 font-bold uppercase">Languages</div>
			<div class="text-sm">
				{getSelectedLanguages(data, $selectedLanguagesStore)}
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
						bind:group={$selectedLanguagesStore}
						name={data[languageObject]['Prefix']}
						value={data[languageObject]['Prefix']}
					>
						<div class="max-h-4 pb-5">{data[languageObject]['Name']}</div>
					</ListBoxItem>
				{/each}
			</ListBox>
		</svelte:fragment>
	</AccordionItem>
{:catch data}
	Error...Could Not Load Data
{/await}
