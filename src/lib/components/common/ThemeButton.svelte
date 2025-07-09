<script lang="ts">
	import { enhance } from "$app/forms";
	import { popup, LightSwitch, getModalStore, localStorageStore } from "@skeletonlabs/skeleton";
	import SvgIcon from "./svgIcon.svelte";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { browser } from "$app/environment";
	import type { Writable } from "svelte/store";

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

	export const storeTheme: Writable<string> = localStorageStore('storeTheme', 'skeleton');
	const modalStore = getModalStore();


	storeTheme.subscribe(setBodyThemeAttribute);
	function setBodyThemeAttribute(): void {
		if (!browser) return;
		document.body.setAttribute('data-theme', $storeTheme);
	}

	const setTheme: SubmitFunction = () => {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				const theme = result.data?.theme as string;
				storeTheme.set(theme);
			}
		};
	};

</script>
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