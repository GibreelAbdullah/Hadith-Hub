<script lang="ts">
	import {getModalStore } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import LanguageFilter from '$lib/searchModalComponents/languageFilter.svelte';
	import { selectedLanguagesSearchStore } from '$lib/searchModalComponents/languageFilter.svelte';
	import CollectionFilter, {
		selectedcollectionsSearchStore
	} from '$lib/searchModalComponents/collectionFilter.svelte';
	
	const modalStore = getModalStore();

	const cHeader = 'bg-surface-300-600-token flex items-center';
	// const cSearchInput = '';

	// Elements
	let elemDocSearch: HTMLElement;
	$selectedLanguagesSearchStore = $page.url.searchParams.get('language_code')?.split(',') ??
		window.localStorage.getItem('storedLanguagesList')?.split(',') ?? ['ara', 'eng'];

	$selectedcollectionsSearchStore = $page.url.searchParams.get('collection')?.split(',') ?? [];

	function onInputKeyDown(event: KeyboardEvent): void {
		if (['Enter', 'Done', 'Go', 'Next', 'Previous', 'Search', 'Send'].includes(event.key)) {
			modalStore.close();
		}
	}

	function onSubmit(): void {
		modalStore.close();
	}
</script>

<div
	bind:this={elemDocSearch}
	class="modal-search card bg-surface-100/60 dark:bg-surface-500/30 backdrop-blur-lg overflow-y-auto w-full max-w-[800px] shadow-xl mt-8 mb-auto h-fit"
>
	<!-- Header -->
	<header class="modal-search-header {cHeader}">
		<form
			action="/search"
			method="get"
			class="m-auto bg-transparent border-0 ring-0 focus:ring-0 w-full p-4 text-lg overflow-y-auto"
		>
			<div class="content-normal">
				<input
					type="search"
					placeholder="Search..."
					value={$page.url.searchParams.get('query')}
					class="input !w-[calc(100%-4rem)] pb-1"
					name="query"
					on:keydown={onInputKeyDown}
				/>
				<span class="btn bg-primary-500 h-9 pb-4 float-right cursor-pointer">
					<input type="submit" class="text-4xl h-10 cursor-pointer" on:click|once={onSubmit} value="⌕" />
				</span>
			</div>
			<input type="hidden" name="language_code" value={$selectedLanguagesSearchStore} />
			<input type="hidden" name="collection" value={$selectedcollectionsSearchStore} />
		</form>
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
		class="modal-search-footer hidden md:flex items-center gap-2 bg-surface-300-600-token p-4 text-xs font-bold"
	>
		<div><kbd>Esc</kbd> to close</div>
		<div><kbd>Enter</kbd> to search</div>
	</footer>
</div>
