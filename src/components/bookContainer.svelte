<script lang=ts>
	export let dataPromise: Promise<any>;
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
	{#await dataPromise}
		<div class="bookCard hvr-reveal">LOADING...</div>
		<!-- TODO -->
	{:then data}
		{#each data["collections"] as book}
			<a class="card card-body text-center" href="/{book["name"]}">{book["englishName"]} <br> {book["arabicName"]}</a>
		{/each}
	{:catch data}
		<div class="bookCard hvr-reveal">Error...Could Not Load Data</div>
	{/await}
</div>

<!-- <style>
	.mainBookContainer {
		min-height: 40px;
		border: none;
		margin-left: 10%;
		margin-right: 10%;
		padding: 10px;
		display: grid;
		row-gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	.bookCard , .bookCard:visited , .bookCard:link{
		text-decoration: none;
		color: black;
		padding: 20px;
		text-align: center;
		border-radius: 8px;
		background-color: white;
		box-shadow: 0 0px 1px hsl(0deg 0% 0% / 0.075), 0 1px 2px hsl(0deg 0% 0% / 0.075),
			0 2px 4px hsl(0deg 0% 0% / 0.075), 0 4px 8px hsl(0deg 0% 0% / 0.075),
			0 6px 16px hsl(0deg 0% 0% / 0.075);
		/* word-wrap: break-word; */
		margin-left: 10px;
		margin-right: 10px;
		line-height: 40px;
		/* margin: auto; */
		transition: .2s ease-in ;
	}
</style> -->
