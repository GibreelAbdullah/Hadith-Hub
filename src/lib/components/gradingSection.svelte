<script lang="ts">
    import { popup } from '@skeletonlabs/skeleton';
    export let grades: any[];
    export let hadithIndex: number;

    // Lazy load the component
    let GradingPopup: __sveltets_2_IsomorphicComponent<{ muhaddithName: string; source: string; }, { [evt: string]: CustomEvent<any>; }, {}, {}, string>;
    async function loadGradingPopup() {
        if (!GradingPopup) {
            const module = await import('./gradingPopup.svelte');
            GradingPopup = module.default;
        }
    }
</script>

<div class="hadithGroup font-medium grid place-items-center">
    {#each grades as grade, i}
        {#if grade[0] != ''}
            <button
                class="btn m-1 {grade[3]} text-wrap max-w-md w-[95%] h-[95%]"
                use:popup={{
                    event: 'click',
                    target: 'popupFeatured' + grade[0] + i + hadithIndex
                }}
                on:click={loadGradingPopup}
            >
                {@html grade[0] + ' : ' + grade[1]}
            </button>
            <div
                class="card p-4 w-72 shadow-xl variant-filled-secondary z-[1]"
                data-popup="popupFeatured{grade[0]}{i}{hadithIndex}"
            >
                {#if GradingPopup}
                    <GradingPopup muhaddithName={grade[4]} source={grade[2]} />
                {/if}
            </div>
        {/if}
    {/each}
</div>