<script lang="ts">
	import '../app.postcss';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import {
		initializeStores,
		AppShell,
		Drawer,
		type DrawerSettings,
		getDrawerStore,
		storePopup,
		Modal
	} from '@skeletonlabs/skeleton';
	import SearchModal from '$lib/components/searchModal.svelte';

	initializeStores();
	const drawerStore = getDrawerStore();

	const modalComponentRegistry: Record<string, any> = {
		searchModal: { ref: SearchModal }
	};

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import Footer from '$lib/components/common/footer.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import SideBarContents from '$lib/components/common/sideBarContents.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import Header from '$lib/components/common/Header.svelte';
	import SettingsSidebar from '$lib/components/common/SettingsSidebar.svelte';

	function drawerOpen(): void {
		const settings: DrawerSettings = { id: 'main' };
		drawerStore.open(settings);
	}
	onMount(() => {
		if (browser) {
			const url = new URL(window.location.href);
			if (!url.searchParams.has('lang')) {
				url.searchParams.set('lang', languageStore.value.toString());
				window.location.href = url.toString();
			} else {
				const langParam = url.searchParams.get('lang');
				if (langParam) {
					languageStore.value = langParam.split(',');
				}
			}
		}
	});
</script>

<Drawer width="w-full max-w-sm">
	{#if $drawerStore.id === 'settings'}
		<div class="px-4 pt-8 overflow-y-auto h-full"><SettingsSidebar /></div>
	{:else}
		<div class="px-4 pt-8"><SideBarContents /></div>
	{/if}
</Drawer>
<Modal components={modalComponentRegistry} />
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4 hidden md:block">
	<svelte:fragment slot="header">
		<Header onSettingsClick={() => {
			const settings: DrawerSettings = { id: 'settings', position: 'right' };
			drawerStore.open(settings);
		}} />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<SideBarContents />
	</svelte:fragment>
	<div class="flex flex-col min-h-[95%]">
		<div class="flex-1">
			<slot />
		</div>
		<Footer />
	</div>
</AppShell>
