import { urlPrefix, collectionsQueryString, languageQueryString } from "../data/constantsV2";
import { languageStore } from '$lib/functions/store.svelte';

export const getData = async (url: string) => {
//   console.log('url {}', url)
  return await fetch(url).then((response) => {
    return response.json();
  });
}

export const collectionPromise = getData(`${urlPrefix}${collectionsQueryString}&langs=${languageStore.value.toString()}`);

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

// export async function getCollectionPromise() {
//   var languages:string = ''; 
//   selectedLanguagesStore.subscribe((selectedLanguages) => {
//     languages = selectedLanguages.filter(lang => lang !== '').toString();
//   });
  
//   return getData(`${urlPrefix}${collectionsQueryString}&langs=${languages}`);
// }

// export const collectionUrl = `${urlPrefix}${collectionsQueryString}`

// export async function getCollectionFullName(collectionShortName: string[]) {
//   let collectionFullNames: string[] = [];
//   let collectionObject = await getCollectionPromise();

//   collectionObject.collections.forEach((collectionCategories: { [x: string]: { [x: string]: string; }[]; }) => {
//     collectionCategories["books"].forEach((collection: { [x: string]: string; }) => {
//       if (collectionShortName.includes(collection["name"]!)) {
//         collectionFullNames.push(collection["eng-name"]);
//       }
//     });
//   });
//   return collectionFullNames;
// }