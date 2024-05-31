import { urlPrefix, languageUrl, collectionsUrl } from "./constants";

export const getData = async (url: string) => {
  return await fetch(url).then((response) => {
    return response.json();
  });
}

export async function getSearchResults(query: String, lang: String, collection: String) {
  import('$lib/common/sqlclient').then((sqlbro) => {
    sqlbro.initDbConfig({baseUrl: "https://raw.githubusercontent.com/GibreelAbdullah/hadith-db/master/database/", fileName: "config.json"});
    const data = sqlbro
      .query(searchQuery(query, lang, collection));
      data.then((resolvedData) => {
        console.log(resolvedData);
      });
    return data;
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

function searchQuery(query: String, lang: String, collection: String) {
  let langFilter = '';
  if (lang !== null) {
      langFilter = `AND "language" MATCH "${lang.replace(/,/g, " OR ")}"`;
  }
  let collectionFilter = '';
  if (collection !== null && collection !== '' && collection !== ',') {
      collectionFilter = `AND "shortname" MATCH "${collection.replace(/,/g, " OR ")}"`;
  }

  var x = `
  select
      hadithnumber ,
      highlight(hadith,
      1 ,
      '<span style="color:red;">',
      '</span>') arabicnumber ,
      highlight(hadith,
      2 ,
      '<span style="color:red;">',
      '</span>') "text" ,
      grades ,
      highlight(hadith,
      4 ,
      '<span style="color:red;">',
      '</span>') bookNumber ,
      highlight(hadith,
      5 ,
      '<span style="color:red;">',
      '</span>') bookhadith ,
      highlight(hadith,
      6 ,
      '<span style="color:red;">',
      '</span>') bookname,
      language,
      shortname
  from
      hadith
  WHERE hadith
  MATCH "${query}"
  and text != ""
  and text != "empty"
  ${langFilter}
  ${collectionFilter}
  LIMIT 1
  `;
        console.log(x)
  return x;
}
