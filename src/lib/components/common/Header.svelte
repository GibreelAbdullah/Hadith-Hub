<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import LogoAndDrawer from './LogoAndDrawer.svelte';
	import SearchBar from './SearchBar.svelte';

	interface Props {
		onSettingsClick?: () => void;
	}

	let { onSettingsClick = () => {} }: Props = $props();
</script>

<AppBar>
	<AppBar.Toolbar class="grid-cols-[auto_1fr_auto]">
		<AppBar.Lead>
			<LogoAndDrawer />
			<SearchBar />
		</AppBar.Lead>
		<AppBar.Headline />
		<AppBar.Trail>
			<button
				class="btn-icon hover:preset-tonal text-2xl"
				onclick={onSettingsClick}
				title="Settings"
			>
				⚙
			</button>
		</AppBar.Trail>
	</AppBar.Toolbar>
</AppBar>
