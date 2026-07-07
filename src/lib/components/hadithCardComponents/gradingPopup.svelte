<script lang="ts">
    export let muhaddithName: string;
    export let grade: string;
    export let source: string;
</script>

<div class="p-4 space-y-3 max-w-sm">
    <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm">
            {muhaddithName.charAt(0)}
        </div>
        <p class="font-bold text-sm">{muhaddithName}</p>
    </div>
    <hr class="opacity-20" />
    <div class="space-y-1 text-xs">
        <p><span class="font-semibold opacity-70">Grade:</span> {grade}</p>
        {#if source}
            <p><span class="font-semibold opacity-70">Source:</span> {source}</p>
        {/if}
    </div>
</div>
