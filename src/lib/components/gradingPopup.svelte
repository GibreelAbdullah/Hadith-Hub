<script lang="ts">
	import { scholarQueryString, urlPrefix } from '$lib/data/constantsV2';
	import { languageStore } from '$lib/functions/store.svelte';
	import { getData } from '$lib/functions/utilsV2';

	export let muhaddithName: string;
	export let source: string;

	import { Avatar } from '@skeletonlabs/skeleton';

	let MuhaddithDetailsPromise: Promise<any>;
	$: {
		MuhaddithDetailsPromise = getData(`${urlPrefix}${scholarQueryString}&langs=${languageStore.value.toString()}&name=${muhaddithName}`)
	}
</script>

{#await MuhaddithDetailsPromise}
	<div class="space-y-4">
		<Avatar initials={muhaddithName} width="w-16" />
		<div>
			<p class="font-bold">{muhaddithName}</p>
		</div>
		<div class="placeholder animate-pulse m-1"></div>
		<div class="placeholder animate-pulse m-1"></div>
	</div>
	<div class="arrow variant-filled-secondary"></div>
{:then data}
	<div class="space-y-4">
		<div class="flex">
			<span class="float-left">
				<Avatar src={'data:image/jpeg;base64,' + data[0][1]} width="w-16" />
			</span>
			<span class="px-2 my-auto">{muhaddithName}</span>
		</div>
		<p class="text-xs">{@html data[0][2]}</p>
		<p class="text-xs">{@html "Grading Source : " + source}</p>
		<p>{data[0][3]}</p>
	</div>
	<div class="arrow variant-filled-secondary"></div>
{:catch}
	<div class="space-y-4">
		<div class="flex">
			<span class="float-left">
				<Avatar initials={muhaddithName} width="w-16" />
			</span>
			<span class="px-2 my-auto">{muhaddithName}</span>
		</div>
		<p class="text-xs">
			{#if source === undefined}
				No Data Found
			{:else}
				{@html "Grading Source : " + source}
			{/if}
		</p>
	</div>
	<div class="arrow variant-filled-secondary"></div>
{/await}
