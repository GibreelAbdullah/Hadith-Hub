<script lang="ts" module>
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

<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import { get } from 'svelte/store';

	let selected = $state(get(selectedLanguagesSearchStore));
	selectedLanguagesSearchStore.subscribe(v => selected = v);

	function select(value: string) {
		selected = value;
		selectedLanguagesSearchStore.set(value);
	}
</script>

{#await languagePromise}
	<div class="text-primary-500 font-bold uppercase">Languages</div>
	<div class="text-sm">
		<div class="placeholder animate-pulse w-32" />
	</div>
{:then data}
<Accordion collapsible>
	<Accordion.Item value="language">
		<Accordion.ItemTrigger class="flex items-center justify-between w-full">
			<div>
				<div class="text-primary-500 font-bold uppercase">Language</div>
				<div class="text-sm">
					{getSelectedLanguageName(data, selected)}
				</div>
			</div>
			<Accordion.ItemIndicator class="group">
				<span class="transition group-data-[state=open]:rotate-180 inline-block">▼</span>
			</Accordion.ItemIndicator>
		</Accordion.ItemTrigger>
		<Accordion.ItemContent>
			<ul class="p-4 space-y-1">
				<li>
					<button
						class="w-full text-left px-3 py-2 rounded-md transition-colors
						{selected === '' ? 'preset-filled-primary-500' : 'hover:preset-tonal-primary'}"
						onclick={() => select('')}
					>
						<div class="max-h-4 pb-5">All Languages</div>
					</button>
				</li>
				{#each data as languageObject}
					<li>
						<button
							class="w-full text-left px-3 py-2 rounded-md transition-colors
							{selected === languageObject[0] ? 'preset-filled-primary-500' : 'hover:preset-tonal-primary'}"
							onclick={() => select(languageObject[0])}
						>
							<div class="max-h-4 pb-5">{languageObject[1]}</div>
						</button>
					</li>
				{/each}
			</ul>
		</Accordion.ItemContent>
	</Accordion.Item>
</Accordion>
{:catch data}
	Error...Could Not Load Data
{/await}
