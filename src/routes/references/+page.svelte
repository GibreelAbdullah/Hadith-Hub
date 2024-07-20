<script lang="ts">
	import { urlPrefix } from '$lib/common/constants';
	import { onMount } from 'svelte';

	let data: any[] = [];
	let isLoading = true;
	let error: any = null;

	const fetchData = async () => {
		try {
			const response = await fetch(urlPrefix + '/updates/references/reference.min.json');
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			data = await response.json();
			isLoading = false;
		} catch (err: any) {
			error = err.message;
			isLoading = false;
		}
	};

	const filterTable = () => {
		const input = <HTMLInputElement>document.getElementById('filterReferences');
		const filter = input.value.toUpperCase();
		const table = <HTMLInputElement>document.getElementById('referenceTable');
		const rows = table.getElementsByTagName('tr');

		for (let i = 1; i < rows.length; i++) {
			const cells = rows[i].getElementsByTagName('td');
			let rowVisible = false;

			for (let j = 0; j < cells.length; j++) {
				const cell = cells[j];
				if (cell) {
					const textValue = cell.textContent || cell.innerText;
					if (textValue.toUpperCase().indexOf(filter) > -1) {
						rowVisible = true;
						break;
					}
				}
			}

			rows[i].style.display = rowVisible ? '' : 'none';
		}
	};

	onMount(fetchData);
</script>

<input
	class="input max-w-max mx-auto mt-4 block"
	type="text"
	id="filterReferences"
	on:keyup={filterTable}
	placeholder="Filter References..."
/>
<div class="p-4 max-w-[90rem] m-auto">
	<div class="m-auto table-container text-token">
		<table id="referenceTable" class="m-auto table table-hover">
			<thead>
				<tr>
					<th>Book</th>
					<th>Language</th>
					<th>Source</th>
				</tr>
			</thead>
			{#if isLoading}
				<tbody>
					{#each { length: 20 } as _, i}
						<tr>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					{/each}
				</tbody>
			{:else if error}
				<p>Error: {error}</p>
			{:else}
				<tbody>
					{#each data as row}
						<tr class="data">
							{#each row as cell}
								<td>{@html cell}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			{/if}
		</table>
	</div>
</div>
