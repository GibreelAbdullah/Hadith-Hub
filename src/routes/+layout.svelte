<script>
  import "@brainandbones/skeleton/themes/theme-skeleton.css";
  import "@brainandbones/skeleton/styles/all.css";
  import "../app.postcss";

  import { AppShell, AppBar, GradientHeading, LightSwitch } from "@brainandbones/skeleton";
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
  <!-- Header -->
  <svelte:fragment slot="header">
    <!-- Insert the App Bar: -->
	<AppBar>
		<svelte:fragment slot="lead">
			<h1><a href="/">HadithHub</a></h1>
		</svelte:fragment>
		<svelte:fragment slot="trail">
			<LightSwitch />
		</svelte:fragment>
	</AppBar>
	<!-- --- -->
</svelte:fragment>  <!-- Sidebar -->
<svelte:fragment slot="sidebarLeft">
	<!-- Insert the list: -->
	<nav class="list-nav">
		<ul>
			<li><a href="/">Home</a></li>
		</ul>
	</nav>
	<!-- --- -->
</svelte:fragment>  <!-- Page Content Slot -->
  <slot />
</AppShell>