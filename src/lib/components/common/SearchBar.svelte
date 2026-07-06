<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	const modalStore = getModalStore();

	function openSearch() {
		const currentQuery = new URL(window.location.href).searchParams.get('text') || '';
		const modal: ModalSettings = {
			type: 'component',
			component: 'searchModal',
			meta: { query: currentQuery }
		};
		modalStore.trigger(modal);
	}
</script>

<button class="btn variant-soft hover:variant-soft-primary h-10 mx-4" on:click={openSearch}>
	<span class="text-3xl p-0">⌕</span>
	<span class="text-sm hidden md:inline-block badge">Search</span>
</button>
