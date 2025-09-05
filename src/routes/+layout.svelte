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

	initializeStores();
	const drawerStore = getDrawerStore();

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import Footer from '$lib/components/common/footer.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import SideBarContents from '$lib/components/common/sideBarContents.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import Header from '$lib/components/common/Header.svelte';

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

<Drawer open={drawerOpen} position="left">
	<div class="px-4 pt-8"><SideBarContents /></div>
</Drawer>
<Modal />
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4 hidden md:block">
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<SideBarContents />
	</svelte:fragment>
	<!-- <slot /> -->
	<div class="flex flex-col min-h-[95%]">
		<div class="flex-1">
			<slot />
		</div>
		<Footer />
	</div>
</AppShell>
<!-- <SearchBar/> -->