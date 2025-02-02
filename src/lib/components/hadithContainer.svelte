<script lang="ts">
	import { page } from '$app/stores';
	import * as htmlToImage from 'html-to-image';
	import { clipboard, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import SvgIcon from './common/svgIcon.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import download from 'downloadjs';
	import { onMount } from 'svelte';
	// import GradingPopup from '$lib/components/gradingPopup.svelte';
	export let book = '';
	export let dataListRecord: any[] = [];
	export let singleHadithView: boolean = false;
	let bookTitle = '';
	let collectionTitle = '';

	let arabicFontFamily = 'KFGQPC Uthman Taha Naskh';
	let gradingColorClass = '';
	const gradingColor = (grade: string) => {
		if (!grade) {
			return;
		} else if (['hasan', 'mursal', 'jayyid'].some((i) => grade.toLowerCase().includes(i))) {
			gradingColorClass = 'bg-indigo-600 text-white';
		} else if (grade.toLowerCase().includes('sahih')) {
			gradingColorClass = 'bg-emerald-500 text-black';
		} else if (['mawdu', 'batil', 'munkar'].some((i) => grade.toLowerCase().includes(i))) {
			gradingColorClass = 'bg-red-500 text-black';
		} else if (grade.toLowerCase().includes('daif')) {
			gradingColorClass = 'bg-orange-500 text-black';
		} else {
			gradingColorClass = 'bg-gray-500';
		}
		return gradingColorClass;
	};
	function capture(i: number, name: string, copy: boolean, save: boolean) {
		let hadithGroup = document.getElementById('hadithGroup' + i)!;
		let buttonGroup = document.getElementById('buttonGroup' + i)!;
		let watermark = document.getElementById('watermark' + i)!;

		buttonGroup.setAttribute('class', 'hidden');
		watermark.setAttribute('class', 'flex p-3');
		htmlToImage.toPng(hadithGroup).then(function (dataUrl) {
			if (save) {
				download(dataUrl, name);
			}
			if (copy) {
				const img = new Image();
				img.onload = function () {
					const canvas = document.createElement('canvas');
					canvas.width = img.width;
					canvas.height = img.height;
					const ctx = canvas.getContext('2d');
					if (!ctx) return;
					ctx.drawImage(img, 0, 0);

					canvas.toBlob(function (blob) {
						if (!blob) return;
						const item = new ClipboardItem({ 'image/png': blob });
						navigator.clipboard.write([item]).then(
							function () {
								console.log('Image copied to clipboard successfully!');
							},
							function (err) {
								console.error('Failed to copy image: ', err);
							}
						);
					}, 'image/png');
				};

				img.src = dataUrl;
			}
			buttonGroup.setAttribute('class', 'flex');
			watermark.setAttribute('class', 'hidden');
		});
	}

	const popupFeatured: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupFeatured',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};
	let loadPopupForMuhaddith: string;
	let loadPopupForIndex: number;
	$: {
		loadPopupForMuhaddith = '';
		loadPopupForIndex = -1;
	}
	function func(event: { state: boolean }, name: string, hadithIndex: number): void {
		if (event.state) {
			loadPopupForMuhaddith = name;
			loadPopupForIndex = hadithIndex;
		}
	}
	// onMount(() => {
	// 	const myDocs = document.querySelectorAll('#myDiv') as NodeListOf<HTMLElement>;
	// 	myDocs.forEach((myDoc) => {
	// 		const parser = new DOMParser();
	// 		const myDocHtml = parser.parseFromString(myDoc.innerHTML, 'text/html');
	// 		const qblTags = myDocHtml.querySelectorAll('qbl') as NodeListOf<HTMLElement>;
	// 		qblTags.forEach((qblTag) => {
	// 			qblTag.style.setProperty('color', 'red');
	// 		});
	// 		// myDoc.innerHTML = myDocHtml.body.innerHTML;
	// 		myDoc.style.setProperty('font-family', 'KFGQPC Uthman Taha Naskh');
	// 	});
	// })
</script>

{#each dataListRecord as data}
	{#if data[5] == 'collection'}
		{@const dummy = collectionTitle = data[7]}
		<div class="sticky top-0 card p-4 !variant-glass-secondary max-w-[90rem] m-auto my-4">
			<div class="hadithGroup grid px-5">
				<ol class="breadcrumb">
					<li class="crumb anchor"><a href="/">Home</a></li>
					<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
					<li class="crumb anchor">
						<a href="/{$page.params.collection}">{data[7]}</a>
					</li>
					<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
					<li id="bookCrumb" class="crumb">{bookTitle}</li>
				</ol>
			</div>
		</div>
	{:else if data[5] == 'book'}
		{@const dummy = bookTitle = data[7]}
	{:else if data[5] == 'chapter'}
		<div class="p-4">
			<div class="card variant-glass-primary z-[-1] relative max-w-[90rem] m-auto">
				<div class="hadithGroup grid">
					<div class="break-words leading-7 m-3">
						{data[4]}
						{#each { length: languageStore.value.length ? languageStore.value.length : 2 } as _, i}
							<div class="break-words leading-7 m-3 pb-4">
								<article id="myDiv">{@html data[i + 7]}</article>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{:else if data[5] == 'hadith'}
		<div class="p-4">
			<div class="p-4 card max-w-[90rem] m-auto ">
				<div class="font-bold lgcd :flex justify-between items-center px-3 pb-2 text-primary-700 dark:text-primary-400 text-lg">
					<div>
						{collectionTitle} : {data[1]}
					</div>
					<div>
						{bookTitle} (Book {data[2]}) : {data[3]}
					</div>
				</div>
				<div class="card flex-wrap">
					<div class="hadithGroup font-medium grid">
						{#each { length: languageStore.value.length ? languageStore.value.length : 2 } as _, i}
							<div class="break-words leading-7 m-3 pb-4">
								<article id="myDiv">{@html data[i + 7]}</article>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
{/each}

<style>
	.hadithGroup {
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		word-wrap: normal;
	}

	:global(qbl, b3d) {
		text-wrap: auto;
		display: block;
		color: rgb(var(--color-primary-900));
		font-family: 'KFGQPC Uthman Taha Naskh';
	}

	:global(.dark qbl, .dark b3d) {
		text-wrap: auto;
		color: rgb(var(--color-primary-300));
	}

	:global(text) {
		text-wrap: auto;
	}
</style>
