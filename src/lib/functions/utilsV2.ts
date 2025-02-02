import { urlPrefix, collectionsQueryString } from "../data/constantsV2";

export const getData = async (url: string) => {
  console.log('url {}', url)
  return await fetch(url).then((response) => {
    return response.json();
  });
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