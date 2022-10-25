<script lang="ts">
	export let bookName: string;
</script>

<h1>
	<a class="header" href="/{bookName}">
		<img class="logo" src="https://raw.githubusercontent.com/GibreelAbdullah/hadith-api/2/Images/{bookName}.png"  alt="{bookName}" />
	</a>
</h1>

<style>
	.logo {
		width: 150px;
	}
	.header {
		color: black;
		text-decoration: none;
		display: block;
        margin: 0 auto; 
		width: 150px;
	}
</style>