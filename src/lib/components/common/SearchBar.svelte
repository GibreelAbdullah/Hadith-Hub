<script lang="ts">
	import { getCollectionPromise, languagePromise } from '$lib/functions/utilsV2';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
  	
	const collectionPromise = $derived(getCollectionPromise());

	let expandSearchBar = $state(false);
	// let expandSearchBar = false;
	let isSearchBarFocused = false;
	let searchQuery = $state('');

	let selectedCollection = $state('');
	let selectedLanguage = $state('');

	function handleSearchFocus() {
		expandSearchBar = true;
		setTimeout(() => {
			isSearchBarFocused = true;
		}, 50); 
	}

	function handleSearchBlur(e: FocusEvent) {
		isSearchBarFocused = false;
		setTimeout(() => {
			if (!isSearchBarFocused) {
				expandSearchBar = false;
			}
		}, 150); 
	}

	function handleSearchKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSearch();
		}
	}
	function handleSearch() {
		if (searchQuery.trim()) {
			const collectionParam = selectedCollection ? `&collection=${encodeURIComponent(selectedCollection)}` : '';
			const languageParam = selectedLanguage
				? `&language=${encodeURIComponent(selectedLanguage)}`
				: '';
			goto(`${base}/search?text=${encodeURIComponent(searchQuery)}${collectionParam}${languageParam}`);
		}
	}
</script>
<div
	class="fixed top-4 md:left-60 transition-all duration-300 ease-in-out z-50 w-48 max-w-2xl 
    {expandSearchBar ? 'left-4 w-[calc(100%-40px)] md:w-[calc(100vw-300px)]' : 'left-28'}"
>
    <!-- Dark overlay that appears when search is focused -->
    {#if expandSearchBar}
        <div 
            class="fixed inset-0 bg-black bg-opacity-50 z-40"
        ></div>
    {/if}

	<div
		class="relative flex items-center transition-all duration-300 ease-in-out h-10 z-50
        {expandSearchBar
			? 'fixed md:relative lg:relative left-0 right-0 top-0 md:top-auto md:left-auto md:right-auto'
			: ''}"
	>
		<input
			type="text"
			placeholder="Search..."
			bind:value={searchQuery}
			on:focus={handleSearchFocus}
			on:blur={handleSearchBlur}
			on:keydown={handleSearchKeydown}
			class="input flex-1 px-4 pr-12 h-full text-sm z-50"
		/>
		<!-- FILTER -->
		{#if expandSearchBar}
			<div class="fixed mt-24 ml-0 mr-0 group z-50">
				<select
					bind:value={selectedCollection}
					class="p-2 rounded-full text-sm pr-8 select min-w-72"
					on:focus={handleSearchFocus}
					on:blur={handleSearchBlur}
					tabindex="0"
				>
					<option value="">All Collections</option>
					{#await collectionPromise}
						<option disabled>Loading...</option>
					{:then result}
						{#each result.collections as coll}
							<option value={coll.short_name}>{coll.en || coll.ar || coll.short_name}</option>
						{/each}
					{:catch error}
						<option disabled>Error loading Collections</option>
					{/await}
				</select>
			</div>

			<div class="fixed mt-48 ml-0 mr-0 group z-50">
				<select
					bind:value={selectedLanguage}
					class="p-2 rounded-full text-sm pr-8 select min-w-72"
					on:focus={handleSearchFocus}
					on:blur={handleSearchBlur}
					tabindex="0"
				>
					<option value="">Auto Detect Language</option>
					{#await languagePromise}
						<option disabled>Loading...</option>
					{:then dataList}
						{#each dataList as data}
							<option value={data[0]}>{data[1]}</option>
						{/each}
					{:catch error}
						<option disabled>Error loading collections</option>
					{/await}
				</select>
			</div>
		{/if}

		<button
			class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full
            text-gray-500 hover:bg-gray-200
            {expandSearchBar ? 'text-blue-600 hover:bg-blue-100' : ''}
            transition-colors duration-200 flex items-center justify-center z-50"
			on:click={handleSearch}
			aria-label="Search"
			type="button"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.35-4.35"></path>
			</svg>
		</button>
	</div>
</div>