<script lang="ts">
	export let grades: any[];
	export let hadithIndex: number;
</script>

{#if grades && grades.length}
<div class="hadithGroup font-medium grid place-items-center">
	{#each grades as grade, i}
		{#if grade[0] != ''}
			<span class="badge variant-soft-primary m-1 text-wrap max-w-md w-[95%] p-2">
				{grade[0]} : {grade[1]}
			</span>
		{/if}
	{/each}
</div>
{/if}
