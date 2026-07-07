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
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import SearchModal from '$lib/components/searchModal.svelte';
	import Footer from '$lib/components/common/footer.svelte';
	import SideBarContents from '$lib/components/common/sideBarContents.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import Header from '$lib/components/common/Header.svelte';
	import SettingsSidebar from '$lib/components/common/SettingsSidebar.svelte';
	import { settingsStore, storeTheme, initFonts, loadFont } from '$lib/functions/settingsStore';

	initializeStores();
	const drawerStore = getDrawerStore();

	const modalComponentRegistry: Record<string, any> = {
		searchModal: { ref: SearchModal }
	};

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// Apply theme immediately on layout init
	if (browser) {
		storeTheme.subscribe((val) => document.body.setAttribute('data-theme', val));
	}

	function openSettings() {
		const s: DrawerSettings = { id: 'settings', position: 'right' };
		drawerStore.open(s);
	}

	onMount(() => {
		// Language from URL
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

		// Close drawer on back button
		drawerStore.subscribe((state) => {
			if (state.open) {
				history.pushState({ drawer: true }, '');
			}
		});
		window.addEventListener('popstate', () => {
			const state = get(drawerStore);
			if (state.open) {
				drawerStore.close();
			}
		});

		// Apply global font styles reactively
		initFonts();
		settingsStore.subscribe((s) => {
			const arabic = s.fonts.arabic || { family: 'Scheherazade New', size: 120 };
			const latin = s.fonts.latin || { family: 'Noto Sans', size: 100 };
			const bengali = s.fonts.bengali || { family: 'Noto Sans Bengali', size: 110 };
			const tamil = s.fonts.tamil || { family: 'Noto Sans Tamil', size: 110 };
			
			const fam = (f: string) => f === 'System Default' ? 'sans-serif' : `'${f}', sans-serif`;
			// Convert percentage to rem (100% = 1rem base)
			const toRem = (size: number) => (size / 100).toFixed(3);
			const lh = (size: number) => (1.75 * size / 100).toFixed(2);
			
			let el = document.getElementById('hadith-font-styles');
			if (!el) {
				el = document.createElement('style');
				el.id = 'hadith-font-styles';
				document.head.appendChild(el);
			}
			el.textContent = `
				body { font-family: ${fam(latin.family)}; font-size: ${toRem(latin.size)}rem; line-height: ${lh(latin.size)}; }
				[dir="rtl"], [lang="ar"], [lang="ur"] { font-family: ${fam(arabic.family)}; font-size: ${toRem(arabic.size)}rem; line-height: ${lh(arabic.size)}; }
				[lang="bn"], .lang-bn { font-family: ${fam(bengali.family)}; font-size: ${toRem(bengali.size)}rem; line-height: ${lh(bengali.size)}; }
				[lang="ta"], .lang-ta { font-family: ${fam(tamil.family)}; font-size: ${toRem(tamil.size)}rem; line-height: ${lh(tamil.size)}; }
			`;
			loadFont(arabic.family);
			loadFont(latin.family);
			loadFont(bengali.family);
			loadFont(tamil.family);
		});
	});
</script>

<Drawer width="w-[80%] max-w-sm">
	{#if $drawerStore.id === 'settings'}
		<div class="px-4 pt-8 overflow-y-auto h-full"><SettingsSidebar /></div>
	{:else}
		<div class="px-4 pt-8"><SideBarContents /></div>
	{/if}
</Drawer>
<Modal components={modalComponentRegistry} />
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4 hidden md:block">
	<svelte:fragment slot="header">
		<Header onSettingsClick={openSettings} />
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
