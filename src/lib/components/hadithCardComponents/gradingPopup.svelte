<script lang="ts">
    import { getScholar, type ScholarData } from '$lib/data/db';
    import { onMount } from 'svelte';

    interface Props {
        muhaddithName: string;
        englishName: string;
        grade: string;
        source: string;
        collection: string;
    }

    let { muhaddithName, englishName, grade, source, collection }: Props = $props();

    let scholar = $state<ScholarData | null>(null);
    let loading = $state(true);

    // Auto-load scholar data when component mounts
    onMount(() => {
        getScholar(englishName).then(data => {
            scholar = data;
            loading = false;
        });
    });

    function getReference(data: ScholarData | null, coll: string): string | null {
        if (!data) return null;
        const ref = (data as any)[coll];
        return ref || null;
    }

    function isUrl(text: string): boolean {
        return text.startsWith('http://') || text.startsWith('https://');
    }
</script>

<div class="p-4 space-y-3 max-w-sm min-w-[280px] bg-primary-500/20 text-surface-contrast-900">
    {#if loading}
        <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-surface-300-600 animate-pulse"></div>
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
                <div class="w-12 h-12 rounded-full  flex items-center justify-center font-bold text-lg">
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
                    {#if ref && isUrl(ref)}
                        <a href={ref} target="_blank" rel="noopener noreferrer" class="text-primary-400 underline hover:text-primary-300 break-all">{ref}</a>
                    {:else}
                        {ref}
                    {/if}
                </p>
            {/if}
        </div>
    {/if}
</div>
