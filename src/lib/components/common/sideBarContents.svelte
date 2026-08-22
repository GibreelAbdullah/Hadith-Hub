<script lang="ts">
	import SvgIcon from './svgIcon.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import { languagePromise } from '$lib/functions/utilsV2';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { notesStore } from '$lib/functions/notesStore.svelte';
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

	<!-- Notes link -->
	<div class="mt-6 pt-4 border-t border-surface-300-600">
		<div class="text-primary-500 font-bold uppercase mb-2">Notes</div>
		<a
			href="{base}/notes?lang={languageStore.value.toString()}"
			class="flex items-center gap-2 px-3 py-2 rounded-md hover:preset-tonal-primary transition-colors text-sm"
		>
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
				<polyline points="14 2 14 8 20 8"></polyline>
				<line x1="16" y1="13" x2="8" y2="13"></line>
				<line x1="16" y1="17" x2="8" y2="17"></line>
			</svg>
			<span>My Notes</span>
			{#if notesStore.count > 0}
				<span class="ml-auto badge preset-filled-warning-500 text-xs px-1.5 py-0.5 rounded-full">{notesStore.count}</span>
			{/if}
		</a>
	</div>
</aside>
