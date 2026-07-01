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
			meta: { query: currentQuery },
		};
		modalStore.trigger(modal);
	}
</script>

<button class="btn hover:variant-soft-primary text-2xl" on:click={openSearch}>
	⌕ <span class="hidden md:inline ml-1 text-base">Search</span>
</button>
