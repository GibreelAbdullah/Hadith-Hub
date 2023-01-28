<script lang="ts">
  import { page } from "$app/stores";
  import * as htmlToImage from "html-to-image";
  import { clipboard } from "@skeletonlabs/skeleton";
  import SvgIcon from "../common/svgIcon.svelte";
  import download from "downloadjs";

  export let book = "";
  export let allHadiths: any[] = [];
  export let singleHadithView: boolean = false;
  let languageCount = allHadiths.length;
  let permalinkText = "Copy Link";
  let gradingColorClass = "";
  const clickHandler = () => {
    permalinkText = "Copied";
    setTimeout(() => {
      permalinkText = "Copy Link";
    }, 2000);
  };
  const gradingColor = (grade: string) => {
    if (!grade) {
      return;
    } else if (
      ["hasan", "mursal"].some((i) => grade.toLowerCase().includes(i))
    ) {
      gradingColorClass = "bg-indigo-600 text-white";
    } else if (grade.toLowerCase().includes("sahih")) {
      gradingColorClass = "bg-emerald-500 text-black";
    } else if (
      ["mawdu", "batil", "munkar"].some((i) => grade.toLowerCase().includes(i))
    ) {
      gradingColorClass = "bg-red-500 text-black";
    } else if (grade.toLowerCase().includes("daif")) {
      gradingColorClass = "bg-orange-500 text-black";
    } else {
      gradingColorClass = "bg-gray-500";
    }
    return gradingColorClass;
  };
  function capture(i: number, name: string) {
    htmlToImage
      .toPng(document.getElementById("hadithGroup" + i)!)
      .then(function (dataUrl) {
        download(dataUrl, name);
      });
  }
</script>

{#each { length: allHadiths[0].hadiths.length } as _, i}
  {#if allHadiths[0].hadiths[i].chapter !== undefined && allHadiths[0].hadiths[i].chapter.id && (singleHadithView || allHadiths[0].hadiths[i].chapter["isFirstHadith"])}
    <div class="card card-body m-4 flex-wrap !bg-transparent">
      <div class="hadithGroup grid">
        <div class="break-words leading-7 m-3">
          Chapter {allHadiths[0].hadiths[i].chapter["id"]} - {allHadiths[0]
            .hadiths[i].chapter["eng-name"]}
        </div>
        <div class="break-words leading-7 m-3 text-right">
          باب {allHadiths[0].hadiths[i].chapter["id"]} - {allHadiths[0].hadiths[
            i
          ].chapter["ara-name"]}
        </div>
      </div>
    </div>
  {/if}
  <div class="card card-body p-4 m-4 flex-wrap">
    <div id="hadithGroup{i}" class="card">
      <!-- HADITH TEXT -->
      <div class="hadithGroup font-medium grid">
        {#each { length: languageCount } as _, j}
          <div class="break-words leading-7 m-3 pb-4">
            {#if !allHadiths[j].hadiths[i] || allHadiths[j].hadiths[i].text == ""}
              <center
                ><code class="!text-white !bg-red-500"
                  >Hadith translation not found</code
                ></center
              >
            {:else}
              {@html allHadiths[j].hadiths[i].text}
            {/if}
          </div>
        {/each}
      </div>
      <hr>
      <!-- GRADINGS -->
      <div class="hadithGroup font-medium p-2 grid">
        {#each allHadiths[0].hadiths[i].grades as grade}
          <div
            class="flex leading-7 pt-1 rounded-full text-center bg-red m-2 {gradingColor(
              grade['grade']
            )}"
          >
            <div class="m-auto">
              {@html grade["name"] + " : " + grade["grade"]}
            </div>
          </div>
        {/each}
      </div>
      <hr>
      <div class="metaGroup text-sm p-2 grid">
        <div class="my-4">
          #{@html allHadiths[0].hadiths[i].hadithnumber}
          <br />
          {#if allHadiths[0].metadata}
            {@html allHadiths[0].metadata.name}
          {:else}
            {@html allHadiths[0].hadiths[i].bookName}
          {/if}
          {@html allHadiths[0].hadiths[i].arabicnumber}
          <br />
          Book {@html allHadiths[0].hadiths[i].reference.book}, Hadith {@html allHadiths[0]
            .hadiths[i].reference.hadith}
        </div>

        <div
          class="text-[0px] whitespace-nowrap flex justify-between md:justify-end"
        >
          <button
            class="btn bg-primary-500 btn-sm text-black mt-6 pt-3 mr-4 px-4 h-10"
            on:click={() =>
              capture(
                i,
                (
                  (allHadiths[0].metadata
                    ? allHadiths[0].metadata.name
                    : allHadiths[0].hadiths[i].bookName) +
                  " " +
                  allHadiths[0].hadiths[i].arabicnumber
                )
                  .replace('<span style="color:red;">', "")
                  .replace("</span>", "")
              )}
          >
            <SvgIcon name="download" fill="fill-black" /> Screenshot
          </button>
          <div>
            <button
              class="btn bg-primary-500 btn-sm text-black mt-6 pt-3 h-10 rounded-l-full rounded-r-none"
              on:click={clickHandler}
              use:clipboard={$page.url.host +
                "/" +
                (allHadiths[0].hadiths[i].shortName ?? book) +
                ":" +
                allHadiths[0].hadiths[i].hadithnumber
                  .toString()
                  .replace('<span style="color:red;">', "")
                  .replace("</span>", "")}
              >{permalinkText}
            </button>
            <a
              class="btn bg-primary-500 btn-sm mt-6 pt-3 h-10 rounded-r-full rounded-l-none align-top border-l-2 border-primary-900"
              href={"http://" +
                $page.url.host +
                "/" +
                (allHadiths[0].hadiths[i].shortName ?? book) +
                ":" +
                allHadiths[0].hadiths[i].hadithnumber
                  .toString()
                  .replace('<span style="color:red;">', "")
                  .replace("</span>", "")}
              target="_blank"
              rel="noreferrer"
            >
              <SvgIcon name="openExternal" fill="fill-black" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
{/each}

<style>
  .hadithGroup {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    word-wrap: normal;
  }

  .metaGroup {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    word-wrap: normal;
  }
</style>
