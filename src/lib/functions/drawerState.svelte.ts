// Drawer state management using Svelte 5 runes
// Replaces the old Skeleton v2 drawerStore

function createDrawerState() {
	let isOpen = $state(false);
	let id = $state('');
	let position = $state<'left' | 'right'>('left');

	return {
		get isOpen() { return isOpen; },
		get id() { return id; },
		get position() { return position; },

		open(drawerId: string = 'main', pos: 'left' | 'right' = 'left') {
			id = drawerId;
			position = pos;
			isOpen = true;
		},

		close() {
			isOpen = false;
		},

		toggle(drawerId: string = 'main', pos: 'left' | 'right' = 'left') {
			if (isOpen && id === drawerId) {
				isOpen = false;
			} else {
				id = drawerId;
				position = pos;
				isOpen = true;
			}
		}
	};
}

export const drawerState = createDrawerState();
