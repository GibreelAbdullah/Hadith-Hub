<script lang="ts">
	import { page } from '$app/stores';

	export let title: string = 'HadithHub | حدیث Hadith হাদিস хадис Hadis';
	export let description: string = 'A Multi Language collection of Hadith';
	export let image: string = 'https://cdn.jsdelivr.net/gh/GibreelAbdullah/Hadith-Hub@master/Header.jpg';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:url" content={$page.url.toString()} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={$page.url.hostname} />
	<meta property="twitter:url" content={$page.url.toString()} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />
</svelte:head>
