<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import LanguageFilter from '$lib/searchModalComponents/languageFilter.svelte';
	import { selectedLanguagesSearchStore } from '$lib/searchModalComponents/languageFilter.svelte';
	import CollectionFilter, {
		selectedCollectionsSearchStore
	} from '$lib/searchModalComponents/collectionFilter.svelte';

	const modalStore = getModalStore();

	let searchQuery = $modalStore[0]?.meta?.query || '';

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
		if ($selectedLanguagesSearchStore) {
			params.set('language', $selectedLanguagesSearchStore);
		}
		if ($selectedCollectionsSearchStore.length) {
			params.set('collection', $selectedCollectionsSearchStore.join(','));
		}
		modalStore.close();
		goto(`${base}/search?${params.toString()}`);
	}
</script>

<div
	class="modal-search card bg-surface-100/60 dark:bg-surface-500/30 backdrop-blur-lg overflow-y-auto w-full max-w-[800px] shadow-xl mt-8 mb-auto h-fit"
>
	<!-- Header -->
	<header class="bg-surface-300-600-token flex items-center">
		<div class="m-auto bg-transparent border-0 ring-0 focus:ring-0 w-full p-4 text-lg">
			<div class="content-normal flex gap-2">
				<input
					type="search"
					placeholder="Search..."
					bind:value={searchQuery}
					class="input flex-1 pb-1"
					on:keydown={onInputKeyDown}
				/>
				<button class="btn bg-primary-500 text-white text-2xl" on:click={doSearch}>
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

	<div style="clear: both;" />
	<footer
		class="hidden md:flex items-center gap-2 bg-surface-300-600-token p-4 text-xs font-bold"
	>
		<div><kbd>Esc</kbd> to close</div>
		<div><kbd>Enter</kbd> to search</div>
	</footer>
</div>
