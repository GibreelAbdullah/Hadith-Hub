<script lang="ts">
  import SvgIcon from "$lib/components/svgIcon.svelte";
</script>

<div class="sticky top-[100vh] p-4 m-4">
  <div class="flex space-x-4">
    <a
      class="btn bg-[#ea4335] text-white"
      href="mailto:gibreel.khan@gmail.com"
      target="_blank"
      rel="noreferrer"
    >
      <SvgIcon name="mail" fill="fill-white" />
      <span class="hidden md:inline-block ml-2 text-white pt-1">Mail</span>
    </a>
    <a
      class="btn bg-[#6e5494] text-white"
      href="https://github.com/GibreelAbdullah/Hadith-Hub"
      target="_blank"
      rel="noreferrer"
    >
      <SvgIcon name="github" fill="fill-white" />
      <span class="hidden md:inline-block ml-2 text-white pt-1">Github</span>
    </a>
    <a
      class="btn bg-[#1da1f2] "
      href="https://twitter.com/TheHadithHub"
      target="_blank"
      rel="noreferrer"
    >
      <SvgIcon name="twitter" fill="fill-white" />
      <span class="hidden md:inline-block ml-2 text-white pt-1">Twitter</span>
    </a>

    <a
      class="btn bg-[#008c40] text-white"
      href="https://play.google.com/store/apps/details?id=com.islamicproapps.hadithpro"
      target="_blank"
      rel="noreferrer"
    >
      <SvgIcon name="playstore" fill="fill-white" />
      <span class="hidden md:inline-block ml-2 text-white pt-1">PlayStore</span>
    </a>
  </div>
</div>
