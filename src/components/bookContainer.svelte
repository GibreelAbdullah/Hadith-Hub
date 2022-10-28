<script lang=ts>
	export let dataPromise: Promise<any>;
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
	{#await dataPromise}
		<div class="bookCard hvr-reveal">LOADING...</div>
	{:then data}
		{#each data["collections"] as book}
			<a class="card card-body text-center" href="/{book["name"]}">{book["englishName"]} <br> {book["arabicName"]}</a>
		{/each}
	{:catch data}
		<div class="bookCard hvr-reveal">Error...Could Not Load Data</div>
	{/await}
</div>