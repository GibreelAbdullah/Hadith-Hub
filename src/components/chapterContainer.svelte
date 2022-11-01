<script lang="ts">
	import { Breadcrumb, Crumb } from "@brainandbones/skeleton";
	export let dataPromise: Promise<any>;
	export let bookURL: String;
</script>

{#await dataPromise}
	<div class="card card-body m-4">LOADING...</div>
{:then data}
	<div class="sticky top-0 card card-body m-4">
		<div class="hadithGroup text-xs grid px-3">
			<Breadcrumb>
				<Crumb href="/">Home</Crumb>
				<Crumb>{data["name"]}</Crumb>
			</Breadcrumb>
		</div>
	</div>
	{#each Object.keys(data["books"]) as chapterNumber}
		{#if data["books"][chapterNumber]["englishName"] != ""}
		<div class="card card-body m-4">
			<a href="./{bookURL}/{chapterNumber}">
				<p class="float-left mt-1">
					{chapterNumber} - 
					{data["books"][chapterNumber]["englishName"]}
				</p>
				<p class="float-right pl-10 ">
					{data["books"][chapterNumber]["arabicName"]}
				</p>
				<div style="clear: both;"></div>
			</a>
		</div>
		{/if}
	{/each}
{:catch data}
	<div class="card card-body m-4">Error. Try clearing the cache.</div>
{/await}
