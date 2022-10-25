<script lang=ts>
	export let allHadiths: any[] = [];
	let languageCount = allHadiths.length;
</script>

{#if allHadiths[0] == 'Loading...'}
	<div class="card card-body m-4">
		<div class="hadithGroup">
			<div class="hadith">Loading...</div>
		</div>
	</div>
{:else}
	{#each { length: allHadiths[0].hadiths.length } as _, i}
		{#if allHadiths[0].hadiths[i].text}
			<div class="card card-body m-4 flex-wrap">
				<div class="hadithGroup">
					{#each { length: languageCount } as _, j}
						<div class="hadith">{allHadiths[j].hadiths[i].text}</div>
					{/each}
				</div>
				<hr />
				<div class="hadithDetails">
					<p>{allHadiths[0].metadata.name} {allHadiths[0].hadiths[i].arabicnumber}</p>
					<p>
						Book {allHadiths[0].hadiths[i].reference.book}, Hadith {allHadiths[0].hadiths[i]
							.reference.hadith}
					</p>
				</div>
			</div>
		{/if}
	{/each}
{/if}

<style>
	.hadithGroup {
		font-size: medium;
		padding: 10px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}
	.hadith {
		word-wrap: break-word;
		line-height: 30px;
		border: none;
		margin: 10px;
	}
	.hadithDetails {
		word-wrap: break-word;
		/* line-height: 30px; */
		border: none;
		padding: 10px;
		margin-left: 10px;
		margin-right: 10px;
	}
</style>
