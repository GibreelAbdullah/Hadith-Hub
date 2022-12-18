<script lang="ts">
  import "@skeletonlabs/skeleton/themes/theme-skeleton.css";
  import "@skeletonlabs/skeleton/styles/all.css";
  import "../app.postcss";
  import { page } from "$app/stores";
  import { selectedLanguagesStore } from "$lib/common/sideBarContents.svelte";
  import {
    AppShell,
    AppBar,
    GradientHeading,
    Drawer,
    type DrawerSettings,
  } from "@skeletonlabs/skeleton";
  import SideBarContents from "$lib/common/sideBarContents.svelte";
  import Footer from "$lib/common/footer.svelte";
  import { drawerStore } from "@skeletonlabs/skeleton";

  function drawerOpen(): void {
    const settings: DrawerSettings = { id: "main" };
    drawerStore.open(settings);
  }
</script>

<Drawer open={drawerOpen} position="left">
  <div class="px-4 pt-8"><SideBarContents /></div>
</Drawer>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4 hidden md:block">
  <svelte:fragment slot="header">
    <AppBar>
      <svelte:fragment slot="lead">
        <button
          on:click={drawerOpen}
          class="md:hidden mr-2 p-1 cursor-pointer text-3xl"
          >≡
        </button>
        <a href="/">
          <GradientHeading
            class="md:text-3xl"
            tag="h1"
            direction="bg-gradient-to-r"
            from="from-primary-500"
            to="to-accent-500"
            >HadithHub
          </GradientHeading>
        </a>
      </svelte:fragment>
      <form action="/search" method="get" class="">
        <input
          type="search"
          placeholder="Search..."
          value={$page.url.searchParams.get("q")}
          class="px-5 pt-1 h-8 caret-black dark:caret-white"
          name="q"
        />
        <input type="hidden" name="lang" value={$selectedLanguagesStore} />
      </form>
      <svelte:fragment slot="trail">
        <a href="/" class="hidden md:block">
          <GradientHeading
            class="md:text-3xl"
            tag="h1"
            direction="bg-gradient-to-r"
            from="from-primary-500"
            to="to-accent-500"
            >حديث حب
          </GradientHeading>
        </a>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <svelte:fragment slot="sidebarLeft">
    <SideBarContents />
  </svelte:fragment>
  <slot />
  <Footer />
</AppShell>
