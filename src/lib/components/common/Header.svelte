<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import LogoAndDrawer from './LogoAndDrawer.svelte';
	import SearchBar from './SearchBar.svelte';

	interface Props {
		onSettingsClick?: () => void;
	}

	let { onSettingsClick = () => {} }: Props = $props();
</script>

<AppBar class="z-50 sticky top-0 border-b border-surface-200-800 bg-transparent  flex">
	<AppBar.Toolbar class="grid-cols-[auto_1fr_auto]">
		<AppBar.Lead class="flex items-center">
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
