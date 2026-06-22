<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import LogoAndDrawer from './LogoAndDrawer.svelte';
	import ThemeButton from './ThemeButton.svelte';
	import SearchBar from './SearchBar.svelte';
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<LogoAndDrawer />
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<SearchBar />
		<ThemeButton />
	</svelte:fragment>
</AppBar>
