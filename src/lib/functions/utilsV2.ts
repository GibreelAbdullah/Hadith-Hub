import { urlPrefix, collectionsQueryString, languageQueryString, hadithInBookQueryString } from "../data/constantsV2";
import { languageStore } from '$lib/functions/store.svelte';

export const getData = async (url: string) => {
  return await fetch(url).then((response) => {
    return response.json();
  });
}

export function getCollectionPromise() {
  return getData(`${urlPrefix}${collectionsQueryString}&langs=${languageStore.value.toString()}`);
}

export function getHadithPromise(params: Record<string, string>) {
	
  return getData(`${urlPrefix}${hadithInBookQueryString}&langs=${languageStore.value.toString()}&collection=${params.collection}&book_number=${params.bookNumber}`);
}


export const languagePromise = getData(`${urlPrefix}${languageQueryString}`);

export async function getLanguageFullName(languageShortName: string[]) {
		let languageFullNames: string[] = [];
		let languageObject = await languagePromise;

		languageShortName.forEach(shortName => {
			const lang = languageObject.find((item: any[]) => item[0] === shortName);
			if (lang) {
				languageFullNames.push(lang[1]);
			}
		});

	return languageFullNames;
}

export const getHadithData = async (collection: string, book : string, languageStoreValue: string[]) => {
    const selectedLanguages = languageStoreValue.toString().split(',');
    const collectionsData = await $derived(getCollectionPromise());
    const collectionEntry = collectionsData.find((item: any[]) => item[0] === collection);
	const unavailableLanguages = selectedLanguages.filter(lang => !collectionEntry[1].includes(lang));
	const availableLanguages = selectedLanguages.filter(lang => collectionEntry[1].includes(lang));
	console.log('availableLanguages {}', availableLanguages);
	console.log('unavailableLanguages {}', unavailableLanguages);
	return [availableLanguages, unavailableLanguages, await getData(`${urlPrefix}${hadithInBookQueryString}&langs=${availableLanguages.toString()}&collection=${collection}&book_number=${book}`)];
}

export async function isRtl(languageShortName: string) {
    let languageObject = await languagePromise;
    const lang = languageObject.find((item: any[]) => item[0] === languageShortName);
    if (!lang) {
        console.warn(`isRtl: languageShortName '${languageShortName}' not found in languageObject.`);
        return false;
    }
    return lang[2];
}
