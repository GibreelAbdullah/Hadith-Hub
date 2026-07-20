<script lang="ts">
	import SvgIcon from './svgIcon.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import { languagePromise } from '$lib/functions/utilsV2';
	import { goto } from '$app/navigation';
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
							let currentLangs = [...languageStore.value];
							if (currentLangs.includes(languageObject[0])) {
								currentLangs = currentLangs.filter(l => l !== languageObject[0]);
							} else {
								currentLangs = [...currentLangs, languageObject[0]];
							}
							currentLangs = Array.from(new Set(currentLangs)).filter(Boolean);
							languageStore.value = currentLangs;
							const params = new URLSearchParams(window.location.search);
							if (currentLangs.length > 0) {
								params.set('lang', currentLangs.join(','));
							} else {
								params.delete('lang');
							}
							goto(`${window.location.pathname}?${params.toString()}`, { replaceState: true, keepFocus: true, noScroll: true });
						}}
					>
						<div>{languageObject[1]}</div>
					</button>
				</li>
			{/each}
		</ul>
	{:catch}
		Error...Could Not Load Data
	{/await}
</aside>
