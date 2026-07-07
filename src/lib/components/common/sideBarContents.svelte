<script lang="ts" module>
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import SvgIcon from './svgIcon.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import { languagePromise } from '$lib/functions/utilsV2';
	import { replaceState } from '$app/navigation';

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
					on:click={() => {
						const params = new URLSearchParams(window.location.search);
						let currentLangs = params.get('lang')?.split(',').filter(Boolean) ?? [];
						if (currentLangs.includes(languageObject[0])) {
							currentLangs = currentLangs.filter(l => l !== languageObject[0]);
						} else {
							currentLangs = [...currentLangs, languageObject[0]];
						}
						currentLangs = Array.from(new Set(currentLangs)).filter(Boolean);
						if (currentLangs.length > 0) {
							params.set('lang', currentLangs.join(','));
						} else {
							params.delete('lang');
						}
						const newUrl = `${window.location.pathname}?${params.toString()}`;
						replaceState(newUrl, {});
					}}
				>
					<div>{languageObject[1]}</div>
				</ListBoxItem>
			{/each}
		</ListBox>
	{:catch data}
		Error...Could Not Load Data
	{/await}
</aside>
