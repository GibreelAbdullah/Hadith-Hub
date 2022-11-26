<script lang="ts">
  import { page } from "$app/stores";
  import HadithContainer from "$lib/components/hadithContainer.svelte";
  import { getData } from '$lib/common/utils'

  const url =
    "https://hadith-search-api-gibreelabdullah.koyeb.app/search" +
    $page.url.search;
  // const url = "http://0.0.0.0:5000/search" + $page.url.search;

  const allHadithPromises = getData(url);

  const formatData = (data: [string[]]) => {
    let indiHadith: any[] = [];
    for (const hadithData of data) {
      let hadithDict: any = {};
      hadithDict.hadithnumber = hadithData[0];
      hadithDict.text = hadithData[1];
      let gradings: any[] = [];
      for (const grading of hadithData[2].split(" && ")) {
        gradings.push({
          name: grading.split("::")[0],
          grade: grading.split("::")[1],
        });
      }
      hadithDict.grades = gradings;
      hadithDict.reference = {
        book: hadithData[3],
        hadith: hadithData[4],
      };
      hadithDict.bookName = hadithData[5];
      hadithDict.shortName = hadithData[7];
      indiHadith.push(hadithDict);
    }
    return { hadiths: indiHadith };
  }
</script>

<svelte:head>
  <title>Search for "{$page.url.searchParams.get("q")}" | HadithHub</title>
</svelte:head>

<main>
  {#await allHadithPromises}
    <div class="card card-body m-4">
      <div class="hadithGroup font-medium p-2 grid">
        <div class="break-words leading-7 m-3">LOADING...</div>
      </div>
    </div>
  {:then data}
    <HadithContainer
      allHadiths={[formatData(data)]}
      book={$page.params["book"]}
    />
  {:catch data}
    <div class="card card-body m-4">
      <div class="hadithGroup font-medium p-2 grid">
        <div class="break-words leading-7 m-3">
          Error. Try clearing the cache.
        </div>
      </div>
    </div>
  {/await}
</main>
