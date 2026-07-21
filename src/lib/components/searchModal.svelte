<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import LanguageFilter from '$lib/searchModalComponents/languageFilter.svelte';
	import { selectedLanguagesSearchStore } from '$lib/searchModalComponents/languageFilter.svelte';
	import CollectionFilter, {
		selectedCollectionsSearchStore
	} from '$lib/searchModalComponents/collectionFilter.svelte';
	import { searchModalState } from '$lib/functions/searchModalState.svelte';
	import { get } from 'svelte/store';

	let searchQuery = $state(searchModalState.query || '');

	function onInputKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			event.preventDefault();
			doSearch();
		}
	}

	function doSearch(): void {
		if (!searchQuery.trim()) return;
		const params = new URLSearchParams();
		params.set('text', searchQuery);
		const langs = get(selectedLanguagesSearchStore);
		if (langs) {
			params.set('language', langs);
		}
		const colls = get(selectedCollectionsSearchStore);
		if (colls.length) {
			params.set('collection', colls.join(','));
		}
		searchModalState.close();
		goto(`${base}/search?${params.toString()}`);
	}
</script>

<div
	class="card !bg-surface-100-800 overflow-y-auto w-full max-w-[800px] shadow-xl mt-8 mb-auto h-fit"
>
	<!-- Header -->
	<header class="bg-surface-200-700 flex items-center">
		<div class="m-auto border-0 ring-0 w-full p-4 text-lg">
			<div class="content-normal flex gap-2">
				<input
					type="search"
					placeholder="Search..."
					bind:value={searchQuery}
					class="input flex-1 pb-1"
					onkeydown={onInputKeyDown}
				/>
				<button class="btn preset-filled-primary-500 text-2xl" onclick={doSearch}>
					⌕
				</button>
			</div>
		</div>
	</header>
	<!-- Filters-->
	<div class="p-3 overflow-y-auto">
		<LanguageFilter />
	</div>
	<div class="p-3 overflow-y-auto">
		<CollectionFilter />
	</div>

	<div style="clear: both;"></div>
	<footer
		class="hidden md:flex items-center gap-2 bg-surface-200-700 p-4 text-xs font-bold"
	>
		<div><kbd>Esc</kbd> to close</div>
		<div><kbd>Enter</kbd> to search</div>
	</footer>
</div>
