<script lang="ts">
	import { searchModalState } from '$lib/functions/searchModalState.svelte';

	function openSearch() {
		const currentQuery = new URL(window.location.href).searchParams.get('text') || '';
		searchModalState.open(currentQuery);
	}
</script>

<button class="btn preset-tonal hover:preset-tonal-primary h-10 mx-4 items-center" onclick={openSearch}>
	<span class="text-3xl leading-none" >⌕</span>
	<span class="text-sm hidden md:inline-block badge">Search</span>
</button>
