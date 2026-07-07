<script lang="ts">
    import { getScholar, type ScholarData } from '$lib/data/db';

    export let muhaddithName: string;
    export let englishName: string;
    export let grade: string;
    export let source: string;
    export let collection: string;

    let scholar: ScholarData | null = null;
    let loading = true;
    let fetched = false;

    export function load() {
        if (fetched) return;
        fetched = true;
        getScholar(englishName).then(data => {
            scholar = data;
            loading = false;
        });
    }

    function getReference(data: ScholarData | null, coll: string): string | null {
        if (!data) return null;
        // The reference key matches the collection short name
        const ref = data[coll];
        return ref || null;
    }

    function isUrl(text: string): boolean {
        return text.startsWith('http://') || text.startsWith('https://');
    }
</script>

<div class="p-4 space-y-3 max-w-sm min-w-[280px]">
    {#if loading}
        <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-surface-300 dark:bg-surface-600 animate-pulse"></div>
            <div class="placeholder w-32 animate-pulse"></div>
        </div>
    {:else}
        <div class="flex items-center gap-3">
            {#if scholar?.image}
                <img
                    src="data:image/jpeg;base64,{scholar.image}"
                    alt={muhaddithName}
                    class="w-12 h-12 rounded-full object-cover"
                />
            {:else}
                <div class="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-lg">
                    {muhaddithName.charAt(0)}
                </div>
            {/if}
            <div>
                <p class="font-bold text-sm">{muhaddithName}</p>
                {#if scholar?.dates}
                    <p class="text-xs opacity-70">{@html scholar.dates}</p>
                {/if}
            </div>
        </div>

        {#if scholar?.bio}
            <hr class="opacity-20" />
            <p class="text-xs leading-relaxed">{scholar.bio}</p>
        {/if}

        <hr class="opacity-20" />
        <div class="space-y-1 text-xs">
            <p><span class="font-semibold opacity-70">Grade:</span> {grade}</p>
            {#if source}
                <p><span class="font-semibold opacity-70">Source:</span> {source}</p>
            {/if}
            {#if getReference(scholar, collection)}
                {@const ref = getReference(scholar, collection)}
                <p>
                    <span class="font-semibold opacity-70">Reference:</span>
                    {#if isUrl(ref)}
                        <a href={ref} target="_blank" rel="noopener noreferrer" class="anchor">{ref}</a>
                    {:else}
                        {ref}
                    {/if}
                </p>
            {/if}
        </div>
    {/if}
</div>
