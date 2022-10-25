<script lang=ts>
	export let dataPromise: Promise<any>;
	export let bookName: String;
</script>

{#await dataPromise}
	<div class="card card-body m-4">LOADING...</div>
{:then data}
	{#each Object.keys(data) as chapterNumber}
		{#if data[chapterNumber]['englishName'] != ''}
		<div class="card card-body m-4">
			<a href="./{bookName}/{chapterNumber}">
				<p style="text-align:left;">
					<span style="padding:0px 10px">{chapterNumber}</span>
					{data[chapterNumber]['englishName']}
					<span style="float:right;">
						{data[chapterNumber]['arabicName']}
					</span>
				</p>
			</a>
		</div>
		{/if}
	{/each}
{:catch data}
	<div class="card card-body m-4">Error...Could Not Load chapter</div>
{/await}