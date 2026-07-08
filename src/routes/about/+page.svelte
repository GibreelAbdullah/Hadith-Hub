<script lang="ts">
	import { urlPrefix } from '$lib/common/constants';
	import SvgIcon from '$lib/components/common/svgIcon.svelte';
	import MetaTags from '$lib/components/common/MetaTags.svelte';
	let htmlPromise = fetch(urlPrefix + '/updates/about/about.html').then((response) => {
		return response.text();
	});
</script>

<MetaTags title="About | HadithHub" description="About HadithHub - A Multi Language collection of Hadith" />

<div class="card p-4 m-4 flex-wrap">
	<div class="text-center fill-black dark:fill-white">
		<SvgIcon class="!w-40" name="bismillah" />
	</div>
	{#await htmlPromise}
		<div class="card anchor dark:fill-white fill-black font-bold p-4 px-6 py-2 text-center text-xl">
			<div class="hadithGroup font-medium p-2 grid">
					<div class="placeholder animate-pulse" />
			</div>
		</div>
	{:then data}
		{@html data}
	{/await}
</div>
