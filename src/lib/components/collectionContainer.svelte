<script lang="ts">
	import { base } from '$app/paths';
	let {collectionPromise} = $props()
	import { languageStore } from '$lib/functions/store.svelte';
	import { getLanguageFullName } from '$lib/functions/utilsV2';
	import { RTL_LANGS, getSelectedLanguages } from '$lib/functions/language';
	
	function getUnavailableCollections(availbleLanguagesOfCollection: string[], selectedLanguagesStore: string[]) {
		const unavailableLanguagesShortName = selectedLanguagesStore.filter(
			(language) => !availbleLanguagesOfCollection.includes(language)
		);
		return getLanguageFullName(unavailableLanguagesShortName);
	}

	function getCollectionNames(coll: any): { name: string; lang: string }[] {
		const langs = getSelectedLanguages();
		const names: { name: string; lang: string }[] = [];
		const seen = new Set();
		for (const l of langs) {
			const name = coll[l];
			if (name && !seen.has(name)) {
				seen.add(name);
				names.push({ name, lang: l });
			}
		}
		if (names.length === 0) {
			const fallback = coll["en"] || coll["ar"] || coll.short_name;
			names.push({ name: fallback, lang: coll["en"] ? 'en' : 'ar' });
		}
		return names;
	}

	function filterCollections() {
		var input, filter, cards, i, txtValue;
		input = <HTMLInputElement>document.getElementById('filterCollections');
		filter = input.value.toUpperCase();
		const collectionlist = document.getElementById('collectionlist');
		if (collectionlist != null) {
			cards = collectionlist.querySelectorAll<HTMLElement>('.collection-card');
			for (i = 0; i < cards.length; i++) {
				txtValue = cards[i].textContent || cards[i].innerText;
				cards[i].style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
			}
		}
	}

	function getCategoryName(category: any): { name: string; lang: string } {
		const lang = languageStore.value[0] || 'en';
		const name = category.name[lang] || category.name['en'] || category.name['ar'] || '';
		const actualLang = category.name[lang] ? lang : (category.name['en'] ? 'en' : 'ar');
		return { name, lang: actualLang };
	}
</script>

<input
	class="input max-w-max mx-auto mt-4 block"
	type="text"
	id="filterCollections"
	onkeyup={filterCollections}
	placeholder="Filter Collections..."
/>
{#await collectionPromise}
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 max-w-[90rem] m-auto">
		{#each { length: 7 } as _, i}
			<div class="card p-4 h-20">
				<div class="placeholder w-40 m-auto animate-pulse my-1"></div>
				<div class="placeholder w-40 m-auto animate-pulse my-1"></div>
			</div>
		{/each}
	</div>
{:then result}
	<div id="collectionlist" class="max-w-[90rem] m-auto">
		{#each result.categories as category}
			{@const categoryCollections = result.collections.filter((c) => category.collections.includes(c.short_name))}
			{@const catName = getCategoryName(category)}
			{#if categoryCollections.length > 0}
				<div class="px-4 pt-6 pb-2">
					<h2 class="text-lg font-bold text-primary-600 dark:text-primary-400" dir={RTL_LANGS.includes(catName.lang) ? 'rtl' : 'ltr'} lang={catName.lang}>{catName.name}</h2>
				</div>
				<div class="collection grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 px-4 pb-4">
					{#each categoryCollections as coll}
						<a class="collection-card card p-4 text-center relative" href="{base}/{coll.short_name}?lang={languageStore.value.toString()}">
							{#each getCollectionNames(coll) as { name, lang }}
								<span dir={RTL_LANGS.includes(lang) ? 'rtl' : 'ltr'} lang={lang}>{name}</span><br />
							{/each}
							{#await getUnavailableCollections(coll.languages || ["ar","en"], languageStore.value)}
								<div class="placeholder w-40 m-auto animate-pulse"></div>
							{:then collectionNames}
								{#if collectionNames.length != 0}
									<code class="break-words !text-error-500">Not available in {collectionNames}</code>
								{/if}
							{/await}
						</a>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
{:catch error}
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
		<div class="card p-4 hvr-reveal">Error...Could Not Load Data</div>
	</div>
{/await}
