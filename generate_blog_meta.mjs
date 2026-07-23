/**
 * generate_blog_meta.mjs
 *
 * Generates pre-rendered HTML files for blog posts with Open Graph and Twitter Card
 * meta tags. This is necessary because the app is a client-side SPA and social media
 * crawlers (Twitter/X, Facebook, LinkedIn) don't execute JavaScript.
 *
 * These generated HTML files are placed in the build output at the correct route paths
 * (e.g., build/blogs/hosting-website-for-free/index.html) so that crawlers see proper
 * meta tags, while real users get the full SPA experience.
 *
 * Usage: node generate_blog_meta.mjs [--data-dir <path>] [--output-dir <path>] [--base-url <url>]
 */

import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Parse CLI arguments
const args = process.argv.slice(2);
function getArg(name, defaultValue) {
	const idx = args.indexOf(`--${name}`);
	return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultValue;
}

const dataDir = getArg('data-dir', 'static/db');
const outputDir = getArg('output-dir', 'build');
const baseUrl = getArg('base-url', 'https://hadithhub.com');
const defaultImage = 'https://cdn.jsdelivr.net/gh/GibreelAbdullah/Hadith-Hub@master/Header.jpg';

// Read blogs manifest
const blogsJsonPath = join(dataDir, 'blogs', 'blogs.json');
if (!existsSync(blogsJsonPath)) {
	console.error(`Error: blogs.json not found at ${blogsJsonPath}`);
	process.exit(1);
}

const blogs = JSON.parse(readFileSync(blogsJsonPath, 'utf-8'));
console.log(`Found ${blogs.length} blog post(s) to generate meta pages for.`);

for (const blog of blogs) {
	const { slug, title, description, author, date } = blog;
	const url = `${baseUrl}/blogs/${slug}`;

	// Check if there's a blog-specific OG image
	const blogImagePath = join(dataDir, 'blogs', `${slug}.png`);
	const ogImage = existsSync(blogImagePath)
		? `${baseUrl}/db/blogs/${slug}.png`
		: defaultImage;

	const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)} | HadithHub</title>
  <meta name="description" content="${escapeHtml(description)}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:site_name" content="HadithHub" />
  <meta property="article:published_time" content="${date}" />
  <meta property="article:author" content="${escapeHtml(author)}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${url}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImage}" />

  <!-- Redirect to the SPA for real users (crawlers ignore this) -->
  <link rel="canonical" href="${url}" />
  <script>window.location.replace("${url}");</script>
  <noscript><meta http-equiv="refresh" content="0;url=${url}" /></noscript>
</head>
<body>
  <p>Redirecting to <a href="${url}">${escapeHtml(title)}</a>...</p>
</body>
</html>`;

	// Write to build/blogs/<slug>/index.html
	const outputPath = join(outputDir, 'blogs', slug, 'index.html');
	mkdirSync(join(outputDir, 'blogs', slug), { recursive: true });
	writeFileSync(outputPath, html, 'utf-8');
	console.log(`  ✓ Generated: ${outputPath}`);
}

console.log(`\nDone! Generated ${blogs.length} blog meta page(s).`);

function escapeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}
