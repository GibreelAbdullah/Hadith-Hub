<script lang="ts">
	import '../app.postcss';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import {
		initializeStores,
		AppShell,
		AppBar,
		Drawer,
		type DrawerSettings,
		type ModalSettings,
		type ModalComponent,
		getDrawerStore,
		localStorageStore,
		LightSwitch,
		storePopup,
		popup,
		Modal,
		getModalStore
	} from '@skeletonlabs/skeleton';

	initializeStores();
	const drawerStore = getDrawerStore();
	const modalStore = getModalStore();
	
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import Footer from '$lib/common/footer.svelte';
	import { browser } from '$app/environment';
	import type { Writable } from 'svelte/store';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import SvgIcon from '$lib/common/svgIcon.svelte';
	import SearchModal from '$lib/components/searchModal.svelte';
	import SideBarContents from '$lib/common/sideBarContents.svelte';

	export const storeTheme: Writable<string> = localStorageStore('storeTheme', 'skeleton');

	const setTheme: SubmitFunction = () => {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				const theme = result.data?.theme as string;
				storeTheme.set(theme);
			}
		};
	};
	const themes = [
		{ type: 'skeleton', name: 'Skeleton', icon: '💀' },
		{ type: 'modern', name: 'Modern', icon: '🤖' },
		{ type: 'rocket', name: 'Rocket', icon: '🚀' },
		{ type: 'seafoam', name: 'Seafoam', icon: '🌊' },
		{ type: 'vintage', name: 'Vintage', icon: '📺' },
		{ type: 'sahara', name: 'Sahara', icon: '🏜️' },
		{ type: 'hamlindigo', name: 'Hamlindigo', icon: '👔' },
		{ type: 'gold-nouveau', name: 'Gold Nouveau', icon: '💫' },
		{ type: 'crimson', name: 'Crimson', icon: '⭕' },
		{ type: 'wintry', name: 'Wintry', icon: '🌨️' }
	];
	
	storeTheme.subscribe(setBodyThemeAttribute);
	function setBodyThemeAttribute(): void {
		if (!browser) return;
		document.body.setAttribute('data-theme', $storeTheme);
	}

	function drawerOpen(): void {
		const settings: DrawerSettings = { id: 'main' };
		drawerStore.open(settings);
	}

	const modalSearch: ModalComponent = {
		// Pass a reference to your custom component
		ref: SearchModal,
		// Add the component properties as key/value pairs
		props: { background: 'bg-red-500' },
		// Provide a template literal for the default component slot
		slot: '<p>Skeleton</p>'
	};
	function triggerSearch(): void {
		const d: ModalSettings = {
			type: 'component',
			component: modalSearch,
			position: 'item-start'
		};
		modalStore.trigger(d);
	}
</script>

<Drawer open={drawerOpen} position="left">
	<div class="px-4 pt-8"><SideBarContents /></div>
</Drawer>
<Modal />
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4 hidden md:block">
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<button on:click={drawerOpen} class="md:hidden mr-2 p-1 cursor-pointer text-3xl">≡ </button>
				<a href="/">
					<span>
						<SvgIcon class="!w-10" name="icon" />
						<SvgIcon class="!w-40 hidden md:inline-block" name="hadithHub" />
					</span>
				</a>
			</svelte:fragment>
			<button
				class="btn variant-soft hover:variant-soft-primary h-10 "
				on:click={triggerSearch}
			>
				<span class="text-3xl p-0 pb-2">⌕</span>
				<span class="text-sm hidden md:inline-block badge variant-soft">Search</span>
			</button>
			<svelte:fragment slot="trail">

				<div class="relative">
					<!-- trigger -->
					<button
						class="btn hover:variant-soft-primary"
						use:popup={{ event: 'click', target: 'theme' }}
					>
						<SvgIcon name="theme" />
					</button>
					<!-- popup -->
					<div class="card p-4 w-60 shadow-xl" data-popup="theme">
						<section class="w-48 flex justify-between items-center border-blue-50">
							<h6>Mode</h6>
							<LightSwitch />
						</section>
						<hr class="my-4" />
						<nav class="list-nav p-4 -m-4 max-h-64 lg:max-h-[500px] overflow-y-auto">
							<form action="/?/setTheme" method="POST" use:enhance={setTheme}>
								<ul>
									{#each themes as { icon, name, type }}
										<li>
											<button
												class="option w-full h-full"
												type="submit"
												name="theme"
												value={type}
												class:bg-primary-active-token={$storeTheme === type}
											>
												<span>{icon}</span>
												<span>{name}</span>
											</button>
										</li>
									{/each}
								</ul>
							</form>
						</nav>
					</div>
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<SideBarContents />
	</svelte:fragment>
	<slot />
	<Footer />
</AppShell>
