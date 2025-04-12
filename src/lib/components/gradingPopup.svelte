<script lang="ts">
	import { scholarQueryString, urlPrefix } from '$lib/data/constantsV2';
	import { languageStore } from '$lib/functions/store.svelte';
	import { getData } from '$lib/functions/utilsV2';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	
	export let muhaddithName: string;
	export let source: string;
	
	// Create a cache object to store muhaddith details
	const muhaddithCache = writable<Record<string, any>>({});
	
	let MuhaddithDetailsPromise: Promise<any>;
	
	$: {
	  const cacheKey = `${muhaddithName}_${languageStore.value.toString()}`;
	  
	  if ($muhaddithCache[cacheKey]) {
		console.log('Cache hit :', cacheKey);
		// Use cached data if available
		MuhaddithDetailsPromise = Promise.resolve($muhaddithCache[cacheKey]);
	  } else {
		console.log('Cache miss :', cacheKey);
		// Fetch data and store in cache
		MuhaddithDetailsPromise = getData(`${urlPrefix}${scholarQueryString}&langs=${languageStore.value.toString()}&name=${muhaddithName}`)
		  .then(data => {
			// Update the cache with the new data
			$muhaddithCache[cacheKey] = data;
			return data;
		  });
	  }
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
