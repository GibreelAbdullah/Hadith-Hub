<script lang="ts">
	import { page } from '$app/stores';
	import { languageStore } from '$lib/functions/store.svelte';
	import { base } from '$app/paths';
	import { settingsStore, getFontStyleForText, detectScript } from '$lib/functions/settingsStore';
	let { bookPromise, bookURL } = $props();

	const RTL_LANGS = ['ar', 'ur'];

	function getLangAtIndex(i: number): string {
		const langs = languageStore.value.length ? languageStore.value : ['ar', 'en'];
		return langs[i] || 'en';
	}

	function getDirForText(text: string, expectedLang: string): string {
		const script = detectScript(text);
		if (script === 'arabic') return 'rtl';
		if (RTL_LANGS.includes(expectedLang) && script !== 'latin') return 'rtl';
		return 'ltr';
	}

	// Deduplicate book name entries - returns unique {text, lang} pairs
	function getUniqueBookNames(data: any[]): { text: string; lang: string }[] {
		const langs = languageStore.value.length ? languageStore.value : ['ar', 'en'];
		const result: { text: string; lang: string }[] = [];
		const seen = new Set<string>();
		for (let i = 0; i < langs.length; i++) {
			const text = data[i + 4] || '';
			if (text && !seen.has(text)) {
				seen.add(text);
				result.push({ text, lang: langs[i] });
			}
		}
		return result;
	}
</script>

{#await bookPromise}
	<div class="sticky top-0 card p-4 !variant-glass-secondary max-w-[90rem] m-auto my-4">
		<div class="grid px-3">
			<ol class="breadcrumb">
				<li class="crumb anchor"><a href="{base}/?lang={languageStore.value.toString()}">Home</a></li>
				<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
				<div class="placeholder w-52 m-auto animate-pulse"></div>
			</ol>
		</div>
	</div>
	{#each { length: 5 } as _, i}
		<div class="card p-4 max-w-[90rem] m-auto my-4">
			<div class="hadithGroup font-medium p-2 grid">
				<div>
					<div class="placeholder animate-pulse"></div>
				</div>

				<div class="text-right ml-10">
					<div class="placeholder animate-pulse"></div>
				</div>
				<div class="hidden md:block text-right">
					<div class="badge">
						<div class="placeholder animate-pulse w-16 m-auto"></div>
					</div>
				</div>
			</div>
			<div class="md:hidden text-center">
				<div class="placeholder animate-pulse w-16 m-auto"></div>
			</div>
		</div>
	{/each}
{:then dataList}
	<div class="max-w-[90rem] m-auto">
		<div class="collection grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 p-4">
			{#each dataList as data}
				{#if data[3] == 'collection'}
					<div class="p-4 lg:col-span-2 2xl:col-span-3">
						<div class="sticky top-0 card p-4 m-auto !variant-glass-secondary max-w-[90rem]">
							<div class="grid px-3">
								<ol class="breadcrumb">
									<li class="crumb anchor"><a href="{base}/{$page.params.home}?lang={languageStore.value.toString()}">Home</a></li>
									<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
									<li class="crumb">{data[4]}</li>
								</ol>
							</div>
						</div>
					</div>
				{:else if data[3] == 'book'}
					<a class="card p-4 text-center relative flex flex-col h-full" href="{base}/{bookURL}/{data[0]}?lang={languageStore.value.toString()}">
						{data[0]}
						<hr />
						{#each getUniqueBookNames(data) as { text, lang }}
							<div dir={getDirForText(text, lang)} lang={lang} style={getFontStyleForText(text, lang, $settingsStore)}>
								{text}
							</div>
						{/each}
						<div class="badge bg-gray-500 mt-auto mx-auto">
							{data[1][0]} to
							{data[1][1]}
						</div>
					</a>
				{/if}
			{/each}
		</div>
	</div>
{:catch data}
	<div class="card p-4 m-4">Error. What you're looking for is not here. Error : {data}</div>
{/await}

<style>
	.hadithGroup {
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	}
</style>
