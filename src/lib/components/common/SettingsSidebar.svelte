<script lang="ts">
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { browser } from '$app/environment';
	import { languageStore } from '$lib/functions/store.svelte';
	import {
		FONT_OPTIONS, SCRIPT_GROUPS, getScriptGroup, settingsStore, storeTheme,
		updateFontFamily, updateFontSize, loadFont, initFonts, getFontStyle
	} from '$lib/functions/settingsStore';

	// Theme
	const themes = [
		{ type: 'skeleton', name: 'Skeleton', icon: '💀' },
		{ type: 'modern', name: 'Modern', icon: '🤖' },
		{ type: 'rocket', name: 'Rocket', icon: '🚀' },
		{ type: 'seafoam', name: 'Seafoam', icon: '🌊' },
		{ type: 'vintage', name: 'Vintage', icon: '📺' },
		{ type: 'sahara', name: 'Sahara', icon: '🏜️' },
		{ type: 'hamlindigo', name: 'Hamlindigo', icon: '👔' },
		{ type: 'gold-nouveau', name: 'Gold Nouveau', icon: '💫' },
		{ type: 'crimson', name: 'Crimson', icon: '⭕' },
		{ type: 'wintry', name: 'Wintry', icon: '🌨️' }
	];

	function setTheme(type: string) {
		storeTheme.set(type);
		if (browser) document.body.setAttribute('data-theme', type);
	}

	// Get visible script groups based on selected languages
	function getVisibleGroups(): { group: string; label: string; langs: string[] }[] {
		const selectedLangs = languageStore.value;
		const visible: { group: string; label: string; langs: string[] }[] = [];
		const seen = new Set<string>();

		for (const lang of selectedLangs) {
			const group = getScriptGroup(lang);
			if (seen.has(group)) continue;
			seen.add(group);
			const groupLangs = SCRIPT_GROUPS[group].filter(l => selectedLangs.includes(l));
			const label = group === 'arabic' ? 'Arabic / Urdu' :
			              group === 'latin' ? 'Latin (En, Fr, Tr, Id, Ru)' :
			              group === 'bengali' ? 'Bengali' : 'Tamil';
			visible.push({ group, label, langs: groupLangs });
		}

		// Always show Latin since it's the universal fallback language
		if (!seen.has('latin')) {
			visible.push({ group: 'latin', label: 'Latin / Fallback (En, Fr, Tr, Id, Ru)', langs: ['en'] });
		}

		return visible;
	}

	let visibleGroups = getVisibleGroups();

	// Re-run when language changes  
	$: visibleGroups = getVisibleGroups(), languageStore.value;

	function handleFontChange(group: string, event: Event) {
		const family = (event.target as HTMLSelectElement).value;
		loadFont(family);
		updateFontFamily(group, family);
	}

	function handleSizeChange(group: string, event: Event) {
		const size = parseInt((event.target as HTMLInputElement).value);
		updateFontSize(group, size);
	}

	if (browser) initFonts();
</script>

<!-- Settings Content (rendered inside Drawer) -->
<div class="mb-6">
	<h2 class="text-lg font-bold">Settings</h2>
</div>

		<!-- Theme Section -->
		<section class="mb-6">
			<h3 class="text-sm font-bold uppercase text-primary-500 mb-3">Theme</h3>
			<div class="flex items-center justify-between mb-3">
				<span class="text-sm">Dark Mode</span>
				<LightSwitch />
			</div>
			<div class="grid grid-cols-2 gap-2">
				{#each themes as { type, name, icon }}
					<button
						class="btn btn-sm text-left {$storeTheme === type ? 'variant-filled-primary' : 'variant-ghost-surface'}"
						on:click={() => setTheme(type)}
					>
						<span>{icon}</span>
						<span class="text-xs">{name}</span>
					</button>
				{/each}
			</div>
		</section>

		<hr class="my-4 opacity-20" />

		<!-- Font Settings -->
		<section>
			<h3 class="text-sm font-bold uppercase text-primary-500 mb-3">Fonts</h3>
			{#if visibleGroups.length === 0}
				<p class="text-sm opacity-60">Select languages to configure fonts</p>
			{/if}
			{#each visibleGroups as { group, label, langs }}
				<div class="mb-4 p-3 rounded-lg bg-surface-200/50 dark:bg-surface-700/50">
					<div class="text-sm font-medium mb-2">{label}</div>

					<!-- Font Family -->
					<label class="text-xs opacity-70">Font Family</label>
					<select
						class="select select-sm w-full mb-2"
						value={$settingsStore.fonts[group]?.family || ''}
						on:change={(e) => handleFontChange(group, e)}
					>
						{#each FONT_OPTIONS[langs[0]]?.fonts || [] as font}
							<option value={font}>{font}</option>
						{/each}
					</select>

					<!-- Font Size -->
					<label class="text-xs opacity-70">Size: {$settingsStore.fonts[group]?.size || 100}%</label>
					<input
						type="range"
						min="70"
						max="160"
						step="5"
						value={$settingsStore.fonts[group]?.size || 100}
						on:input={(e) => handleSizeChange(group, e)}
						class="w-full"
					/>

					<!-- Preview -->
					<div
						class="mt-2 p-2 rounded bg-surface-100 dark:bg-surface-800 text-sm"
						style={getFontStyle(langs[0], $settingsStore)}
					>
						{#if group === 'arabic'}
							بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
						{:else if group === 'bengali'}
							বিসমিল্লাহির রাহমানির রাহীম
						{:else if group === 'tamil'}
							பிஸ்மில்லாஹிர் ரஹ்மானிர் ரஹீம்
						{:else}
							In the name of Allah, the Most Gracious
						{/if}
					</div>
				</div>
			{/each}
		</section>
