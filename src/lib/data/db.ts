import { browser } from '$app/environment';

const DB_BASE_URL =
	'https://raw.githubusercontent.com/GibreelAbdullah/hadith-db/refs/heads/master/';
const PAGE_SIZE = 1024;

let masterWorker: any = null;
const bookWorkers: Map<string, any> = new Map();

async function createWorker(url: string) {
	const mod = await import('sql.js-httpvfs');
	const createDbWorker = mod.createDbWorker || mod.default?.createDbWorker;
	const workerUrl = new URL('sql.js-httpvfs/dist/sqlite.worker.js', import.meta.url);
	const wasmUrl = new URL('sql.js-httpvfs/dist/sql-wasm.wasm', import.meta.url);
	return await createDbWorker(
		[{ from: 'inline', config: { serverMode: 'full', requestChunkSize: PAGE_SIZE, url } }],
		workerUrl.toString(),
		wasmUrl.toString()
	);
}

export async function getMasterDb() {
	if (!browser) return null;
	if (!masterWorker) {
		masterWorker = await createWorker(`${DB_BASE_URL}/master/master.db`);
	}
	return masterWorker;
}

export async function getBookDb(collection: string) {
	if (!browser) return null;
	if (!bookWorkers.has(collection)) {
		const worker = await createWorker(`${DB_BASE_URL}/books/${collection}.db`);
		bookWorkers.set(collection, worker);
	}
	return bookWorkers.get(collection)!;
}
