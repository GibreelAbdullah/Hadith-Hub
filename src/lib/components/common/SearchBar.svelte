<script lang="ts">
    import { collectionPromise } from '$lib/functions/utilsV2';
    import { goto } from '$app/navigation';
    
    let isSearchFocused = false;
    let filterFocused = false;

	let searchQuery = '';

	let selectedBook = '';

	function handleSearchFocus() {
		isSearchFocused = true;
	}

	function handleSearchBlur(e: FocusEvent) {
		// Only collapse if neither search nor filter is focused
		setTimeout(() => {
			if (!filterFocused) {
				isSearchFocused = false;
			}
		}, 150);
	}

	function handleFilterFocus() {
		filterFocused = true;
		isSearchFocused = true;
	}

	function handleFilterBlur() {
		filterFocused = false;
		setTimeout(() => {
			if (
				!document.activeElement ||
				!(document.activeElement as HTMLElement).closest('.searchbar-container')
			) {
				isSearchFocused = false;
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
            const bookParam = selectedBook ? `&book=${encodeURIComponent(selectedBook)}` : '';
            goto(`/search?query=${encodeURIComponent(searchQuery)}${bookParam}`);
        }
    }
</script>

<div
    class="fixed top-4 md:left-60 transition-all duration-300 ease-in-out z-50 w-48 max-w-2xl
    {isSearchFocused ? 'left-4 w-[calc(100%-40px)] md:w-[calc(100vw-300px)]' : 'left-28'}"
>
    <div
        class="relative flex items-center rounded-full transition-all duration-300 ease-in-out h-10
        bg-gray-100 border-none border-transparent
        {isSearchFocused
            ? 'bg-white shadow-md fixed md:relative lg:relative left-0 right-0 top-0 md:top-auto md:left-auto md:right-auto'
            : ''}"
    >
        <input
            type="text"
            placeholder="Search..."
            bind:value={searchQuery}
            on:focus={handleSearchFocus}
            on:blur={handleSearchBlur}
            on:keydown={handleSearchKeydown}
            class="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none px-4 pr-12 h-full text-sm
            text-gray-800 placeholder-gray-400
            {isSearchFocused ? 'placeholder-gray-500' : 'placeholder-gray-400'}"
        />
        <!-- FILTER -->
        {#if isSearchFocused}
            <div
                class="fixed mt-20 ml-0 mr-0
                group"
            >
                <select
                    bind:value={selectedBook}
                    class="appearance-none p-2 rounded-full border border-gray-300 bg-white text-gray-900 text-sm cursor-pointer
                    pr-8
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style="min-width: 10rem;"
                    on:focus={handleFilterFocus}
                    on:blur={handleFilterBlur}
                    tabindex="0"
                >
                    <option value="">All Books</option>
                    {#await collectionPromise}
                        <option disabled>Loading...</option>
                    {:then dataList} 
                        {#each dataList as data}
                            <option value={data[0]}>{data[2]}</option>
                        {/each}
                    {:catch error}
                        <option disabled>Error loading books</option>
                    {/await}
                </select>
            </div>
        {/if}

        <button
            class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full
            text-gray-500 hover:bg-gray-200
            {isSearchFocused ? 'text-blue-600 hover:bg-blue-100' : ''}
            transition-colors duration-200 flex items-center justify-center z-10"
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