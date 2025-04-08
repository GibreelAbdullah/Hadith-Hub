<script lang="ts" module>
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import SvgIcon from './svgIcon.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import { languageQueryString, urlPrefix } from '$lib/data/constantsV2';
	import { getData } from '$lib/functions/utilsV2';

	export const languagePromise = getData(`${urlPrefix}${languageQueryString}`);

	export async function getLanguageFullName(languageShortName: string[]) {
		let languageFullNames: string[] = [];
		let languageObject = await languagePromise;
		languageShortName.forEach((language) => {
			languageFullNames.push(languageObject[language]);
		});
	return languageFullNames;
}

</script>

<aside>	
	<div class="text-primary-500 font-bold uppercase">Languages</div>
	{#await languagePromise}
		<div class="text-sm">
			<div class="placeholder animate-pulse w-32"></div>
		</div>
	{:then languageList}
		<span class="md:hidden">
			<SvgIcon class="!w-10" name="icon" />
			<SvgIcon class="!w-40" name="hadithHub" />
		</span>
		<ListBox
			multiple
			active="variant-filled-primary"
			hover="hover:variant-soft-primary"
			class="p-4 pointer-events-auto"
		>
			{#each languageList as languageObject}
				<ListBoxItem
					bind:group={languageStore.value}
					name={languageObject[0]}
					value={languageObject[0]}
				>
					<div class="max-h-4 pb-5">{languageObject[1]}</div>
				</ListBoxItem>
			{/each}
		</ListBox>
	{:catch data}
		Error...Could Not Load Data
	{/await}
</aside>
