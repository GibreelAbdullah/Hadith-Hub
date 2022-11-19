<script lang="ts">
	import "@brainandbones/skeleton/themes/theme-skeleton.css";
	import "@brainandbones/skeleton/styles/all.css";
	import "../app.postcss";
	import { selectedLanguagesStore } from "../common/sideBarContents.svelte";
	import {
		AppShell,
		AppBar,
		GradientHeading,
		Drawer,
	} from "@brainandbones/skeleton";
	import { writable, type Writable } from "svelte/store";
	import SideBarContents from "../common/sideBarContents.svelte";

	const storeDrawer: Writable<boolean> = writable(false);
	const drawerOpen: any = () => {
		storeDrawer.set(true);
	};
</script>

<Drawer open={storeDrawer} position="left"><SideBarContents /></Drawer>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4 hidden md:block">
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<button
					on:click={drawerOpen}
					class="md:hidden mr-2 p-1 cursor-pointer text-3xl"
					>≡
				</button>
				<a href="/">
					<GradientHeading
						class="md:text-4xl"
						tag="h1"
						direction="bg-gradient-to-r"
						from="from-primary-500"
						to="to-accent-500"
						>HadithHub
					</GradientHeading>
				</a>
			</svelte:fragment>

			<form action="/search" method="get">
				<input
					type="search"
					placeholder="Search..."
					class="max-w-[200px] px-5"
					name="q"
				/>
				<input
					type="hidden"
					name="lang"
					value={$selectedLanguagesStore}
				/>
			</form>
			<svelte:fragment slot="trail">
				<a href="/" class="hidden md:block">
					<GradientHeading
						class="md:text-4xl"
						tag="h1"
						direction="bg-gradient-to-r"
						from="from-primary-500"
						to="to-accent-500"
						>حديث حب
					</GradientHeading>
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<SideBarContents />
	</svelte:fragment>
	<slot />
</AppShell>
