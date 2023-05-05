import { languagePromise } from "./sideBarContents.svelte";

export const getData = async (url: string) => {
  return await fetch(url).then((response) => {
    return response.json();
  });
}

export async function getBookName(unavailableBooks: string[]) {
  let unavailableBookFullNames: string[] = [];
  let languageObject = await languagePromise;
  for (let keys in Object.keys(languageObject)) {
    if (
      unavailableBooks.includes(languageObject[parseInt(keys) + 1]["Prefix"])
    ) {
      unavailableBookFullNames.push(
        languageObject[parseInt(keys) + 1]["Name"]
      );
    }
  }
  return unavailableBookFullNames;
}