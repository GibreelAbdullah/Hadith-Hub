<script lang="ts">
    import { page } from "$app/stores";

  import { clipboard, Divider } from "@brainandbones/skeleton";
  export let book = "";
  export let allHadiths: any[] = [];
  let languageCount = allHadiths.length;
  let permalinkText = "Copy Permalink";
  let gradingColorClass = "";
  const clickHandler = () => {
    permalinkText = "Copied";
    setTimeout(() => {
      permalinkText = "Copy Permalink";
    }, 2000);
  }
  const gradingColor = (grade: string) => {
    if (!grade) {
      return;
    } else if (
      ["hasan", "mursal"].some((i) => grade.toLowerCase().includes(i))
    ) {
      gradingColorClass = "bg-indigo-600";
    } else if (grade.toLowerCase().includes("sahih")) {
      gradingColorClass = "bg-emerald-500";
    } else if (
      ["mawdu", "batil", "munkar"].some((i) => grade.toLowerCase().includes(i))
    ) {
      gradingColorClass = "bg-red-500";
    } else if (grade.toLowerCase().includes("daif")) {
      gradingColorClass = "bg-orange-500";
    } else {
      gradingColorClass = "bg-gray-500";
    }
    return gradingColorClass;
  }
</script>

{#each { length: allHadiths[0].hadiths.length } as _, i}
  <div class="card card-body m-4 flex-wrap">
    <!-- HADITH TEXT -->
    <div class="hadithGroup font-medium p-2 grid">
      {#each { length: languageCount } as _, j}
        <div class="break-words leading-7 m-3">
          {#if !allHadiths[j].hadiths[i] || allHadiths[j].hadiths[i].text == '' }
            <center><code>Hadith translation not found</code></center>
          {:else}
            {@html allHadiths[j].hadiths[i].text}
          {/if}
        </div>
      {/each}
    </div>
    <Divider borderWidth="border-l" />
    <!-- GRADINGS -->
    <div class="hadithGroup font-medium p-2 grid">
      {#each allHadiths[0].hadiths[i].grades as grade}
        <div
          class="flex leading-7 p-2 rounded-full text-center bg-red m-2 {gradingColor(
            grade['grade']
          )}"
        >
          <div class="m-auto">
            {@html grade["name"] + " : " + grade["grade"]}
          </div>
        </div>
      {/each}
    </div>
    <Divider borderWidth="border-l" />
    <div class="flex justify-between px-4">
      <div class="my-4">
        {#if allHadiths[0].metadata}
          {@html allHadiths[0].metadata.name}
        {:else}
          {@html allHadiths[0].hadiths[i].bookName}
        {/if}
        {@html allHadiths[0].hadiths[i].hadithnumber}
        <br />
        Book {@html allHadiths[0].hadiths[i].reference.book}, Hadith {@html allHadiths[0]
          .hadiths[i].reference.hadith}
      </div>

      <button
        class="btn bg-primary-500 btn-sm text-white w-40 my-4 px-4"
        on:click={clickHandler}
        use:clipboard={$page.url.host + "/" +
          (allHadiths[0].hadiths[i].shortName ?? book) +
          ":" +
          allHadiths[0].hadiths[i].hadithnumber
            .toString()
            .replace('<span style="color:red;">', "")
            .replace("</span>", "")}
        >{permalinkText}
      </button>
    </div>
  </div>
{/each}

<style>
  .hadithGroup {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .gradingGroup {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
</style>
