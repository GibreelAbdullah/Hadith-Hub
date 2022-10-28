<script lang="ts">
	import { clipboard, Divider } from "@brainandbones/skeleton";
	export let book: string="";
	export let allHadiths: any[] = [];
	let languageCount = allHadiths.length;
</script>

{#if allHadiths[0] == "Loading..."}
	<div class="card card-body m-4">
		<div class="hadithGroup font-medium p-2 grid">
			<div class="break-words leading-7 m-3">Loading...</div>
		</div>
	</div>
{:else}
	{#each { length: allHadiths[0].hadiths.length } as _, i}
		{#if allHadiths[0].hadiths[i].text}
			<div class="card card-body m-4 flex-wrap">
				<div class="hadithGroup font-medium p-2 grid">
					{#each { length: languageCount } as _, j}
						<div class="break-words leading-7 m-3">
							{allHadiths[j].hadiths[i].text}
						</div>
					{/each}
				</div>
				<Divider borderWidth="border-l" />
				<div class="gradingGroup font-medium p-2 grid">
					{#each allHadiths[0].hadiths[i].grades as grade}
						<div class="break-words leading-7 m-3">
							{grade["name"]} : {grade["grade"]}
						</div>
					{/each}
				</div>
				<Divider borderWidth="border-l" />
				<div class="gradingGroup font-medium p-2 grid">
						{allHadiths[0].metadata.name}
						{allHadiths[0].hadiths[i].arabicnumber}
						<br />
						Book {allHadiths[0].hadiths[i].reference.book}, Hadith {allHadiths[0]
							.hadiths[i].reference.hadith}
					<button class = "btn bg-primary-500 btn-sm text-white w-40 my-4 align-top" 
					use:clipboard={"hadithhub.com/"+book+":"+ allHadiths[0]
					.hadiths[i].reference.hadith}>Copy Permalink</button>
				</div>
			</div>
		{/if}
	{/each}
{/if}

<style>
	.hadithGroup {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	.gradingGroup {
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	}
</style>
