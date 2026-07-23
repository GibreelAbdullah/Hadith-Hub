<script lang="ts">
	import { DATA_BASE_URL } from '$lib/data/db';
	import { onMount } from 'svelte';
	import MetaTags from '$lib/components/common/MetaTags.svelte';

	interface Blog {
		slug: string;
		title: string;
		description: string;
		date: string;
		author: string;
	}

	let blogs: Blog[] = [];
	let isLoading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch(`${DATA_BASE_URL}/blogs/blogs.json`);
			if (!response.ok) throw new Error('Failed to load blogs');
			blogs = await response.json();
			isLoading = false;
		} catch (err: any) {
			error = err.message;
			isLoading = false;
		}
	});
</script>

<MetaTags title="Blog | HadithHub" description="Articles and posts from the HadithHub team" />

<div class="p-4">
	<h1 class="h2 font-bold mb-6">Blog</h1>

	{#if isLoading}
		<div class="space-y-4">
			{#each { length: 3 } as _}
				<div class="card p-6">
					<div class="placeholder animate-pulse h-6 w-3/4 mb-2"></div>
					<div class="placeholder animate-pulse h-4 w-full mb-2"></div>
					<div class="placeholder animate-pulse h-4 w-1/4"></div>
				</div>
			{/each}
		</div>
	{:else if error}
		<div class="card p-6 text-center">
			<p class="text-error-500">Error: {error}</p>
		</div>
	{:else if blogs.length === 0}
		<div class="card p-6 text-center">
			<p>No blog posts yet.</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each blogs as blog}
				<a href="/blogs/{blog.slug}" class="card p-6 block hover:ring-2 ring-primary-500 transition-all">
					<h2 class="h3 font-semibold mb-2">{blog.title}</h2>
					<p class="opacity-70 mb-3">{blog.description}</p>
					<p class="text-sm opacity-50">{blog.date} · {blog.author}</p>
				</a>
			{/each}
		</div>
	{/if}
</div>
