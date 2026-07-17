<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { pushState, replaceState } from '$app/navigation';
	import Footer from '$lib/components/common/footer.svelte';
	import SideBarContents from '$lib/components/common/sideBarContents.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import Header from '$lib/components/common/Header.svelte';
	import SettingsSidebar from '$lib/components/common/SettingsSidebar.svelte';
	import { settingsStore, storeTheme, initFonts, loadFont } from '$lib/functions/settingsStore';
	import { drawerState } from '$lib/functions/drawerState.svelte';
	import { searchModalState } from '$lib/functions/searchModalState.svelte';
	import SearchModal from '$lib/components/searchModal.svelte';

	// Apply theme immediately on layout init
	if (browser) {
		storeTheme.subscribe((val) => document.documentElement.setAttribute('data-theme', val));
	}

	function openSettings() {
		drawerState.open('settings', 'right');
	}

	function closeDrawer() {
		drawerState.close();
	}

	onMount(() => {
		// Language from URL
		const url = new URL(window.location.href);
		if (!url.searchParams.has('lang')) {
			url.searchParams.set('lang', languageStore.value.toString());
			replaceState(url.toString(), {});
		} else {
			const langParam = url.searchParams.get('lang');
			if (langParam) {
				languageStore.value = langParam.split(',');
			}
		}

		// Close drawer on back button
		window.addEventListener('popstate', () => {
			if (drawerState.isOpen) {
				drawerState.close();
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

<!-- Drawer Overlay -->
{#if drawerState.isOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 bg-black/50 z-40 transition-opacity"
		onkeydown={(e) => { if (e.key === 'Escape') closeDrawer(); }}
		onclick={closeDrawer}
	></div>
	<aside
		class="fixed top-0 z-50 h-full w-[80%] max-w-sm bg-surface-50-950 shadow-xl transition-transform duration-300 overflow-y-auto
		{drawerState.position === 'right' ? 'right-0' : 'left-0'}"
	>
		{#if drawerState.id === 'settings'}
			<div class="px-4 pt-8 overflow-y-auto h-full"><SettingsSidebar /></div>
		{:else}
			<div class="px-4 pt-8"><SideBarContents /></div>
		{/if}
	</aside>
{/if}

<!-- Search Modal -->
{#if searchModalState.isOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
		onkeydown={(e) => { if (e.key === 'Escape') searchModalState.close(); }}
		onclick={(e) => { if (e.target === e.currentTarget) searchModalState.close(); }}
	>
		<SearchModal />
	</div>
{/if}

<!-- App Layout (replaces AppShell) -->
<div class="h-full overflow-hidden flex flex-col">
	<!-- Header -->
	<Header onSettingsClick={openSettings} />

	<!-- Body with sidebar + content -->
	<div class="flex-1 flex overflow-hidden">
		<!-- Sidebar (desktop only) -->
		<aside class="bg-surface-50-950 w-56 p-4 hidden md:block overflow-y-auto">
			<SideBarContents />
		</aside>

		<!-- Main content -->
		<main class="flex-1 overflow-y-auto">
			<div class="flex flex-col min-h-[95%]">
				<div class="flex-1">
					<slot />
				</div>
				<Footer />
			</div>
		</main>
	</div>
</div>
