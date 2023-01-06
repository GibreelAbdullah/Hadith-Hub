<script lang="ts">
  import { Breadcrumb, Crumb } from "@skeletonlabs/skeleton";
  export let dataPromise: Promise<any>;
  export let bookURL: string;
</script>

{#await dataPromise}
  <div class="sticky top-0 card card-body p-4 m-4">
    <div class="text-xs grid px-3">
      <Breadcrumb>
        <Crumb href="/">Home</Crumb>
        <div class="placeholder w-52 m-auto animate-pulse" />
      </Breadcrumb>
    </div>
  </div>
  {#each { length: 5 } as _, i}
    <div class="card card-body p-4 m-4 ">
      <div class="hadithGroup font-medium p-2 grid ">
        <div>
          <div class="placeholder animate-pulse" />
        </div>

        <div class="text-right ml-10">
          <div class="placeholder animate-pulse" />
        </div>
        <div class="hidden md:block text-right">
          <div class="badge">
            <div class="placeholder animate-pulse w-16 m-auto" />
          </div>
        </div>
      </div>
      <div class="md:hidden text-center">
        <div class="placeholder animate-pulse w-16 m-auto" />
      </div>
    </div>
  {/each}
{:then data}
  <div class="sticky top-0 card card-body p-4 m-4">
    <div class="text-xs grid px-3">
      <Breadcrumb>
        <Crumb href="/">Home</Crumb>
        <Crumb>{data["name"]}</Crumb>
      </Breadcrumb>
    </div>
  </div>
  {#each Object.keys(data["books"]) as chapterNumber}
    {#if data["books"][chapterNumber]["eng-name"] != ""}
      <a href="/{bookURL}/{chapterNumber}" class="card">
        <div class="card card-body p-4 m-4 ">
          <div class="hadithGroup font-medium p-2 grid ">
            <div>
              {chapterNumber} -
              {data["books"][chapterNumber]["eng-name"]}
            </div>

            <div class="text-right ml-10">
              {data["books"][chapterNumber]["ara-name"]}
            </div>
            <div class="hidden md:block text-right">
              <div class="badge bg-gray-500">
                {data["books"][chapterNumber]["minHadith"]} to
                {data["books"][chapterNumber]["maxHadith"]}
              </div>
            </div>
          </div>
          <div class="md:hidden text-center">
            <div class="badge bg-gray-500">
              {data["books"][chapterNumber]["minHadith"]} to
              {data["books"][chapterNumber]["maxHadith"]}
            </div>
          </div>
        </div>
      </a>
    {/if}
  {/each}
{:catch data}
  <div class="card card-body p-4 m-4">Error. Try clearing the cache.</div>
{/await}

<style>
  .hadithGroup {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    /* grid-template-columns: minmax(300px, 3fr) minmax(300px, 3fr) minmax(300px, 1fr); */
  }
</style>
