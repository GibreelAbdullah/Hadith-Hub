import { browser } from '$app/environment';

// URL for text file range requests (can be cross-origin)
export const DATA_BASE_URL = import.meta.env.VITE_DB_BASE_URL || '/db';
// URL for metadata/collections (same-origin for fast loading)
export const META_BASE_URL = import.meta.env.VITE_META_BASE_URL || DATA_BASE_URL;

interface CollectionsData {
	languages: { short_name: string; full_name: string; rtl: boolean }[];
	collections: { short_name: string; ar: string; en: string }[];
	categories?: { name: Record<string, string>; collections: string[] }[];
}

interface BookMeta {
	number: string;
	ar: string;
	en: string;
	hadith_start: number;
	hadith_end: number;
}

interface HadithRecord {
	line: number;
	cat: string;
	book?: string;
	chapter?: string;
	num?: string;
	num_book?: number;
}

export interface Author {
	name?: string;
	aka?: string;
	died?: string;
}

export interface Metadata {
	collection: string;
	languages: string[];
	books: BookMeta[];
	records: HadithRecord[];
	offsets: { [lang: string]: number[] };
	collection_info: { [lang: string]: string };
	collection_intro: { [lang: string]: string };
	author?: Author;
}

// Cache
let collectionsCache: CollectionsData | null = null;
const metadataCache: Map<string, Metadata> = new Map();

let collectionsFetching: Promise<CollectionsData> | null = null;

export async function getCollections(): Promise<CollectionsData> {
	if (!browser) return { languages: [], collections: [] };
	if (collectionsCache) return collectionsCache;
	if (!collectionsFetching) {
		collectionsFetching = fetch(`${META_BASE_URL}/collections.json`)
			.then(res => res.json())
			.then(data => { collectionsCache = data; return data; });
	}
	return collectionsFetching;
}

const metadataFetching: Map<string, Promise<Metadata>> = new Map();

export async function getMetadata(collection: string): Promise<Metadata | null> {
	if (!browser) return null;
	if (metadataCache.has(collection)) return metadataCache.get(collection)!;
	if (!metadataFetching.has(collection)) {
		const promise = fetch(`${META_BASE_URL}/books/${collection}/metadata.json`)
			.then(res => res.json())
			.then(meta => { metadataCache.set(collection, meta); metadataFetching.delete(collection); return meta; });
		metadataFetching.set(collection, promise);
	}
	return metadataFetching.get(collection)!;
}

const rangeCache: Map<string, string> = new Map();
const rangeFetching: Map<string, Promise<string>> = new Map();

export async function fetchTextRange(
	collection: string,
	lang: string,
	startByte: number,
	endByte: number
): Promise<string> {
	const key = `${collection}/${lang}/${startByte}-${endByte}`;
	if (rangeCache.has(key)) return rangeCache.get(key)!;
	if (!rangeFetching.has(key)) {
		const url = `${DATA_BASE_URL}/books/${collection}/${lang}.txt`;
		const promise = fetch(url, {
			headers: { Range: `bytes=${startByte}-${endByte}` }
		})
			.then(res => res.arrayBuffer())
			.then(buf => {
				const text = new TextDecoder("utf-8").decode(buf);
				rangeCache.set(key, text);
				rangeFetching.delete(key);
				return text;
			});
		rangeFetching.set(key, promise);
	}
	return rangeFetching.get(key)!;
}

export async function fetchLines(
	collection: string,
	lang: string,
	startLine: number,
	endLine: number,
	meta: Metadata
): Promise<string[]> {
	const offsets = meta.offsets[lang];
	if (!offsets) return [];
	const startByte = offsets[startLine];
	const endByte = offsets[endLine + 1] - 1;
	const text = await fetchTextRange(collection, lang, startByte, endByte);
	return text
		.split('\n')
		.filter((_, i, arr) => i < arr.length - 1 || arr[arr.length - 1] !== '')
		.map((line) => {
			// Strip "category|num|" prefix
			const firstPipe = line.indexOf('|');
			if (firstPipe === -1) return line;
			const secondPipe = line.indexOf('|', firstPipe + 1);
			if (secondPipe === -1) return line;
			return line.slice(secondPipe + 1).replace(/\\n/g, '<br>');
		});
}

// Scholar/Muhaddith data
export interface ScholarData {
	dates?: string;
	bio?: string;
	image?: string;
	[key: string]: string | undefined;
}

const scholarCache: Map<string, ScholarData | null> = new Map();
const scholarFetching: Map<string, Promise<ScholarData | null>> = new Map();

export async function getScholar(name: string): Promise<ScholarData | null> {
	if (!browser) return null;
	if (scholarCache.has(name)) return scholarCache.get(name)!;
	if (scholarFetching.has(name)) return scholarFetching.get(name)!;
	const promise = fetch(`${DATA_BASE_URL}/muhaddith/${encodeURIComponent(name)}.min.json`)
		.then(res => {
			if (!res.ok) {
				scholarCache.set(name, null);
				return null;
			}
			return res.json();
		})
		.then((data: ScholarData | null) => {
			scholarCache.set(name, data);
			scholarFetching.delete(name);
			return data;
		})
		.catch(() => {
			scholarCache.set(name, null);
			scholarFetching.delete(name);
			return null;
		});
	scholarFetching.set(name, promise);
	return promise;
}

// Gradings per collection (loaded separately from metadata)
const gradingsCache: Map<string, Record<string, any[]>> = new Map();
const gradingsFetching: Map<string, Promise<Record<string, any[]>>> = new Map();

export async function getGradings(collection: string): Promise<Record<string, any[]>> {
	if (!browser) return {};
	if (gradingsCache.has(collection)) return gradingsCache.get(collection)!;
	if (gradingsFetching.has(collection)) return gradingsFetching.get(collection)!;
	const promise = fetch(`${DATA_BASE_URL}/books/${collection}/gradings.json`)
		.then(res => {
			if (!res.ok) return {};
			return res.json();
		})
		.then((data: Record<string, any[]>) => {
			gradingsCache.set(collection, data);
			gradingsFetching.delete(collection);
			return data;
		})
		.catch(() => {
			gradingsCache.set(collection, {});
			gradingsFetching.delete(collection);
			return {};
		});
	gradingsFetching.set(collection, promise);
	return promise;
}
