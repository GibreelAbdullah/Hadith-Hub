<script lang="ts">
	import { base } from '$app/paths';
	import { languageStore } from '$lib/functions/store.svelte';
	import { drawerState } from '$lib/functions/drawerState.svelte';
	import SvgIcon from './svgIcon.svelte';

	function drawerOpen(): void {
		drawerState.open('main', 'left');
	}
</script>

<button onclick={drawerOpen} class="md:hidden mr-2 p-1 cursor-pointer text-3xl">≡ </button>
<a href="{base}/?lang={languageStore.value.toString()}">
	<span>
		<SvgIcon class="!w-10" name="icon" />
		<SvgIcon class="!w-40 hidden md:inline-block" name="hadithHub" />
	</span>
</a>
