<!-- <script lang="ts">
	import { selectedLanguagesStore } from '$lib/common/sideBarContents.svelte';
	import { getLanguageFullName } from '$lib/common/utils';
	export let dataPromise: Promise<any>;

	let collectionFilter = '';

	function getUnavailableCollections(
		availbleLanguagesOfCollection: string[],
		selectedLanguages: string[]
	) {
		let unavailableLanguagesShortName: string[] = [];
		selectedLanguages.forEach((collection) => {
			if (!availbleLanguagesOfCollection.includes(collection)) {
				unavailableLanguagesShortName.push(collection);
			}
		});
		unavailableLanguagesShortName = unavailableLanguagesShortName;
		return getLanguageFullName(unavailableLanguagesShortName);
	}

	function myFunction() {
		// Declare variables
		var input, filter, collectionlist, collection, i, txtValue;
		input = <HTMLInputElement>document.getElementById('myInput');
		filter = input.value.toUpperCase();
		collectionlist = document.getElementById('collectionlist');
		if (collectionlist != null) {
			collection = collectionlist.getElementsByTagName('a');

			// Loop through all table rows, and hide those who don't match the search query
			for (i = 0; i < collection.length; i++) {
				if (collection[i]) {
					txtValue = collection[i].textContent || collection[i].innerText;
					if (txtValue.toUpperCase().indexOf(filter) > -1) {
						collection[i].style.display = '';
					} else {
						collection[i].style.display = 'none';
					}
				}
			}
		}
	}
</script>

{#await dataPromise}
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
		{#each { length: 7 } as _, i}
			<div class="card p-4 h-20">
				<div class="placeholder w-40 m-auto animate-pulse my-1" />
				<div class="placeholder w-40 m-auto animate-pulse my-1" />
			</div>
		{/each}
	</div>
{:then data}
	<input
		class="input max-w-xl mx-auto mt-4 block"
		type="text"
		id="myInput"
		on:keyup={myFunction}
		placeholder="Filter Collections..."
	/>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4" id="collectionlist">
		{#each data['collections'] as collection}
			<a class="card p-4 text-center" href="/{collection['name']}">
				{collection['eng-name']}
				<br />
				{collection['ara-name']}
				<br />
				{#await getUnavailableCollections(collection['availableLanguages'], $selectedLanguagesStore)}
					<div class="placeholder w-40 m-auto animate-pulse" />
				{:then collectionNames}
					{#if collectionNames.length != 0}
						<code class="!text-white !bg-red-500">Not available in {collectionNames}</code>
					{/if}
				{/await}
			</a>
		{/each}
	</div>
{:catch error}
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
		<div class="card p-4 hvr-reveal">Error...Could Not Load Data</div>
	</div>
{/await} -->
