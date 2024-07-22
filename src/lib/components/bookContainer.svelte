<script lang="ts">
	export let dataPromise: Promise<any>;
	export let bookURL: string;
</script>

{#await dataPromise}
	<div class="sticky top-0 card p-4 !variant-glass-secondary max-w-[90rem] m-auto my-4">
		<div class="grid px-3">
			<ol class="breadcrumb">
				<li class="crumb anchor"><a href="/">Home</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				<div class="placeholder w-52 m-auto animate-pulse" />
			</ol>
		</div>
	</div>
	{#each { length: 5 } as _, i}
		<div class="card p-4 max-w-[90rem] m-auto my-4">
			<div class="hadithGroup font-medium p-2 grid">
				<div>
					<div class="placeholder animate-pulse" />
				</div>

				<div class="text-right ml-10">
					<div class="placeholder animate-pulse" />
				</div>
				<div class="hidden md:block text-right">
					<div class="badge">
						<div class="placeholder animate-pulse w-16 m-auto" />
					</div>
				</div>
			</div>
			<div class="md:hidden text-center">
				<div class="placeholder animate-pulse w-16 m-auto" />
			</div>
		</div>
	{/each}
{:then data}
	<div class="p-4">
		<div class="sticky top-0 card p-4 m-auto !variant-glass-secondary max-w-[90rem]">
			<div class="grid px-3">
				<ol class="breadcrumb">
					<li class="crumb anchor"><a href="/">Home</a></li>
					<li class="crumb-separator" aria-hidden>&rsaquo;</li>
					<li class="crumb">{data['name']}</li>
				</ol>
			</div>
		</div>
	</div>
	{#each Object.keys(data['books']) as bookNumber}
		{#if data['books'][bookNumber]['eng-name'] != ''}
			<a href="/{bookURL}/{bookNumber}" class="card">
        <div class="p-4">

				<div class="card p-4 m-auto max-w-[90rem]">
					<div class="hadithGroup font-medium p-2 grid">
						<div>
							{bookNumber} -
							{data['books'][bookNumber]['eng-name']}
						</div>

						<div class="text-right ml-10">
							{data['books'][bookNumber]['ara-name']}
						</div>
						<div class="hidden md:block text-right">
							<div class="badge bg-gray-500">
								{data['books'][bookNumber]['minHadith']} to
								{data['books'][bookNumber]['maxHadith']}
							</div>
						</div>
					</div>
          </div>
					<div class="md:hidden text-center">
						<div class="badge bg-gray-500">
							{data['books'][bookNumber]['minHadith']} to
							{data['books'][bookNumber]['maxHadith']}
						</div>
					</div>
				</div>
			</a>
		{/if}
	{/each}
{:catch data}
	<div class="card p-4 m-4">Error. What you're looking for is not here.</div>
{/await}

<style>
	.hadithGroup {
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		/* grid-template-columns: minmax(300px, 3fr) minmax(300px, 3fr) minmax(300px, 1fr); */
	}
</style>
