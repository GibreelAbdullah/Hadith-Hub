<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import LanguageModal from '$lib/searchModalComponents/languageFilter.svelte';
	import { selectedLanguagesSearchStore } from '$lib/searchModalComponents/languageFilter.svelte';

	const cHeader = 'bg-surface-300-600-token flex items-center';
	const cSearchInput = 'bg-transparent border-0 ring-0 focus:ring-0 w-full p-4 text-lg';

	// Elements
	let elemDocSearch: HTMLElement;

	function onInputKeyDown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			modalStore.close();
		}
	}
</script>

<div
	bind:this={elemDocSearch}
	class="modal-search card bg-surface-100/60 dark:bg-surface-500/30 backdrop-blur-lg overflow-hidden w-full max-w-[800px] shadow-xl mt-8 mb-auto"
>
	<!-- Header -->
	<header class="modal-search-header {cHeader}">
		<span class="text-4xl pl-4 pb-2">⌕</span>
		<form action="/search" method="get" class={cSearchInput}>
			<input
				type="search"
				placeholder="Search..."
				value={$page.url.searchParams.get('q')}
				class="input px-5 pb-1 h-8"
				name="q"
				on:keydown={onInputKeyDown}
			/>
			<input type="hidden" name="lang" value={$selectedLanguagesSearchStore} />
		</form>
	</header>
	<!-- Filters-->
	<div class="p-3">
		<LanguageModal />
	</div>

	<div style="clear: both;" />
	<footer
		class="modal-search-footer hidden md:flex items-center gap-2 bg-surface-300-600-token p-4 text-xs font-bold"
	>
		<div><kbd>Esc</kbd> to close</div>
		<div><kbd>Enter</kbd> to search</div>
	</footer>
</div>
