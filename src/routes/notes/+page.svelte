<script lang="ts">
	import { notesStore, type Note } from '$lib/functions/notesStore.svelte';
	import { base } from '$app/paths';
	import { languageStore } from '$lib/functions/store.svelte';
	import { getCollectionDisplayInfo } from '$lib/functions/utilsV2';
	import { settingsStore, getFontStyleForText } from '$lib/functions/settingsStore';
	import { getDirForText } from '$lib/functions/language';
	import { get } from 'svelte/store';
	import MetaTags from '$lib/components/common/MetaTags.svelte';

	let importMessage = $state<{ type: 'success' | 'error'; text: string } | null>(null);
	let showClearConfirm = $state(false);
	let fileInput: HTMLInputElement;

	// Filter & Sort state
	let selectedCollection = $state<string>('all');
	let sortBy = $state<'hadith' | 'date-asc' | 'date-desc'>('hadith');

	// Collection display info (name + language, resolved async)
	let collectionInfo = $state<Record<string, { name: string; lang: string }>>({});

	// Font settings (reactive)
	let fontSettings = $state(get(settingsStore));
	settingsStore.subscribe(v => fontSettings = v);

	// Resolve display names reactively when language or notes change
	$effect(() => {
		// Access languageStore.value to create a reactive dependency on language changes
		const _langs = languageStore.value;
		const shortNames = [...new Set(notesStore.notes.map((n) => n.collectionShortName))];
		resolveNames(shortNames);
	});

	async function resolveNames(shortNames: string[]) {
		const info: Record<string, { name: string; lang: string }> = {};
		await Promise.all(
			shortNames.map(async (sn) => {
				info[sn] = await getCollectionDisplayInfo(sn);
			})
		);
		collectionInfo = info;
	}

	// Unique collections in notes
	let collectionKeys = $derived(
		[...new Set(notesStore.notes.map((n) => n.collectionShortName))].sort()
	);

	// Filtered notes
	let filteredNotes = $derived.by(() => {
		let notes = notesStore.notes;
		if (selectedCollection !== 'all') {
			notes = notes.filter((n) => n.collectionShortName === selectedCollection);
		}
		return notes;
	});

	// Sorted notes
	let sortedNotes = $derived.by(() => {
		const notes = [...filteredNotes];
		switch (sortBy) {
			case 'hadith':
				return notes.sort((a, b) => {
					const collCmp = a.collectionShortName.localeCompare(b.collectionShortName);
					if (collCmp !== 0) return collCmp;
					return parseInt(a.hadithNum) - parseInt(b.hadithNum);
				});
			case 'date-asc':
				return notes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
			case 'date-desc':
				return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			default:
				return notes;
		}
	});

	// Group sorted notes by collection for display
	let groupedNotes = $derived.by(() => {
		const groups: Record<string, Note[]> = {};
		for (const note of sortedNotes) {
			const key = note.collectionShortName;
			if (!groups[key]) groups[key] = [];
			groups[key].push(note);
		}
		return groups;
	});

	let displayCollectionKeys = $derived(Object.keys(groupedNotes).sort());

	function getDisplayName(shortName: string): string {
		return collectionInfo[shortName]?.name || shortName;
	}

	function getCollectionFontStyle(shortName: string): string {
		const info = collectionInfo[shortName];
		if (!info) return '';
		return getFontStyleForText(info.name, info.lang, fontSettings);
	}

	function getCollectionDir(shortName: string): 'rtl' | 'ltr' {
		const info = collectionInfo[shortName];
		if (!info) return 'ltr';
		return getDirForText(info.name, info.lang);
	}

	function getNoteFontStyle(): string {
		return getFontStyleForText('', 'en', fontSettings);
	}

	function exportNotes() {
		const json = notesStore.exportJSON();
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `hadith-notes-${new Date().toISOString().split('T')[0]}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function triggerImport() {
		fileInput.click();
	}

	async function handleImport(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const result = notesStore.importJSON(text);
			importMessage = {
				type: 'success',
				text: `Imported ${result.imported} note${result.imported !== 1 ? 's' : ''} successfully.${result.skipped > 0 ? ` Skipped ${result.skipped} (duplicates or invalid).` : ''}`
			};
		} catch (err) {
			importMessage = {
				type: 'error',
				text: `Import failed: ${err instanceof Error ? err.message : 'Invalid file format'}`
			};
		}

		// Reset the file input
		target.value = '';
		// Auto-dismiss message after 5s
		setTimeout(() => { importMessage = null; }, 5000);
	}

	function confirmClear() {
		showClearConfirm = true;
	}

	function clearAll() {
		notesStore.clearAll();
		showClearConfirm = false;
	}

	function deleteNote(id: string) {
		notesStore.deleteNote(id);
	}

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}
</script>

<MetaTags title="My Notes | HadithHub" description="Manage your hadith notes" />

<div class="p-4 max-w-4xl mx-auto space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<h1 class="text-2xl font-bold">My Notes</h1>
		<div class="flex flex-wrap gap-2">
			<button class="btn preset-filled-primary-500 btn-sm" onclick={exportNotes} disabled={notesStore.count === 0}>
				<svg class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="7 10 12 15 17 10"></polyline>
					<line x1="12" y1="15" x2="12" y2="3"></line>
				</svg>
				Export JSON
			</button>
			<button class="btn preset-tonal-primary btn-sm" onclick={triggerImport}>
				<svg class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="17 8 12 3 7 8"></polyline>
					<line x1="12" y1="3" x2="12" y2="15"></line>
				</svg>
				Import JSON
			</button>
			{#if notesStore.count > 0}
				<button class="btn preset-tonal-error btn-sm" onclick={confirmClear}>
					Clear All
				</button>
			{/if}
		</div>
	</div>

	<!-- Hidden file input for import -->
	<input
		bind:this={fileInput}
		type="file"
		accept=".json,application/json"
		class="hidden"
		onchange={handleImport}
	/>

	<!-- Import message -->
	{#if importMessage}
		<div class="p-3 rounded-lg text-sm {importMessage.type === 'success' ? 'preset-tonal-success' : 'preset-tonal-error'}">
			{importMessage.text}
		</div>
	{/if}

	<!-- Clear confirmation -->
	{#if showClearConfirm}
		<div class="p-4 rounded-lg border border-error-500 bg-error-50 dark:bg-error-950 space-y-3">
			<p class="font-medium text-error-700 dark:text-error-300">Are you sure you want to delete all notes?</p>
			<p class="text-sm opacity-70">This action cannot be undone.</p>
			<div class="flex gap-2">
				<button class="btn preset-filled-error-500 btn-sm" onclick={clearAll}>Yes, delete all</button>
				<button class="btn preset-tonal-surface btn-sm" onclick={() => showClearConfirm = false}>Cancel</button>
			</div>
		</div>
	{/if}

	<!-- Warning about localStorage -->
	<div class="p-4 rounded-lg border border-warning-500 bg-warning-50 dark:bg-warning-950">
		<div class="flex items-start gap-3">
			<svg class="w-5 h-5 text-warning-600 dark:text-warning-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
				<line x1="12" y1="9" x2="12" y2="13"></line>
				<line x1="12" y1="17" x2="12.01" y2="17"></line>
			</svg>
			<div class="text-sm text-warning-800 dark:text-warning-200">
				<p class="font-medium">Notes are stored in your browser's local storage</p>
				<p class="mt-1 opacity-80">
					They will be lost if you clear your browser data, use a different browser, or use a different device.
					Use the <strong>Export JSON</strong> button regularly to back up your notes.
				</p>
			</div>
		</div>
	</div>

	<!-- Filter & Sort Controls -->
	{#if notesStore.count > 0}
		<div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
			<!-- Collection filter -->
			<div class="flex items-center gap-2">
				<label for="collection-filter" class="text-sm font-medium whitespace-nowrap">Collection:</label>
				<select
					id="collection-filter"
					class="text-sm rounded-md px-2 py-1.5"
					bind:value={selectedCollection}
				>
					<option value="all">All Collections</option>
					{#each collectionKeys as key}
						<option value={key}>{getDisplayName(key)}</option>
					{/each}
				</select>
			</div>

			<!-- Sort -->
			<div class="flex items-center gap-2">
				<label for="sort-by" class="text-sm font-medium whitespace-nowrap">Sort by:</label>
				<select
					id="sort-by"
					class="text-sm rounded-md px-2 py-1.5"
					bind:value={sortBy}
				>
					<option value="hadith">Hadith Number</option>
					<option value="date-desc">Newest First</option>
					<option value="date-asc">Oldest First</option>
				</select>
			</div>
		</div>
	{/if}

	<!-- Notes list -->
	{#if notesStore.count === 0}
		<div class="card p-8 text-center">
			<svg class="w-12 h-12 mx-auto mb-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
				<polyline points="14 2 14 8 20 8"></polyline>
				<line x1="16" y1="13" x2="8" y2="13"></line>
				<line x1="16" y1="17" x2="8" y2="17"></line>
				<polyline points="10 9 9 9 8 9"></polyline>
			</svg>
			<p class="text-lg font-medium opacity-60">No notes yet</p>
			<p class="text-sm opacity-40 mt-1">Add notes while reading hadiths and they will appear here.</p>
		</div>
	{:else if filteredNotes.length === 0}
		<div class="card p-6 text-center">
			<p class="opacity-60">No notes in this collection.</p>
		</div>
	{:else}
		<p class="text-sm opacity-60">
			{filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
			{#if selectedCollection === 'all'}
				across {displayCollectionKeys.length} collection{displayCollectionKeys.length !== 1 ? 's' : ''}
			{/if}
		</p>

		{#each displayCollectionKeys as collection}
			<div class="card p-4 space-y-3">
				<h2
					class="font-semibold text-lg text-primary-700-300"
					style={getCollectionFontStyle(collection)}
					dir={getCollectionDir(collection)}
				>{getDisplayName(collection)}</h2>
				<div class="space-y-2">
					{#each groupedNotes[collection] as note (note.id)}
						<div class="p-3 rounded-md bg-surface-100-900 border border-surface-200-700 flex flex-col sm:flex-row sm:items-start gap-2">
							<div class="flex-1 min-w-0">
								<a
									href="{base}/{note.collectionShortName}:{note.hadithNum}?lang={languageStore.value.toString()}"
									class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
									style={getCollectionFontStyle(note.collectionShortName)}
									dir={getCollectionDir(note.collectionShortName)}
								>
									{getDisplayName(note.collectionShortName)} : {note.hadithNum}
								</a>
								<p class="mt-1 text-sm whitespace-pre-wrap break-words" style={getNoteFontStyle()}>{note.text}</p>
								<p class="mt-1 text-xs opacity-50">{formatDate(note.createdAt)}</p>
							</div>
							<button
								class="btn btn-sm preset-tonal-error shrink-0 self-start"
								onclick={() => deleteNote(note.id)}
								title="Delete note"
							>
								<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<polyline points="3 6 5 6 21 6"></polyline>
									<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
								</svg>
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>
