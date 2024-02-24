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

// export const collectionPromiseNew = Promise.resolve(JSON.parse(`
// {
//   "collections": [
//       {
//           "name": "bukhari",
//           "eng-name": "Sahih al Bukhari",
//           "ara-name": "صحيح البخاري",
//           "order": 1,
//           "availableLanguages": [
//               "ara",
//               "ara",
//               "ben",
//               "eng",
//               "ind",
//               "rus",
//               "tam",
//               "tur",
//               "urd"
//           ]
//       },
//       {
//           "name": "muslim",
//           "eng-name": "Sahih Muslim",
//           "ara-name": "صحيح مسلم",
//           "order": 2,
//           "availableLanguages": [
//               "ara",
//               "ara",
//               "ben",
//               "eng",
//               "fra",
//               "ind",
//               "rus",
//               "tam",
//               "tur",
//               "urd"
//           ]
//       },
//       {
//           "name": "nasai",
//           "eng-name": "Sunan an Nasai",
//           "ara-name": "سنن النسائي",
//           "order": 3,
//           "availableLanguages": [
//               "ara",
//               "ara",
//               "ben",
//               "eng",
//               "ind",
//               "tur",
//               "urd"
//           ]
//       },
//       {
//           "name": "abudawud",
//           "eng-name": "Sunan Abu Dawud",
//           "ara-name": "سنن أبي داود",
//           "order": 4,
//           "availableLanguages": [
//               "ara",
//               "ara",
//               "ben",
//               "eng",
//               "ind",
//               "rus",
//               "tur",
//               "urd"
//           ]
//       },
//       {
//           "name": "tirmidhi",
//           "eng-name": "Jami At Tirmidhi",
//           "ara-name": "جامع الترمذي",
//           "order": 5,
//           "availableLanguages": [
//               "ara",
//               "ara",
//               "ben",
//               "eng",
//               "ind",
//               "tur",
//               "urd"
//           ]
//       },
//       {
//           "name": "ibnmajah",
//           "eng-name": "Sunan Ibn Majah",
//           "ara-name": "سنن ابن ماجه",
//           "order": 6,
//           "availableLanguages": [
//               "ara",
//               "ara",
//               "ben",
//               "eng",
//               "ind",
//               "tur",
//               "urd"
//           ]
//       },
//       {
//           "name": "malik",
//           "eng-name": "Muwatta Malik",
//           "ara-name": "موطأ مالك",
//           "order": 7,
//           "availableLanguages": [
//               "ara",
//               "ara",
//               "ben",
//               "eng",
//               "fra",
//               "ind",
//               "tur",
//               "urd"
//           ]
//       },
//       {
//           "name": "qudsi",
//           "eng-name": "Forty Hadith Qudsi",
//           "ara-name": "الحديث القدسي",
//           "order": 8,
//           "availableLanguages": [
//               "ara",
//               "eng"
//           ]
//       },
//       {
//           "name": "nawawi",
//           "eng-name": "Forty Hadith of an-Nawawi",
//           "ara-name": "الأربعين النووية",
//           "order": 9,
//           "availableLanguages": [
//               "ara",
//               "ben",
//               "eng"
//           ]
//       },
//       {
//           "name": "dehlawi",
//           "eng-name": "Forty Hadith of Shah Waliullah Dehlawi",
//           "ara-name": "الأربعين شاه ولي الله الدهلوي",
//           "order": 10,
//           "availableLanguages": [
//               "ara",
//               "eng"
//           ]
//       },
//       {
//           "name": "abuhanifa",
//           "eng-name": "Musnad Imam Abu Hanifa",
//           "ara-name": "مسند أبي حنيفة",
//           "order": 11,
//           "availableLanguages": [
//               "ara"
//           ]
//       }
//   ]
// }
// `));

export async function getCollectionFullName(collectionShortName: string[]) {
  let collectionFullNames: string[] = [];
  let collectionObject = await collectionPromise;

  collectionObject.collections.forEach((collection: { [x: string]: string; }) => {
    if (collectionShortName.includes(collection["name"]!)) {
      collectionFullNames.push(collection["eng-name"]);
    }
  });
  return collectionFullNames;
}