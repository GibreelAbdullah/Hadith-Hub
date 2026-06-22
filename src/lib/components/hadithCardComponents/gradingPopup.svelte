<script lang="ts">
    import { languageStore } from '$lib/functions/store.svelte';
    import { getScholar } from '$lib/functions/utilsV2';
    export let muhaddithName: string;
    export let source: string;
    import { Avatar } from '@skeletonlabs/skeleton';

    const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
    const getCacheKey = (lang: string, name: string) => `muhaddith_${lang}_${name}`;
    
    let MuhaddithDetailsPromise: Promise<any>;
    
    $: {
        const lang = languageStore.value.at(0) || 'en';
        const cacheKey = getCacheKey(lang, muhaddithName);
        let shouldFetch = true;
        
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
            try {
                const { data, timestamp } = JSON.parse(cachedItem);
                if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
                    MuhaddithDetailsPromise = Promise.resolve(data);
                    shouldFetch = false;
                }
            } catch (e) {}
        }
        
        if (shouldFetch) {
            MuhaddithDetailsPromise = getScholar(lang, muhaddithName).then(data => {
                try {
                    localStorage.setItem(cacheKey, JSON.stringify({
                        data,
                        timestamp: Date.now()
                    }));
                } catch (e) {}
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
	</div>
	<div class="arrow variant-filled-secondary"></div>
{:then data}
	<div class="space-y-4">
		<div class="flex">
			<span class="float-left">
				{#if data[0]}
					<Avatar src={'data:image/jpeg;base64,' + data[0][1]} width="w-16" />
				{:else}
					<Avatar initials={muhaddithName} width="w-16" />
				{/if}
			</span>
			<span class="px-2 my-auto">{muhaddithName}</span>
		</div>
		{#if data[0]}
			<p class="text-xs">{@html data[0][2]}</p>
			<p class="text-xs">{@html 'Grading Source : ' + source}</p>
			<p>{data[0][3]}</p>
		{/if}
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
				{@html 'Grading Source : ' + source}
			{/if}
		</p>
	</div>
	<div class="arrow variant-filled-secondary"></div>
{/await}
