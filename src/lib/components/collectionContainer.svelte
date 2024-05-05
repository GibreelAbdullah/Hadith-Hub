<script lang="ts">
	import { selectedLanguagesStore } from '$lib/common/sideBarContents.svelte';
	import { getLanguageFullName } from '$lib/common/utils';
	import { popup } from '@skeletonlabs/skeleton';
	export let dataPromise: Promise<any>;

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

	function filterCollections() {
		// Declare variables
		var input, filter, category, collectionlist, collection, i, j, txtValue, display;
		input = <HTMLInputElement>document.getElementById('myInput');
		filter = input.value.toUpperCase();
		collectionlist = document.getElementById('collectionlist');
		if (collectionlist != null) {
			category = collectionlist.querySelectorAll<HTMLElement>('.category');
			for (i = 0; i < category.length; i++) {
				display = 'None';
				collection = category[i].getElementsByTagName('a');
				for (j = 0; j < collection.length; j++) {
					if (collection[j]) {
						txtValue = collection[j].textContent || collection[j].innerText;
						if (txtValue.toUpperCase().indexOf(filter) > -1) {
							collection[j].style.display = '';
							display = '';
						} else {
							collection[j].style.display = 'none';
						}
					}
				}
				category[i].style.display = display;
			}
		}
	}

	function clickHandler(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		event.preventDefault();
		event.stopPropagation();
	}
</script>

<input
	class="input max-w-max mx-auto mt-4 block"
	type="text"
	id="myInput"
	on:keyup={filterCollections}
	placeholder="Filter Collections..."
/>
{#await dataPromise}
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 max-w-[90rem] m-auto">
		{#each { length: 7 } as _, i}
			<div class="card p-4 h-20">
				<div class="placeholder w-40 m-auto animate-pulse my-1" />
				<div class="placeholder w-40 m-auto animate-pulse my-1" />
			</div>
		{/each}
	</div>
{:then data}
	<div id="collectionlist" class="max-w-[90rem] m-auto">
		{#each data['collections'] as category}
			<div class="category">
				<div class="mb-0 h5">
					{category['eng-name']} | {category['ara-name']}
				</div>
				<div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 p-4 relative ">
					{#each category['books'] as collection}
						<a class="card p-4 text-center relative" href="/{collection['name']}">
							{collection['eng-name']}
							<br />
							{collection['ara-name']}
							<br />
							{#await getUnavailableCollections(collection['availableLanguages'], $selectedLanguagesStore)}
								<div class="placeholder w-40 m-auto animate-pulse" />
							{:then collectionNames}
								{#if collectionNames.length != 0}
									<code class="break-words !text-error-500">Not available in {collectionNames}</code
									>
								{/if}
							{/await}
							<button
								type="button"
								class="btn-icon text-lg place-self-center absolute top-0 right-0"
								on:click={clickHandler}
								use:popup={{
									event: 'click',
									target: 'popupFeatured-' + collection['name'],
									placement: 'bottom'
								}}
								>⋮
							</button>
						</a>
						<span class="absolute top-0 right-0"> </span>
						<div
							class="card p-4 shadow-xl z-10 w-96 variant-filled-primary"
							data-popup="popupFeatured-{collection['name']}"
						>
							<div class="break-words">
								<div class="uppercase text-center">{collection['eng-name']}</div>
								{#await getLanguageFullName(collection['availableLanguages'])}
									<div class="placeholder w-40 m-auto animate-pulse" />
								{:then collectionNames}
									{#if collectionNames.length != 0}
										<p class="font-semibold">Available Langauges</p>
										<p class="pl-6">{collectionNames}</p>
									{/if}
								{/await}
							</div>
							<div class="arrow bg-surface-100-800-token" />
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{:catch error}
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
		<div class="card p-4 hvr-reveal">Error...Could Not Load Data</div>
	</div>
{/await}
