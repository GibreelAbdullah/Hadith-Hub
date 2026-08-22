import { browser } from '$app/environment';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Note {
	id: string;
	collectionShortName: string;
	hadithNum: string;
	text: string;
	createdAt: string; // ISO string
	updatedAt: string; // ISO string
}

export interface NotesData {
	notes: Note[];
	version: number;
}

// ─── LZ Compression (lightweight UTF-16 based) ──────────────────────────────

// LZW compress to UTF-16 string
function compressToUTF16(input: string): string {
	if (!input) return '';
	let dictSize = 256;
	const dict: Map<string, number> = new Map();
	for (let i = 0; i < 256; i++) {
		dict.set(String.fromCharCode(i), i);
	}

	const output: number[] = [];
	let w = '';

	for (let i = 0; i < input.length; i++) {
		const c = input[i];
		const wc = w + c;
		if (dict.has(wc)) {
			w = wc;
		} else {
			output.push(dict.get(w)!);
			dict.set(wc, dictSize++);
			w = c;
		}
	}
	if (w) {
		output.push(dict.get(w)!);
	}

	// Encode as UTF-16: each code gets +1 offset to avoid null chars
	return output.map((code) => String.fromCharCode(code + 1)).join('');
}

function decompressFromUTF16(compressed: string): string {
	if (!compressed) return '';

	// Decode from UTF-16
	const codes: number[] = [];
	for (let i = 0; i < compressed.length; i++) {
		codes.push(compressed.charCodeAt(i) - 1);
	}

	let dictSize = 256;
	const dict: Map<number, string> = new Map();
	for (let i = 0; i < 256; i++) {
		dict.set(i, String.fromCharCode(i));
	}

	let w = String.fromCharCode(codes[0]);
	const result: string[] = [w];

	for (let i = 1; i < codes.length; i++) {
		const code = codes[i];
		let entry: string;
		if (dict.has(code)) {
			entry = dict.get(code)!;
		} else if (code === dictSize) {
			entry = w + w[0];
		} else {
			throw new Error('Invalid compressed data at index ' + i);
		}
		result.push(entry);
		dict.set(dictSize++, w + entry[0]);
		w = entry;
	}
	return result.join('');
}

// ─── Storage Helpers ─────────────────────────────────────────────────────────

const STORAGE_KEY = 'hadithHub_notes';
const CURRENT_VERSION = 1;

function saveToStorage(data: NotesData): void {
	if (!browser) return;
	try {
		const json = JSON.stringify(data);
		const compressed = compressToUTF16(json);
		localStorage.setItem(STORAGE_KEY, compressed);
	} catch (error) {
		console.warn('Failed to save notes to localStorage:', error);
	}
}

function loadFromStorage(): NotesData {
	const empty: NotesData = { notes: [], version: CURRENT_VERSION };
	if (!browser) return empty;
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return empty;

		// Try decompressing first
		try {
			const json = decompressFromUTF16(stored);
			const data = JSON.parse(json) as NotesData;
			if (data.notes && Array.isArray(data.notes)) return data;
		} catch {
			// Decompression failed — try parsing as plain JSON (migration path)
		}

		console.warn('Failed to load notes: unrecognized format. Starting fresh.');
		return empty;
	} catch (error) {
		console.warn('Failed to load notes from localStorage:', error);
		return empty;
	}
}

// ─── Notes Store ─────────────────────────────────────────────────────────────

function createNotesStore() {
	let data = $state<NotesData>(loadFromStorage());

	function persist() {
		saveToStorage(data);
	}

	return {
		get notes() {
			return data.notes;
		},

		/** Get notes for a specific hadith */
		getNotesForHadith(collectionShortName: string, hadithNum: string): Note[] {
			return data.notes.filter(
				(n) => n.collectionShortName === collectionShortName && n.hadithNum === hadithNum
			);
		},

		/** Check if a hadith has any notes */
		hasNotes(collectionShortName: string, hadithNum: string): boolean {
			return data.notes.some(
				(n) => n.collectionShortName === collectionShortName && n.hadithNum === hadithNum
			);
		},

		/** Add a new note */
		addNote(collectionShortName: string, hadithNum: string, text: string): Note {
			const now = new Date().toISOString();
			const note: Note = {
				id: crypto.randomUUID(),
				collectionShortName,
				hadithNum,
				text,
				createdAt: now,
				updatedAt: now,
			};
			data = { ...data, notes: [...data.notes, note] };
			persist();
			return note;
		},

		/** Update an existing note */
		updateNote(id: string, text: string): void {
			data = {
				...data,
				notes: data.notes.map((n) =>
					n.id === id ? { ...n, text, updatedAt: new Date().toISOString() } : n
				),
			};
			persist();
		},

		/** Delete a note by ID */
		deleteNote(id: string): void {
			data = { ...data, notes: data.notes.filter((n) => n.id !== id) };
			persist();
		},

		/** Delete all notes for a specific hadith */
		deleteNotesForHadith(collectionShortName: string, hadithNum: string): void {
			data = {
				...data,
				notes: data.notes.filter(
					(n) => !(n.collectionShortName === collectionShortName && n.hadithNum === hadithNum)
				),
			};
			persist();
		},

		/** Export all notes as a JSON string (uncompressed, for user download) */
		exportJSON(): string {
			return JSON.stringify(
				{ notes: data.notes, version: CURRENT_VERSION, exportedAt: new Date().toISOString() },
				null,
				2
			);
		},

		/** Import notes from a JSON string. Merges with existing notes (skips duplicates by ID). */
		importJSON(json: string): { imported: number; skipped: number } {
			const imported = JSON.parse(json) as { notes: Note[]; version?: number };
			if (!imported.notes || !Array.isArray(imported.notes)) {
				throw new Error('Invalid notes file: missing notes array');
			}

			const existingIds = new Set(data.notes.map((n) => n.id));
			const newNotes: Note[] = [];
			let skipped = 0;

			for (const note of imported.notes) {
				if (!note.id || !note.collectionShortName || !note.hadithNum || !note.text) {
					skipped++;
					continue;
				}
				if (existingIds.has(note.id)) {
					skipped++;
					continue;
				}
				newNotes.push({
					id: note.id,
					collectionShortName: note.collectionShortName,
					hadithNum: note.hadithNum,
					text: note.text,
					createdAt: note.createdAt || new Date().toISOString(),
					updatedAt: note.updatedAt || new Date().toISOString(),
				});
			}

			data = { ...data, notes: [...data.notes, ...newNotes] };
			persist();
			return { imported: newNotes.length, skipped };
		},

		/** Clear all notes */
		clearAll(): void {
			data = { notes: [], version: CURRENT_VERSION };
			persist();
		},

		/** Get total count */
		get count(): number {
			return data.notes.length;
		},
	};
}

export const notesStore = createNotesStore();
