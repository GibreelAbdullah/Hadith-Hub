<script lang="ts">
  import SvgIcon from "$lib/components/svgIcon.svelte";
</script>

<div
  class="sticky top-[100vh] card card-body p-4 m-4  dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-800 dark:to-gray-900"
>
  <div class="flex space-x-4">
    <a
      class="btn bg-[#1da1f2] "
      href="https://twitter.com/TheHadithHub"
      target="_blank"
      rel="noreferrer"
    >
      <SvgIcon name="twitter" fill="fill-white" />
      <span class="hidden md:inline-block ml-2 text-white">Twitter</span>
    </a>
    <a
      class="btn bg-[#6e5494] text-white"
      href="https://github.com/GibreelAbdullah/Hadith-Hub"
      target="_blank"
      rel="noreferrer"
    >
      <SvgIcon name="github" fill="fill-white" />
      <span class="hidden md:inline-block ml-2 text-white">Github</span>
    </a>
  </div>
</div>
