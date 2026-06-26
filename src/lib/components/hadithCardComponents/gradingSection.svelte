<script lang="ts">
	import { languageStore } from '$lib/functions/store.svelte';
	import { translateGrade, translateScholar, getGradeColor } from '$lib/data/gradeTranslations';
	export let grades: any[];
	export let hadithIndex: number;

	const colorMap: Record<string, string> = {
		green: 'bg-green-600/20 text-green-800 dark:text-green-300 border border-green-600/30',
		yellow: 'bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border border-yellow-500/30',
		orange: 'bg-orange-500/20 text-orange-800 dark:text-orange-300 border border-orange-500/30',
		red: 'bg-red-600/20 text-red-800 dark:text-red-300 border border-red-600/30',
		gray: 'bg-surface-500/20 text-surface-800 dark:text-surface-300 border border-surface-500/30',
	};

	function getTranslated(name: string, grade: string, lang: string): Promise<{text: string, color: string}> {
		return Promise.all([translateScholar(name, lang), translateGrade(grade, lang), getGradeColor(grade)])
			.then(([n, g, c]) => ({text: `${n} : ${g}`, color: colorMap[c] || colorMap.gray}));
	}
</script>

{#if grades && grades.length}
<div class="hadithGroup font-medium grid place-items-center">
	{#each grades as grade, i}
		{#if grade[0] != ''}
			{@const lang = languageStore.value[0] || 'en'}
			{#await getTranslated(grade[0], grade[1], lang) then result}
				<span class="badge m-1 text-wrap max-w-md w-[95%] p-2 rounded {result.color}" dir={lang === 'ar' || lang === 'ur' ? 'rtl' : 'ltr'}>
					{result.text}
				</span>
			{/await}
		{/if}
	{/each}
</div>
{/if}
