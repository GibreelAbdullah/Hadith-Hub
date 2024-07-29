<script lang="ts">
  import CollectionContainer from "$lib/components/collectionContainer.svelte";
  import { page } from "$app/stores";
	import { collectionPromise } from "$lib/common/utils";
</script>

<svelte:head>
  <!-- HTML Meta Tags -->
  <title>HadithHub | حدیث Hadith হাদিস хадис Hadis</title>
  <meta name="description" content="Hadith with Tahqeeq in العربية, বাংলা, English, français, Bahasa Indonesia, Русский, தமிழ், Türkçe, اردو" />

  <!-- Facebook Meta Tags -->
  <meta property="og:url" content={$page.url.toString()} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="HadithHub | حدیث Hadith হাদিস хадис Hadis" />
  <meta
    property="og:description"
    content="Hadith with Tahqeeq in العربية, বাংলা, English, français, Bahasa Indonesia, Русский, தமிழ், Türkçe, اردو"
  />
  <meta property="og:image" content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg" />

  <!-- Twitter Meta Tags -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={$page.url.hostname} />
  <meta property="twitter:url" content={$page.url.toString()} />
  <meta property="twitter:title" content="HadithHub | حدیث Hadith হাদিস хадис Hadis" />
  <meta
    property="twitter:description"
    content="Hadith with Tahqeeq in العربية, বাংলা, English, français, Bahasa Indonesia, Русский, தமிழ், Türkçe, اردو"
  />
  <meta property="twitter:image" content="https://raw.githubusercontent.com/GibreelAbdullah/Hadith-Hub/master/Header.jpg" />
</svelte:head>

<main>
  <CollectionContainer dataPromise={collectionPromise} />
</main>
