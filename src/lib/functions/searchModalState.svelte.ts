// Search modal state management using Svelte 5 runes
// Replaces the old Skeleton v2 modalStore

function createSearchModalState() {
	let isOpen = $state(false);
	let query = $state('');

	return {
		get isOpen() { return isOpen; },
		get query() { return query; },

		open(initialQuery: string = '') {
			query = initialQuery;
			isOpen = true;
		},

		close() {
			isOpen = false;
		}
	};
}

export const searchModalState = createSearchModalState();
