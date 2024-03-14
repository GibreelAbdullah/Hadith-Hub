import { urlPrefix, languageUrl, collectionsUrl } from "./constants";

export const getData = async (url: string) => {
  return await fetch(url).then((response) => {
    return response.json();
  });
}

// export const getDataHeaders = async (url: string, headers: {}) => {
//   return await fetch(url, {
//     method: 'GET',
//     headers: {
//       'accept': 'application/json',
//       'X-API-KEY': '',
//     },
//   });
// }

export const languagePromise = getData(`${urlPrefix}${languageUrl}`);

export async function getLanguageFullName(languageShortName: string[]) {
  let languageFullNames: string[] = [];
  let languageObject = await languagePromise;
  for (let keys in Object.keys(languageObject)) {
    if (
      languageShortName.includes(languageObject[parseInt(keys) + 1]["Prefix"])
    ) {
      languageFullNames.push(
        languageObject[parseInt(keys) + 1]["Name"]
      );
    }
  }
  return languageFullNames;
}

export const collectionPromise = getData(`${urlPrefix}${collectionsUrl}`);


export async function getCollectionFullName(collectionShortName: string[]) {
  let collectionFullNames: string[] = [];
  let collectionObject = await collectionPromise;

  collectionObject.collections.forEach((collectionCategories: { [x: string]: { [x: string]: string; }[]; }) => {
    collectionCategories["books"].forEach((collection: { [x: string]: string; }) => {
      if (collectionShortName.includes(collection["name"]!)) {
        collectionFullNames.push(collection["eng-name"]);
      }
    });
  });
  return collectionFullNames;
}