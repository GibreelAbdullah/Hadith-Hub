<script lang="ts">
	import { urlPrefix } from '$lib/common/constants';
	import SvgIcon from '$lib/common/svgIcon.svelte';

	let htmlPromise = fetch(urlPrefix + '/updates/about/about.html').then((response) => {
		console.dir(response);
		return response.text();
	});
</script>

<div class="card p-4 m-4 flex-wrap">
	<div class="text-center fill-black dark:fill-white">
		<SvgIcon class="!w-40" name="bismillah" />
	</div>
	{#await htmlPromise}
		<div class="card p-4 m-4">
			<div class="hadithGroup font-medium p-2 grid">
					<div class="placeholder animate-pulse" />
			</div>
		</div>
	{:then data}
		{@html data}
	{/await}
</div>
