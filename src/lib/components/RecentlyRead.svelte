<script lang="ts">
	import { base } from '$app/paths';
	import { recentStore } from '$lib/functions/recentStore.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import { getCollectionDisplayInfo } from '$lib/functions/utilsV2';
	import { settingsStore, getFontStyleForText } from '$lib/functions/settingsStore';
	import { getDirForText } from '$lib/functions/language';

	interface ResolvedEntry {
		href: string;
		label: string; // collection display name
		hadithNum: string;
		lang: string;
		style: string;
		dir: 'rtl' | 'ltr' | 'auto';
	}

	const entries = $derived(recentStore.entries);
	const fontSettings = $derived($settingsStore);
	// Re-resolve whenever entries or the selected language changes.
	const langKey = $derived(languageStore.value.toString());

	let resolved = $state<ResolvedEntry[]>([]);

	$effect(() => {
		// Touch reactive deps so the effect re-runs on change.
		const list = entries;
		const lang = langKey;
		void lang;
		let cancelled = false;

		Promise.all(
			list.map(async (e) => {
				const info = await getCollectionDisplayInfo(e.collectionShortName);
				// Compound hadith numbers (e.g. "107,108") don't exist as a single
				// resolvable hadith — use the first number for both the link and label.
				const hadithNum = e.hadithNum.split(',')[0].trim();
				const href = `${base}/${e.collectionShortName}:${hadithNum}?lang=${languageStore.value.toString()}`;
				return {
					href,
					label: info.name,
					hadithNum,
					lang: info.lang,
					style: getFontStyleForText(info.name, info.lang, fontSettings),
					dir: getDirForText(info.name, info.lang),
				} satisfies ResolvedEntry;
			})
		).then((r) => {
			if (!cancelled) resolved = r;
		});

		return () => {
			cancelled = true;
		};
	});
</script>

{#if resolved.length > 0}
	<section class="max-w-360 m-auto px-4 pt-4" aria-label="Recently read">
		<h2 class="text-sm font-semibold text-surface-600-400 mb-2 px-1">Recently Read</h2>
		<div
			class="flex flex-nowrap overflow-x-auto gap-2 pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:mx-0 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
		>
			{#each resolved as entry}
				<a
					href={entry.href}
					class="btn btn-sm preset-tonal-primary inline-flex items-center gap-1 shrink-0 whitespace-nowrap sm:shrink"
					style={entry.style}
				>
					<span dir={entry.dir}>{entry.label}</span>
					<span dir="ltr">:{entry.hadithNum}</span>
				</a>
			{/each}
		</div>
	</section>
{/if}
