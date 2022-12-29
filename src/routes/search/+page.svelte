<script lang="ts">
  import { page } from "$app/stores";
  import HadithContainer from "$lib/components/hadithContainer.svelte";
  import { getData } from '$lib/common/utils'

  const title = `Search for "${$page.url.searchParams.get("q")}" | HadithHub`;
  
  $: url =
    "https://hadith-search-api-gibreelabdullah.koyeb.app/search" +
    $page.url.search;
  // const url = "http://0.0.0.0:5000/search" + $page.url.search;
  $: allHadithPromises = getData(url);

  const formatData = (data: [string[]]) => {
    let indiHadith: any[] = [];
    for (const hadithData of data) {
      let hadithDict: any = {};
      hadithDict.hadithnumber = hadithData[0];
      hadithDict.arabicnumber = hadithData[1];
      hadithDict.text = hadithData[2];
      let gradings: any[] = [];
      for (const grading of hadithData[3].split(" && ")) {
        gradings.push({
          name: grading.split("::")[0],
          grade: grading.split("::")[1],
        });
      }
      hadithDict.grades = gradings;
      hadithDict.reference = {
        book: hadithData[4],
        hadith: hadithData[5],
      };
      hadithDict.bookName = hadithData[6];
      hadithDict.shortName = hadithData[8];
      indiHadith.push(hadithDict);
    }
    return { hadiths: indiHadith };
  }
</script>

<svelte:head>
  <!-- HTML Meta Tags -->
  <title>{title}</title>
  <meta name="description" content="A Multi Language collection of Hadith" />

  <!-- Facebook Meta Tags -->
  <meta property="og:url" content={$page.url.toString()} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta
    property="og:description"
    content="A Multi Language collection of Hadith"
  />
  <meta property="og:image" content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg" />

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={$page.url.hostname} />
  <meta property="twitter:url" content={$page.url.toString()} />
  <meta name="twitter:title" content={title} />
  <meta
    name="twitter:description"
    content="A Multi Language collection of Hadith"
  />
  <meta name="twitter:image" content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg" />
</svelte:head>

<main>
  {#await allHadithPromises}
    <div class="card card-body p-4 m-4">
      <div class="hadithGroup font-medium p-2 grid">
        <div class="break-words leading-7 m-3">LOADING...</div>
      </div>
    </div>
  {:then data}
    {#if data.length != 0}
      <HadithContainer
      allHadiths={[formatData(data)]}
      book={$page.params["book"]}/>
    {:else}
      <div class="card card-body p-4 m-4">
        <div class="hadithGroup font-medium p-2 grid">
          <div class="break-words leading-7 m-3">No results found for {$page.url.searchParams.get("q")}. Check if there are any spelling mistakes.</div>
        </div>
      </div>
    {/if}
  {:catch data}
    <div class="card card-body p-4 m-4">
      <div class="hadithGroup font-medium p-2 grid">
        <div class="break-words leading-7 m-3">
          Something went wrong. Kindly report this to our twitter account <a href="https://twitter.com/TheHadithHub" target="blank">TheHadithHub</a> 
        </div>
      </div>
    </div>
  {/await}
</main>
