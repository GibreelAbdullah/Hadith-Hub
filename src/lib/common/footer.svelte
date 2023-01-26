<script lang="ts">
  import SvgIcon from "$lib/components/svgIcon.svelte";
</script>
<div class="p-8 sticky top-[100vh]">
  <section
    class="flex flex-col lg:flex-row justify-between items-center lg:items-start space-y-5 lg:space-y-0"
  >
    <!-- <GradientHeading
      class="md:text-3xl"
      tag="h1"
      direction="bg-gradient-to-r"
      from="from-primary-500"
      to="to-secondary-500"
      >HadithHub
    </GradientHeading> -->
    <h2>
      <span class="bg-gradient-to-br from-primary-500 via-tertiary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone">
        HadithHub
      </span>
    </h2>
    <div class="flex space-x-4">
      <a
        class="btn bg-[#ea4335] text-white"
        href="mailto:gibreel.khan@gmail.com"
        target="_blank"
        rel="noreferrer"
      >
        <SvgIcon name="mail" fill="fill-white" />
        <span class="hidden lg:inline-block ml-2 text-white pt-1">Mail</span>
      </a>
      <a
        class="btn bg-[#6e5494] text-white"
        href="https://github.com/GibreelAbdullah/Hadith-Hub"
        target="_blank"
        rel="noreferrer"
      >
        <SvgIcon name="github" fill="fill-white" />
        <span class="hidden lg:inline-block ml-2 text-white pt-1">Github</span>
      </a>
      <a
        class="btn bg-[#1da1f2] "
        href="https://twitter.com/TheHadithHub"
        target="_blank"
        rel="noreferrer"
      >
        <SvgIcon name="twitter" fill="fill-white" />
        <span class="hidden lg:inline-block ml-2 text-white pt-1">Twitter</span>
      </a>
      <a
        class="btn bg-[#008c40] text-white"
        href="https://play.google.com/store/apps/details?id=com.islamicproapps.hadithpro"
        target="_blank"
        rel="noreferrer"
      >
        <SvgIcon name="playstore" fill="fill-white" />
        <span class="hidden lg:inline-block ml-2 text-white pt-1"
          >PlayStore</span
        >
      </a>
    </div>
  </section>
  <section class="pt-8 flex flex-row justify-center lg:justify-start items-center space-y-0">
    <div>
      <span class="float-left pr-8">Contributors</span>
      <p class="text-xs pr-8">
        <a
          href="https://github.com/GibreelAbdullah/hadith-api/graphs/contributors"
          target="_blank"
          rel="noreferrer">Data</a
        > <span class="opacity-10 mx-4">|</span>
        <a
          href="https://github.com/GibreelAbdullah/HadithHub/graphs/contributors"
          target="_blank"
          rel="noreferrer">UI</a
        >
      </p>
    </div>
    <a class="float-right pl-8" href="/about">About</a>
  </section>
</div>
