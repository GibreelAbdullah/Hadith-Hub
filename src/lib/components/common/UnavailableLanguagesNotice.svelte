<script lang="ts">
	import { getLanguageFullName } from '$lib/functions/utilsV2';
	export let unavailableLanguages: string[];
</script>

{#if unavailableLanguages.length > 0}
	<div class="p-4">
		<div class="px-4 card max-w-[90rem] m-auto !bg-error-500">
			<div class="hadithGroup font-medium grid">
				<div class="break-words mx-auto leading-7 m-3 p-4">
					{#await getLanguageFullName(unavailableLanguages) then names}
						This book is not available in {names.join(', ')}.
					{/await}
				</div>
			</div>
		</div>
	</div>
{/if}
