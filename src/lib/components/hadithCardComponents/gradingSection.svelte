<script lang="ts">
	import { languageStore } from '$lib/functions/store.svelte';
	import { translateGrade, translateScholar, getGradeColor } from '$lib/data/gradeTranslations';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { settingsStore, getFontStyleForText } from '$lib/functions/settingsStore';
	import { getDirForText } from '$lib/functions/language';
	import GradingPopup from './gradingPopup.svelte';
	export let grades: any[];
	export let hadithIndex: string;
	export let collection: string;

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

	function getPopupSettings(index: number): PopupSettings {
		return {
			event: 'click',
			target: `grading-popup-${hadithIndex}-${index}`,
			placement: 'top'
		};
	}

	let popupRefs: Record<string, any> = {};
	$: fontSettings = $settingsStore;
</script>

{#if grades && grades.length}
	<div class="flex flex-wrap justify-center gap-2 p-2">
		{#each grades as grade, i}
			{#if grade[0] != ''}
				{@const lang = languageStore.value[0] || 'en'}
				{#await getTranslated(grade[0], grade[1], lang) then result}
					<button
						class="btn m-1 {result.color} text-black text-wrap max-w-md w-[95%] h-auto py-2 px-3"
						dir={getDirForText(result.displayText, lang)}
						style={getFontStyleForText(result.displayText, lang, fontSettings)}
						use:popup={getPopupSettings(i)}
						on:click={() => popupRefs[`${hadithIndex}-${i}`]?.load()}
					>
						{result.displayText}
					</button>
					<div
						class="card p-0 variant-filled-surface shadow-xl z-50 rounded-lg"
						data-popup="grading-popup-{hadithIndex}-{i}"
					>
						<GradingPopup
							bind:this={popupRefs[`${hadithIndex}-${i}`]}
							muhaddithName={result.scholarName}
							englishName={grade[0]}
							grade={result.gradeText}
							source={grade[2] || ''}
							{collection}
						/>
						<div class="arrow variant-filled-surface"></div>
					</div>
				{/await}
			{/if}
		{/each}
	</div>
{/if}
