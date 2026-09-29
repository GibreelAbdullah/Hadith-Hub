import { browser } from '$app/environment';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RecentEntry {
	collectionShortName: string;
	bookNumber: string;
	/** Hadith number within the collection (used for the resume URL) */
	hadithNum: string;
	/** Hadith number within its book (informational) */
	hadithNumberInBook: string;
	updatedAt: string; // ISO string
}

export interface RecentData {
	entries: RecentEntry[];
	version: number;
}

// ─── LZ Compression (lightweight UTF-16 based) ──────────────────────────────
// Mirrors the approach used by notesStore so storage behaves consistently.

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

	return output.map((code) => String.fromCharCode(code + 1)).join('');
}

function decompressFromUTF16(compressed: string): string {
	if (!compressed) return '';

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

const STORAGE_KEY = 'hadithHub_recent';
const CURRENT_VERSION = 1;
const MAX_ENTRIES = 5;

function saveToStorage(data: RecentData): void {
	if (!browser) return;
	try {
		const json = JSON.stringify(data);
		const compressed = compressToUTF16(json);
		localStorage.setItem(STORAGE_KEY, compressed);
	} catch (error) {
		console.warn('Failed to save recent list to localStorage:', error);
	}
}

function loadFromStorage(): RecentData {
	const empty: RecentData = { entries: [], version: CURRENT_VERSION };
	if (!browser) return empty;
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return empty;

		try {
			const json = decompressFromUTF16(stored);
			const data = JSON.parse(json) as RecentData;
			if (data.entries && Array.isArray(data.entries)) return data;
		} catch {
			// Decompression failed — start fresh (disposable feature, no migration needed)
		}

		console.warn('Failed to load recent list: unrecognized format. Starting fresh.');
		return empty;
	} catch (error) {
		console.warn('Failed to load recent list from localStorage:', error);
		return empty;
	}
}

// ─── Recent Store ────────────────────────────────────────────────────────────

function createRecentStore() {
	let data = $state<RecentData>(loadFromStorage());

	function persist() {
		saveToStorage(data);
	}

	return {
		get entries() {
			return data.entries;
		},

		/**
		 * Record the hadith the user is currently reading. Dedup key is
		 * collection + book: revisiting a book updates its existing entry's
		 * position + timestamp and moves it to the front, capped at 5 books.
		 */
		record(entry: {
			collectionShortName: string;
			bookNumber: string;
			hadithNum: string;
			hadithNumberInBook: string;
		}): void {
			if (!entry.collectionShortName || !entry.hadithNum) return;

			const existing = data.entries.find(
				(e) =>
					e.collectionShortName === entry.collectionShortName &&
					e.bookNumber === entry.bookNumber
			);

			// No-op if the exact same hadith is already at the front — avoids
			// redundant writes while scrolling within one card.
			if (
				existing &&
				existing.hadithNum === entry.hadithNum &&
				data.entries[0] === existing
			) {
				return;
			}

			const updated: RecentEntry = {
				collectionShortName: entry.collectionShortName,
				bookNumber: entry.bookNumber,
				hadithNum: entry.hadithNum,
				hadithNumberInBook: entry.hadithNumberInBook,
				updatedAt: new Date().toISOString(),
			};

			const rest = data.entries.filter(
				(e) =>
					!(
						e.collectionShortName === entry.collectionShortName &&
						e.bookNumber === entry.bookNumber
					)
			);

			data = { ...data, entries: [updated, ...rest].slice(0, MAX_ENTRIES) };
			persist();
		},

		/** Clear all recent entries */
		clearAll(): void {
			data = { entries: [], version: CURRENT_VERSION };
			persist();
		},

		get count(): number {
			return data.entries.length;
		},
	};
}

export const recentStore = createRecentStore();
