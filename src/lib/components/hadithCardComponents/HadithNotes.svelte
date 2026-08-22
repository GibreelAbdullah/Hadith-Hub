<script lang="ts">
	import { notesStore, type Note } from '$lib/functions/notesStore.svelte';

	interface Props {
		collectionShortName: string;
		hadithNum: string;
		showPanel?: boolean;
	}

	let { collectionShortName, hadithNum, showPanel = $bindable(false) }: Props = $props();

	let newNoteText = $state('');
	let editingId = $state<string | null>(null);
	let editText = $state('');

	let notes = $derived(notesStore.getNotesForHadith(collectionShortName, hadithNum));

	function addNote() {
		const text = newNoteText.trim();
		if (!text) return;
		notesStore.addNote(collectionShortName, hadithNum, text);
		newNoteText = '';
	}

	function startEdit(note: Note) {
		editingId = note.id;
		editText = note.text;
	}

	function saveEdit() {
		if (editingId && editText.trim()) {
			notesStore.updateNote(editingId, editText.trim());
		}
		editingId = null;
		editText = '';
	}

	function cancelEdit() {
		editingId = null;
		editText = '';
	}

	function deleteNote(id: string) {
		notesStore.deleteNote(id);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			addNote();
		}
	}

	function handleEditKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			saveEdit();
		}
		if (e.key === 'Escape') {
			cancelEdit();
		}
	}
</script>

<!-- Notes panel (shown when toggled from the button in reference.svelte) -->
{#if showPanel}
	<div class="px-3 pb-3 pt-2">
		<div class="p-3 rounded-lg border border-surface-300-600 bg-surface-100-900 space-y-3">
			<!-- Existing notes -->
			{#if notes.length > 0}
				<div class="space-y-2">
					{#each notes as note (note.id)}
						<div class="p-2 rounded-md bg-surface-200-800 text-sm">
							{#if editingId === note.id}
								<textarea
									class="w-full p-2 rounded border border-surface-300-600 bg-surface-50-950 text-sm resize-none"
									rows="3"
									bind:value={editText}
									onkeydown={handleEditKeydown}
								></textarea>
								<div class="flex gap-2 mt-1.5">
									<button class="btn btn-sm preset-filled-primary-500 text-xs px-2 py-1" onclick={saveEdit}>Save</button>
									<button class="btn btn-sm preset-tonal-surface text-xs px-2 py-1" onclick={cancelEdit}>Cancel</button>
								</div>
							{:else}
								<p class="whitespace-pre-wrap break-words">{note.text}</p>
								<div class="flex items-center justify-between mt-1.5 text-xs opacity-60">
									<span>{new Date(note.updatedAt).toLocaleDateString()}</span>
									<div class="flex gap-2">
										<button class="hover:text-primary-500 transition-colors" onclick={() => startEdit(note)} title="Edit note">
											<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
												<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
											</svg>
										</button>
										<button class="hover:text-error-500 transition-colors" onclick={() => deleteNote(note.id)} title="Delete note">
											<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<polyline points="3 6 5 6 21 6"></polyline>
												<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
											</svg>
										</button>
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}

			<!-- Add new note -->
			<div class="flex gap-2">
				<textarea
					class="flex-1 p-2 rounded border border-surface-300-600 bg-surface-50-950 text-sm resize-none"
					rows="2"
					placeholder="Add a note for this hadith..."
					bind:value={newNoteText}
					onkeydown={handleKeydown}
				></textarea>
				<button
					class="btn btn-sm preset-filled-primary-500 self-end px-3"
					onclick={addNote}
					disabled={!newNoteText.trim()}
				>
					Add
				</button>
			</div>
			<p class="text-xs opacity-50">Press Enter to add. Shift+Enter for new line.</p>
		</div>
	</div>
{/if}
