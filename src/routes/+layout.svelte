<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { page } from '$app/stores';
	import { selectedLanguagesStore } from '$lib/common/sideBarContents.svelte';
	import {
		AppShell,
		AppBar,
		Drawer,
		type DrawerSettings,
		drawerStore,
		localStorageStore,
		LightSwitch,
		menu
	} from '@skeletonlabs/skeleton';
	import SideBarContents from '$lib/common/sideBarContents.svelte';
	import Footer from '$lib/common/footer.svelte';
	import type { LayoutServerData } from './$types';
	import { browser } from '$app/environment';
	import type { Writable } from 'svelte/store';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import SvgIcon from '$lib/common/svgIcon.svelte';

	export let data: LayoutServerData;

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
		{ type: 'seasonal', name: 'Seasonal', icon: '🎆' }
	];
	$: ({ currentTheme } = data);

	storeTheme.subscribe(setBodyThemeAttribute);
	function setBodyThemeAttribute(): void {
		if (!browser) return;
		document.body.setAttribute('data-theme', $storeTheme);
	}

	function drawerOpen(): void {
		const settings: DrawerSettings = { id: 'main' };
		drawerStore.open(settings);
	}
</script>

<svelte:head>
	<!-- Select Preset Theme CSS DO NOT REMOVE ESCAPES-->
	{@html `\<style\>${currentTheme}}\</style\>`}
</svelte:head>

<Drawer open={drawerOpen} position="left">
	<div class="px-4 pt-8"><SideBarContents /></div>
</Drawer>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4 hidden md:block">
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<button on:click={drawerOpen} class="md:hidden mr-2 p-1 cursor-pointer text-3xl">≡ </button>
				<a href="/">
					<h2>
						<span
							class="bg-gradient-to-br from-primary-500 via-tertiary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone"
						>
							HadithHub
						</span>
					</h2>
				</a>
			</svelte:fragment>
			<form action="/search" method="get" class="">
				<input
					type="search"
					placeholder="Search..."
					value={$page.url.searchParams.get('q')}
					class="px-5 pb-1 h-8 caret-black dark:caret-white"
					name="q"
				/>
				<input type="hidden" name="lang" value={$selectedLanguagesStore} />
			</form>
			<svelte:fragment slot="trail">
				<div class="relative">
					<button
						class="unstyled hover:bg-primary-hover-token px-4 py-2 rounded-token space-x-2"
						use:menu={{ menu: 'theme', interactive: true }}
					>
						<span class="hidden md:inline-block">Theme</span>
						<SvgIcon class="md:hidden" name="theme" fill="fill-white" />
						<span>⮟</span>
					</button>
					<div class="card w-64 shadow-xl max-w-fit sm:max-w-none" data-menu="theme">
						<section class="flex justify-between items-center p-4">
							<h6>Theme</h6>
							<LightSwitch />
						</section>
						<hr />
						<nav class="list-nav p-4 max-h-64 lg:max-h-[480px] overflow-y-auto">
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
				<a href="/" class="hidden md:block">
					<h2>
						<span
							class="bg-gradient-to-br from-primary-500 via-tertiary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone"
						>
							حديث حب
						</span>
					</h2>
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<SideBarContents />
	</svelte:fragment>
	<slot />
	<Footer />
</AppShell>
