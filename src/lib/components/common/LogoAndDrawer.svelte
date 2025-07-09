<script lang="ts">
	import { languageStore } from '$lib/functions/store.svelte';
	import { getDrawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import SvgIcon from './svgIcon.svelte';
	
	const drawerStore = getDrawerStore();
	function drawerOpen(): void {
		const settings: DrawerSettings = { id: 'main' };
		drawerStore.open(settings);
	}
</script>

<button on:click={drawerOpen} class="md:hidden mr-2 p-1 cursor-pointer text-3xl">≡ </button>
<a href="/?lang={languageStore.value.toString()}">
	<span>
		<SvgIcon class="!w-10" name="icon" />
		<SvgIcon class="!w-40 hidden md:inline-block" name="hadithHub" />
	</span>
</a>
