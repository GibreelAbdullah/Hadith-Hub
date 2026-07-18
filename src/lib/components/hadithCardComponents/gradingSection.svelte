<script lang="ts">
	import { languageStore } from '$lib/functions/store.svelte';
	import { translateGrade, translateScholar, getGradeColor } from '$lib/data/gradeTranslations';
	import { settingsStore, getFontStyleForText } from '$lib/functions/settingsStore';
	import { getDirForText } from '$lib/functions/language';
	import GradingPopup from './gradingPopup.svelte';
	import { get } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		grades: any[];
		hadithIndex: string;
		collection: string;
	}

	let { grades, hadithIndex, collection }: Props = $props();

	const colorMap: Record<string, string> = {
		green: 'bg-emerald-500',
		yellow: 'bg-yellow-500',
		orange: 'bg-orange-500',
		red: 'bg-red-500',
		gray: 'bg-surface-500'
	};

	function getTranslated(
		name: string,
		grade: string,
		lang: string
	): Promise<{ scholarName: string; gradeText: string; displayText: string; color: string }> {
		return Promise.all([
			translateScholar(name, lang),
			translateGrade(grade, lang),
			getGradeColor(grade)
		]).then(([n, g, c]) => ({
			scholarName: n,
			gradeText: g,
			displayText: `${n} : ${g}`,
			color: colorMap[c] || colorMap.gray
		}));
	}

	let openPopup = $state<string | null>(null);
	let fontSettings = $state(get(settingsStore));
	settingsStore.subscribe(v => fontSettings = v);

	let containerEl: HTMLDivElement;

	function togglePopup(key: string, event: MouseEvent) {
		event.stopPropagation();
		if (openPopup === key) {
			openPopup = null;
		} else {
			openPopup = key;
		}
	}

	// Close popup on outside click
	function handleOutsideClick(event: MouseEvent) {
		if (openPopup && containerEl && !containerEl.contains(event.target as Node)) {
			openPopup = null;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleOutsideClick);
	});

	onDestroy(() => {
		document.removeEventListener('click', handleOutsideClick);
	});
</script>

{#if grades && grades.length}
	<div class="flex flex-wrap justify-center gap-2 p-2" bind:this={containerEl}>
		{#each grades as grade, i}
			{#if grade[0] != ''}
				{@const lang = languageStore.value[0] || 'en'}
				{@const popupKey = `${hadithIndex}-${i}`}
				{#await getTranslated(grade[0], grade[1], lang) then result}
					<div class="relative w-full min-w-[200px] max-w-md">
						<button
							class="btn m-1 {result.color} text-white w-full h-12 py-2 px-3 text-sm truncate"
							dir={getDirForText(result.displayText, lang)}
							style={getFontStyleForText(result.displayText, lang, fontSettings)}
							onclick={(e) => togglePopup(popupKey, e)}
						>
							{result.displayText}
						</button>
						{#if openPopup === popupKey}
							<div
								class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 card preset-filled-surface-500 shadow-xl z-50 rounded-lg"
							>
								<GradingPopup
									muhaddithName={result.scholarName}
									englishName={grade[0]}
									grade={result.gradeText}
									source={grade[2] || ''}
									{collection}
								/>
							</div>
						{/if}
					</div>
				{/await}
			{/if}
		{/each}
	</div>
{/if}
