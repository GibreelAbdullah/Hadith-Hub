<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';		
	let {collectionPromise} = $props()
	import { languageStore } from '$lib/functions/store.svelte';
	import { getLanguageFullName } from '$lib/components/common/sideBarContents.svelte';
	
	function getUnavailableCollections(availbleLanguagesOfCollection: string[], selectedLanguagesStore: string[]) {
		let unavailableLanguagesShortName: string[] = [];
			selectedLanguagesStore.forEach((collection) => {
				if (!availbleLanguagesOfCollection.includes(collection)) {
					unavailableLanguagesShortName.push(collection);
				}
			});

		unavailableLanguagesShortName = unavailableLanguagesShortName;
		return getLanguageFullName(unavailableLanguagesShortName);
	}

	function filterCollections() {
		// Declare variables
		var input, filter, collection, collectionlist, collectionName, i, j, txtValue, display;
		input = <HTMLInputElement>document.getElementById('filterCollections');
		filter = input.value.toUpperCase();
		collectionlist = document.getElementById('collectionlist');
		if (collectionlist != null) {
			collection = collectionlist.querySelectorAll<HTMLElement>('.collection');
			for (i = 0; i < collection.length; i++) {
				display = 'none';
				collectionName = collection[i].getElementsByTagName('a');
				for (j = 0; j < collectionName.length; j++) {
					if (collectionName[j]) {
						txtValue = collectionName[j].textContent || collectionName[j].innerText;
						if (txtValue.toUpperCase().indexOf(filter) > -1) {
							collectionName[j].style.display = '';
							display = '';
						} else {
							collectionName[j].style.display = 'none';
						}
					}
				}
				collection[i].style.display = display;
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
	id="filterCollections"
	onkeyup={filterCollections}
	placeholder="Filter Collections..."
/>
{#await collectionPromise}
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 max-w-[90rem] m-auto">
		{#each { length: 7 } as _, i}
			<div class="card p-4 h-20">
				<div class="placeholder w-40 m-auto animate-pulse my-1"></div>
				<div class="placeholder w-40 m-auto animate-pulse my-1"></div>
			</div>
		{/each}
	</div>
{:then dataList}
	<div id="collectionlist" class="max-w-[90rem] m-auto">
		<div class="collection grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 p-4">
			{#each dataList as data}
				<a class="card p-4 text-center relative" href="/{data[0]}?lang={languageStore.value.toString()}">
						<!-- If no language is selected then it should take 2 -->
						{#each {length: languageStore.value.length ? languageStore.value.length : 2} as _, i}
							{#if data[2 + i] != null}
								{data[2 + i]}
								<br />
							{/if}
						{/each}
					{#await getUnavailableCollections(data[1], languageStore.value)}
						<div class="placeholder w-40 m-auto animate-pulse"></div>
					{:then collectionNames}
						{#if collectionNames.length != 0}
							<code class="break-words !text-error-500">Not available in {collectionNames}</code>
						{/if}
					{/await}
					<button
						type="button"
						class="btn-icon text-lg place-self-center absolute top-0 right-0"
						onclick={clickHandler}
						use:popup={{
							event: 'click',
							target: 'popupFeatured-' + data[0],
							placement: 'bottom'
						}}
						>⋮
					</button>
				</a>
				<span class="absolute top-0 right-0"> </span>
				<div
					class="card p-4 shadow-xl z-10 w-96 variant-filled-primary"
					data-popup="popupFeatured-{data[0]}"
				>
					<div class="break-words">
						<div class="uppercase text-center">{data[4]}</div>
						{#await getLanguageFullName(data[1])}
							<div class="placeholder w-40 m-auto animate-pulse"></div>
						{:then collectionNames}
							{#if collectionNames.length != 0}
								<p class="font-semibold">Available Langauges</p>
								<p class="pl-6">{collectionNames}</p>
							{/if}
						{/await}
					</div>
					<div class="arrow bg-surface-100-800-token"></div>
				</div>
			{/each}
		</div>
	</div>
{:catch error}
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
		<div class="card p-4 hvr-reveal">Error...Could Not Load Data</div>
	</div>
{/await}
