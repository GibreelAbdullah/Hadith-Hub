<script lang="ts">
	import {
		Breadcrumb,
		clipboard,
		Crumb,
		Divider,
	} from "@brainandbones/skeleton";
	export let book: string = "";
	export let allHadiths: any[] = [];
	let languageCount = allHadiths.length;
	let permalinkText = "Copy Permalink";
	let gradingColorClass = "";
	function clickHandler() {
		permalinkText = "Copied";
		setTimeout(function () {
			permalinkText = "Copy Permalink";
		}, 2000);
	}
	function gradingColor(grade: String) {
		if (["hasan", "mursal"].some((i) => grade.toLowerCase().includes(i))) {
			gradingColorClass = "bg-blue-500";
		} else if (grade.toLowerCase().includes("sahih")) {
			gradingColorClass = "bg-green-500";
		} else if (
			["mawdu", "batil", "munkar"].some((i) =>
				grade.toLowerCase().includes(i)
			)
		) {
			gradingColorClass = "bg-red-500";
		} else if (grade.toLowerCase().includes("daif")) {
			gradingColorClass = "bg-orange-500";
		} else {
			gradingColorClass = "bg-gray-500";
		}
		return gradingColorClass;
	}
</script>

<div class="sticky top-0 card card-body m-4">
	<div class="hadithGroup text-xs grid px-5">
		<Breadcrumb>
			<Crumb href="/">Home</Crumb>
			<Crumb href="/{book}">{allHadiths[0].metadata.name}</Crumb>
			<Crumb
				>{allHadiths[0].metadata.section[
					allHadiths[0].hadiths[0].reference.book
				]}</Crumb
			>
		</Breadcrumb>
	</div>
</div>
{#each { length: allHadiths[0].hadiths.length } as _, i}
	{#if allHadiths[0].hadiths[i].text}
		<div class="card card-body m-4 flex-wrap">
			<div class="hadithGroup font-medium p-2 grid">
				{#each { length: languageCount } as _, j}
					<div class="break-words leading-7 m-3">
						{allHadiths[j].hadiths[i].text}
					</div>
				{/each}
			</div>
			<Divider borderWidth="border-l" />
			<div class="hadithGroup font-medium p-2 grid">
				{#each allHadiths[0].hadiths[i].grades as grade}
					<!-- {#if grade["grade"].toLowerCase().some("hasan","mursal")}
							{gradingColorClass = "bg-lime-500"}
						{:else if grade["grade"].toLowerCase().includes("sahih")}
							{gradingColorClass = "bg-green-500"}
						{:else if grade["grade"].toLowerCase().some("mawdu","batil","munkar")}
							{gradingColorClass = "bg-red-500"}
						{:else if grade["grade"].toLowerCase().includes("daif")}
							{gradingColorClass = "bg-orange-500"}
						{:else}
							{gradingColorClass = "bg-gray-500"}
						{/if} -->
					<div
						class="flex leading-7 p-2 rounded text-center bg-red m-2 {gradingColor(
							grade['grade']
						)}"
					>
						<div class="m-auto">
							{grade["name"]} : {grade["grade"]}
						</div>
					</div>
				{/each}
			</div>
			<Divider borderWidth="border-l" />
			<div class="flex justify-between px-4">
				<div class="my-4">
					{allHadiths[0].metadata.name}
					{allHadiths[0].hadiths[i].arabicnumber}
					<br />
					Book {allHadiths[0].hadiths[i].reference.book}, Hadith {allHadiths[0]
						.hadiths[i].reference.hadith}
				</div>

				<button
					class="btn bg-primary-500 btn-sm text-white w-40 my-4 px-4"
					on:click={clickHandler}
					use:clipboard={"hadithhub.com/" +
						book +
						":" +
						allHadiths[0].hadiths[i].arabicnumber}
					>{permalinkText}
				</button>
			</div>
		</div>
	{/if}
{/each}

<style>
	.hadithGroup {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	.gradingGroup {
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	}
</style>
