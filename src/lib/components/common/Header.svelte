<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import LogoAndDrawer from './LogoAndDrawer.svelte';
	import SearchBar from './SearchBar.svelte';

	export let onSettingsClick: () => void = () => {};
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<LogoAndDrawer />
		<SearchBar />
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<button
			class="btn hover:variant-soft-primary text-2xl"
			on:click={onSettingsClick}
			title="Settings"
		>
			⚙
		</button>
	</svelte:fragment>
</AppBar>
