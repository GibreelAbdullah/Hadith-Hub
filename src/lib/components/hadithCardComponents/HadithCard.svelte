<script lang="ts">
	import GradingSection from './gradingSection.svelte';
	import Reference from './reference.svelte';
	import { getDirForText } from '$lib/functions/language';

	interface TextEntry {
		text: string;
		lang?: string;
		dir?: string;
		style?: string;
	}

	interface Props {
		id: string;
		collectionTitle: string;
		collectionShortName: string;
		hadithNum: string;
		bookTitle: string;
		bookNumber: string | number;
		hadithNumberInBook: string;
		texts: TextEntry[];
		grades: any[] | null;
		maxWidth?: string;
	}

	let {
		id,
		collectionTitle,
		collectionShortName,
		hadithNum,
		bookTitle,
		bookNumber,
		hadithNumberInBook,
		texts,
		grades,
		maxWidth = 'max-w-360',
	}: Props = $props();
</script>

<div class="p-4">
	<div class="p-4 card {maxWidth} m-auto" id="hadith{id}">
		<!-- Compact reference at top center -->
		<div class="text-center mb-3">
			<span
				class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-primary-700-300 text-sm font-medium"
			>
				<span>{collectionTitle}</span>
				<span dir="ltr">: {hadithNum}</span>
			</span>
		</div>
		<div class="card flex-wrap border-0!">
			<div class="hadithGroup font-medium grid">
				{#each texts as { text, lang, dir, style }}
					<div
						class="wrap-break-word leading-7 m-3 pb-4"
						dir={dir || getDirForText(text || '', lang || '')}
						style={style || ''}
					>
						{#if text}
							<article>{@html text}</article>
						{:else}
							<center
								><code class="text-white! bg-red-500!">Hadith translation not found</code
								></center
							>
						{/if}
					</div>
				{/each}
			</div>
			<!-- GRADINGS -->
			<GradingSection {grades} hadithIndex={hadithNum} collection={collectionShortName} />
			<!-- FULL REFERENCE AND BUTTONS at bottom -->
			<Reference
				{collectionShortName}
				hadithNumberInCollection={hadithNum}
				{hadithNumberInBook}
				{bookNumber}
				{collectionTitle}
				{bookTitle}
			/>
		</div>
	</div>
</div>
