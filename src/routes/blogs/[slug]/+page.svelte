<script lang="ts">
	import { DATA_BASE_URL } from '$lib/data/db';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import MetaTags from '$lib/components/common/MetaTags.svelte';

	interface Blog {
		slug: string;
		title: string;
		description: string;
		date: string;
		author: string;
	}

	let slug = '';
	let blogMeta: Blog | null = null;
	let htmlContent = '';
	let isLoading = true;
	let error: string | null = null;

	onMount(async () => {
		slug = $page.params.slug;
		try {
			const metaResponse = await fetch(`${DATA_BASE_URL}/blogs/blogs.json`);
			if (!metaResponse.ok) throw new Error('Failed to load blog metadata');
			const blogs: Blog[] = await metaResponse.json();
			blogMeta = blogs.find((b) => b.slug === slug) || null;

			if (!blogMeta) {
				throw new Error('Blog post not found');
			}

			const contentResponse = await fetch(`${DATA_BASE_URL}/blogs/${slug}.html`);
			if (!contentResponse.ok) throw new Error('Failed to load blog content');
			htmlContent = await contentResponse.text();
			isLoading = false;
		} catch (err: any) {
			error = err.message;
			isLoading = false;
		}
	});
</script>

<MetaTags
	title={blogMeta ? `${blogMeta.title} | HadithHub` : 'Blog | HadithHub'}
	description={blogMeta?.description || 'Blog post on HadithHub'}
/>

<div class="p-4">
	{#if isLoading}
		<div class="card p-6">
			<div class="placeholder animate-pulse h-8 w-3/4 mb-4"></div>
			<div class="placeholder animate-pulse h-4 w-full mb-2"></div>
			<div class="placeholder animate-pulse h-4 w-full mb-2"></div>
			<div class="placeholder animate-pulse h-4 w-2/3 mb-2"></div>
		</div>
	{:else if error}
		<div class="card p-6 text-center">
			<p class="text-error-500">{error}</p>
		</div>
	{:else}
		<div class="card p-6 blog-content">
			{@html htmlContent}
		</div>
	{/if}
</div>
