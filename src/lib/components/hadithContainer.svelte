<script lang="ts">
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import { base } from '$app/paths';
	import HadithCard from './hadithCardComponents/HadithCard.svelte';
	import { settingsStore, getFontStyleForText } from '$lib/functions/settingsStore';
	import { getDirForText } from '$lib/functions/language';
	import { recentStore } from '$lib/functions/recentStore.svelte';
	export let dataListRecord: any[] = [];
	export let availableLanguages: string[] = [];
	export let hideBreadcrumb: boolean = false;
	export let loadMore: (() => Promise<any[]>) | null = null;
	export let hasMore: (() => boolean) | null = null;
	// When true, remaining chunks load only on explicit "Load More" click
	// (used by the single-hadith route). When false, they auto-load silently.
	export let manualLoadMore: boolean = false;

	$: fontSettings = $settingsStore;

	$: displayLanguages = languageStore.value.filter((l) => availableLanguages.includes(l));
	$: langCount = displayLanguages.length || 2;

	$: collectionTitle = dataListRecord.find((d) => d[5] === 'collection')?.[7] || '';
	$: collectionShortName = dataListRecord.find((d) => d[5] === 'collection')?.[0] || '';
	$: bookTitle = dataListRecord.find((d) => d[5] === 'book')?.[7] || '';
	// Book number for the breadcrumb link + recent recording. Prefer the book
	// record, fall back to the first hadith row (both carry it at index 2).
	$: bookNumber =
		dataListRecord.find((d) => d[5] === 'book')?.[2] ??
		dataListRecord.find((d) => d[5] === 'hadith')?.[2] ??
		'';

	let loadingMore = false;

	// ─── Recently Read recording ──────────────────────────────────────────────
	// Observe hadith cards and record the one the user is actually reading.
	//
	// We can't use "fully visible": a hadith taller than the viewport is never
	// fully visible, so it would never be recorded (its shorter predecessor
	// would win instead). Instead we pick the card that crosses a "reading
	// line" near the top of the viewport — the card whose top is at/above the
	// line and whose bottom is still below it. That card "owns" the screen while
	// you read through it, regardless of its height. One observer per container
	// keeps the candidate set to on-screen cards; final selection uses rects.
	let recentDebounce: ReturnType<typeof setTimeout> | null = null;
	let intersectionObserver: IntersectionObserver | null = null;
	// Cards currently intersecting the viewport (candidates to evaluate).
	const onScreen = new Set<Element>();

	// Fraction of viewport height where the reading line sits (near the top).
	const READING_LINE = 0.33;

	function scheduleRecord(el: Element) {
		if (recentDebounce) clearTimeout(recentDebounce);
		recentDebounce = setTimeout(() => {
			const num = el.getAttribute('data-hadith-num');
			const numInBook = el.getAttribute('data-hadith-num-book') || '';
			const coll = collectionShortName;
			if (!num || !coll) return;
			recentStore.record({
				collectionShortName: coll,
				bookNumber: String(bookNumber),
				hadithNum: num,
				hadithNumberInBook: numInBook,
			});
		}, 1000);
	}

	function currentReadingCard(): Element | null {
		const line = window.innerHeight * READING_LINE;
		let straddling: Element | null = null;
		let straddleTop = Infinity;
		// Fallback: topmost card whose top is below the line (nothing crosses it
		// yet, e.g. scrolled to the very top or between cards).
		let firstBelow: Element | null = null;
		let firstBelowTop = Infinity;

		for (const el of onScreen) {
			const rect = el.getBoundingClientRect();
			// Crosses the reading line: this is the card being read.
			if (rect.top <= line && rect.bottom > line) {
				if (rect.top < straddleTop) {
					straddleTop = rect.top;
					straddling = el;
				}
			} else if (rect.top > line && rect.top < firstBelowTop) {
				firstBelowTop = rect.top;
				firstBelow = el;
			}
		}
		return straddling ?? firstBelow;
	}

	function handleIntersections(entries: IntersectionObserverEntry[]) {
		for (const entry of entries) {
			if (entry.isIntersecting) onScreen.add(entry.target);
			else onScreen.delete(entry.target);
		}
		const card = currentReadingCard();
		if (card) scheduleRecord(card);
	}

	// Recompute on scroll too: for a card taller than the viewport, no
	// intersection events fire while scrolling through its middle, but the
	// reading-line owner can still change. Throttled via rAF.
	let scrollTicking = false;
	function handleScroll() {
		if (scrollTicking) return;
		scrollTicking = true;
		requestAnimationFrame(() => {
			scrollTicking = false;
			const card = currentReadingCard();
			if (card) scheduleRecord(card);
		});
	}

	// (Re)wire the observer whenever the rendered cards change.
	function observeCards(node: HTMLElement) {
		function setup() {
			intersectionObserver?.disconnect();
			onScreen.clear();
			intersectionObserver = new IntersectionObserver(handleIntersections, {
				threshold: [0, 1],
			});
			node.querySelectorAll('[data-hadith-card]').forEach((el) => {
				intersectionObserver!.observe(el);
			});
		}
		setup();
		window.addEventListener('scroll', handleScroll, { passive: true });
		// Re-observe when children change (chunks/Load More append cards).
		const mo = new MutationObserver(() => setup());
		mo.observe(node, { childList: true, subtree: true });
		return {
			destroy() {
				mo.disconnect();
				intersectionObserver?.disconnect();
				window.removeEventListener('scroll', handleScroll);
			},
		};
	}

	onDestroy(() => {
		if (recentDebounce) clearTimeout(recentDebounce);
		intersectionObserver?.disconnect();
	});

	// Auto-load: fetch and append chunks continuously as they arrive.
	// In manual mode (hadith route), a single click loads one batch and stops.
	// `canLoadMore` is reactive state (hasMore() reads closure vars Svelte can't
	// track), recomputed after each load so the button/end-message stay correct.
	let canLoadMore = false;
	$: manualLoadMore, dataListRecord, (canLoadMore = !!hasMore?.());

	async function loadNextChunk() {
		if (loadingMore || !hasMore?.() || !loadMore) return;
		loadingMore = true;
		const moreData = await loadMore();
		if (moreData.length) {
			dataListRecord = [...dataListRecord, ...moreData];
		}
		loadingMore = false;
		canLoadMore = !!hasMore?.();
		// Keep auto-loading only when not in manual mode.
		if (!manualLoadMore && hasMore?.()) {
			loadNextChunk();
		}
	}

	// Start auto-loading remaining chunks after initial render (auto mode only).
	$: if (!manualLoadMore && dataListRecord.length > 0 && hasMore?.()) {
		loadNextChunk();
	}
</script>

<div use:observeCards>
{#each dataListRecord as data}
	{#if data[5] == 'collection'}
		{#if !hideBreadcrumb}
			<div class="p-4">
				<div class="sticky top-0 card p-4 !preset-tonal-secondary max-w-360 m-auto">
					<div class="px-5">
						<ol class="breadcrumb">
							<li class="crumb anchor">
							<a href="{base}/?lang={languageStore.value.toString()}">Home</a>
							</li>
							<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
							<li class="crumb anchor">
								<a href="{base}/{$page.params.collection}?lang={languageStore.value.toString()}"
									>{data[7]}</a
								>
							</li>
							<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
							<li id="bookCrumb" class="crumb anchor">
								<a
									href="{base}/{$page.params.collection}/{bookNumber}?lang={languageStore.value.toString()}"
									>{bookTitle}</a
								>
							</li>
						</ol>
					</div>
				</div>
			</div>
		{/if}
	{:else if data[5] == 'book'}{:else if ['chapter', 'chapter_intro', 'book_intro'].includes(data[5])}
		<div class="p-4">
			<div
				class="px-4 card max-w-360 m-auto {data[5] == 'chapter' ? '!preset-tonal-primary' : '!bg-tertiary-500/5'}"
			>
				<div class="hadithGroup font-medium grid">
					{#each { length: langCount } as _, i}
						<div
							class="wrap-break-word leading-7 m-3 pb-4"
							dir={getDirForText(data[i + 7] || '', displayLanguages[i])}
							style={getFontStyleForText(data[i + 7] || '', displayLanguages[i], fontSettings)}
						>
							<article id="myDiv">{@html data[i + 7]}</article>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else if data[5] == 'hadith'}
		<div
			data-hadith-card
			data-hadith-num={data[1]}
			data-hadith-num-book={data[3] ?? ''}
		>
			<HadithCard
				id="{data[0]}{data[1]}"
				{collectionTitle}
				{collectionShortName}
				hadithNum={data[1]}
				{bookTitle}
				bookNumber={data[2]}
				hadithNumberInBook={data[3]}
				texts={Array.from({ length: langCount }, (_, i) => ({
					text: data[i + 7] || '',
					lang: displayLanguages[i] || '',
					dir: getDirForText(data[i + 7] || '', displayLanguages[i]),
					style: getFontStyleForText(data[i + 7] || '', displayLanguages[i], fontSettings),
				}))}
				grades={data[6]}
			/>
		</div>
	{/if}
{/each}

{#if manualLoadMore}
	{#if canLoadMore}
		<div class="flex justify-center p-4">
			<button
				type="button"
				class="btn preset-filled-primary-500"
				onclick={loadNextChunk}
				disabled={loadingMore}
			>
				{loadingMore ? 'Loading…' : 'Load More'}
			</button>
		</div>
	{:else}
		<div class="flex justify-center p-4">
			<p class="text-surface-600-400 text-sm">Reached end of the book</p>
		</div>
	{/if}
{/if}
</div>

