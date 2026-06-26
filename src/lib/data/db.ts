import { browser } from '$app/environment';

export const DATA_BASE_URL = import.meta.env.VITE_DB_BASE_URL || "https://raw.githubusercontent.com/GibreelAbdullah/hadith-db/refs/heads/master/data";
// export const DATA_BASE_URL = import.meta.env.VITE_DB_BASE_URL || '/db';

interface CollectionsData {
	languages: { short_name: string; full_name: string; rtl: boolean }[];
	collections: { short_name: string; ar: string; en: string }[];
}

interface BookMeta {
	number: string;
	ar: string;
	en: string;
	hadith_start: number;
	hadith_end: number;
}

interface Record {
	line: number;
	cat: string;
	book?: string;
	chapter?: string;
	num?: string;
	num_book?: number;
}

export interface Metadata {
	collection: string;
	languages: string[];
	books: BookMeta[];
	records: Record[];
	offsets: { [lang: string]: number[] };
	collection_info: { [lang: string]: string };
	collection_intro: { [lang: string]: string };
}

// Cache
let collectionsCache: CollectionsData | null = null;
const metadataCache: Map<string, Metadata> = new Map();

export async function getCollections(): Promise<CollectionsData> {
	if (!browser) return { languages: [], collections: [] };
	if (collectionsCache) return collectionsCache;
	const res = await fetch(`${DATA_BASE_URL}/collections.json`);
	collectionsCache = await res.json();
	return collectionsCache!;
}

export async function getMetadata(collection: string): Promise<Metadata | null> {
	if (!browser) return null;
	if (metadataCache.has(collection)) return metadataCache.get(collection)!;
	const res = await fetch(`${DATA_BASE_URL}/${collection}/metadata.json`);
	const meta: Metadata = await res.json();
	metadataCache.set(collection, meta);
	return meta;
}

const rangeCache: Map<string, string> = new Map();

export async function fetchTextRange(
	collection: string,
	lang: string,
	startByte: number,
	endByte: number
): Promise<string> {
	const key = `${collection}/${lang}/${startByte}-${endByte}`;
	if (rangeCache.has(key)) return rangeCache.get(key)!;
	const url = `${DATA_BASE_URL}/${collection}/${lang}.txt`;
	const res = await fetch(url, {
		headers: { Range: `bytes=${startByte}-${endByte}` }
	});
	const buf = await res.arrayBuffer();
	const text = new TextDecoder('utf-8').decode(buf);
	rangeCache.set(key, text);
	return text;
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
