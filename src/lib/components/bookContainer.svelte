<script lang="ts">
  export let dataPromise: Promise<any>;
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
  {#await dataPromise}
    <div class="card card-body hvr-reveal">LOADING...</div>
  {:then data}
    {#each data["collections"] as book}
      <a class="card card-body text-center" href="/{book['name']}"
        >{book["eng-name"]} <br /> {book["ara-name"]}</a
      >
    {/each}
  {:catch data}
    <div class="card card-body hvr-reveal">Error...Could Not Load Data</div>
  {/await}
</div>
