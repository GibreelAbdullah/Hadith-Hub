<!-- <script>
    export let route;
    import { AppBar, AppShell, LightSwitch } from "@brainandbones/skeleton";
    import ha from "../assets/ha.png";
</script>

<AppShell>
    <svelte:fragment slot="header">
        <AppBar
            class="app-bar flex items-center bg-slate-100 dark:bg-slate-800 p-4 md:py-6 shadow-lg space-x-4 "
        >
            <svelte:fragment slot="lead">
                <a class="header" href="/">
                    <img class="logo" src={ha} alt="Hadith" />
                </a>
            </svelte:fragment>
            <svelte:fragment slot="trail">
                <div
                    class="flex border-black dark:border-white border-solid border rounded-full"
                >
                    <LightSwitch class="bg-slate-300 dark:bg-slate-600" />
                </div>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <svelte:fragment slot="sidebarLeft">
        <div id="sidebar-left" class="hidden md:block">Sidebar</div>
    </svelte:fragment>
    <slot />
    <svelte:fragment slot="footer">Footer</svelte:fragment>
</AppShell>

<style>
    .logo {
        width: 30px;
    }
</style> -->
