<script lang="ts" module>
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
		<ul class="p-4 pointer-events-auto space-y-1">
			{#each languageList as languageObject}
				{@const isSelected = languageStore.value.includes(languageObject[0])}
				<li>
					<button
						class="w-full text-left px-3 py-2 rounded-md transition-colors
						{isSelected ? 'preset-filled-primary-500' : 'hover:preset-tonal-primary'}"
						onclick={() => {
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
								languageStore.value = currentLangs;
							} else {
								params.delete('lang');
								languageStore.value = [];
							}
							const newUrl = `${window.location.pathname}?${params.toString()}`;
							replaceState(newUrl, {});
						}}
					>
						<div>{languageObject[1]}</div>
					</button>
				</li>
			{/each}
		</ul>
	{:catch data}
		Error...Could Not Load Data
	{/await}
</aside>
