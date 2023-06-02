<script lang="ts">
	export let muhaddithName: string;

	import { Avatar } from '@skeletonlabs/skeleton';
	import { muhaddithUrl, urlPrefix } from './constants';
	import { getData } from './utils';
	let muhaddithDetailsUrl: string;
	let MuhaddithDetailsPromise: Promise<any>;
	$: {
		muhaddithDetailsUrl = `${urlPrefix + muhaddithUrl + muhaddithName}.json`;
		MuhaddithDetailsPromise = getData(muhaddithDetailsUrl);
	}
</script>

{#await MuhaddithDetailsPromise}
	<div class="space-y-4">
		<Avatar initials={muhaddithName} width="w-16" />
		<div>
			<p class="font-bold">{muhaddithName}</p>
		</div>
		<div class="placeholder animate-pulse m-1" />
		<div class="placeholder animate-pulse m-1" />
	</div>
	<div class="arrow variant-filled-secondary" />
{:then data}
	<div class="space-y-4">
		<div class="flex">
			<span class="float-left">
				<Avatar src={'data:image/jpeg;base64,' + data.image} width="w-16" />
			</span>
			<span class="px-2 my-auto">{muhaddithName}</span>
		</div>
		<p class="text-xs">{@html data.dates}</p>
		<p>{@html data.bio}</p>
	</div>
	<div class="arrow variant-filled-secondary" />
{:catch}
	<div class="space-y-4">
		<div class="flex">
			<span class="float-left">
				<Avatar initials={muhaddithName} width="w-16" />
			</span>
			<span class="px-2 my-auto">{muhaddithName}</span>
		</div>
		<p class="text-xs">No Info Available</p>
	</div>
	<div class="arrow variant-filled-secondary" />
{/await}
