<script lang="ts">
import { page } from '$app/stores';
import HadithContainer from '$lib/components/hadithContainer.svelte';
import { languageStore } from '$lib/functions/store.svelte';
import HadithPlaceholder from '$lib/components/hadithPlaceholder.svelte';
	import { getHadithPromise } from '$lib/functions/utilsV2';

let title = `Book ${$page.params.bookNumber} - ${$page.params.collection} | HadithHub`;
const hadithPromise = $derived(getHadithPromise($page.params));

</script>

<svelte:head>
	<!-- HTML Meta Tags -->
	<title>{title}</title>
	<meta name="description" content="A Multi Language collection of Hadith" />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content={$page.url.toString()} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content="A Multi Language collection of Hadith" />
	<meta
		property="og:image"
		content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg"
	/>

	<!-- Twitter Meta Tags -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={$page.url.hostname} />
	<meta property="twitter:url" content={$page.url.toString()} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content="A Multi Language collection of Hadith" />
	<meta
		property="twitter:image"
		content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg"
	/>
</svelte:head>
	<main>
	{#if languageStore.value.length != 0}
		{#await hadithPromise}
			<div class="sticky top-0 card p-4 !variant-glass-secondary max-w-[90rem] m-auto my-4">
				<div class="hadithGroup grid px-5">
					<ol class="breadcrumb">
						<li class="crumb anchor"><a href="/">Home</a></li>
						<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
						<div class="placeholder w-52 m-auto animate-pulse"></div>
					</ol>
				</div>
			</div>
			<div class="card flex-wrap !bg-transparent max-w-[90rem] m-auto my-4">
				<div class="hadithGroup grid">
					<div class="break-words leading-7 m-3">
						<div class="placeholder animate-pulse"></div>
					</div>
					<div class="break-words leading-7 m-3 text-right justify-end">
						<div class="placeholder animate-pulse"></div>
					</div>
				</div>
			</div>
			<HadithPlaceholder />
		{:then dataList}
		<HadithContainer dataListRecord={dataList} />
		{:catch data}
			<div class="card p-4 m-4">
				<div class="hadithGroup font-medium p-2 grid">
					<div class="break-words leading-7 m-3">Error. Try clearing the cache.</div>
				</div>
			</div>
		{/await}
	{:else}
		<div class="card p-4 m-4">
			<div class="hadithGroup font-medium p-2 grid">
				<div class="break-words leading-7 m-3">Select at least 1 language.</div>
			</div>
		</div>
	{/if}
</main>

<style>
	.hadithGroup {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}
</style>
