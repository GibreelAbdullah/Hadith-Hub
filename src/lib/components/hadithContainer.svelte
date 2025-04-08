<script lang="ts">
	import { page } from '$app/stores';
	import * as htmlToImage from 'html-to-image';
	import { clipboard, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import SvgIcon from './common/svgIcon.svelte';
	import { languageStore } from '$lib/functions/store.svelte';
	import download from 'downloadjs';
	import { onMount } from 'svelte';
	import GradingPopup from './gradingPopup.svelte';
	// import GradingPopup from '$lib/components/gradingPopup.svelte';
	export let dataListRecord: any[] = [];
	let bookTitle = '';
	let collectionTitle = '';
	let visible: boolean = false;

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

	function captureHadithScreenshot(
		elementId: string,
		fileName: string | undefined,
		copy: boolean = false
	) {
		const hadithGroup = document.getElementById('hadith' + elementId);
		const buttonGroup = document.getElementById('buttonGroup' + elementId)!;
		const watermark = document.getElementById('watermark' + elementId)!;
		if (!hadithGroup) return;

		buttonGroup.setAttribute('class', 'hidden');
		watermark.setAttribute('class', 'flex');

		htmlToImage
			.toPng(hadithGroup)
			.then((dataUrl) => {
				if (!copy) {
					download(dataUrl, fileName);
				} else {
					visible = true;
					// Copy the image to clipboard
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
			})
			.catch((error) => {
				console.error('Error capturing screenshot:', error);
			})
			.finally(() => {
				buttonGroup.setAttribute('class', 'flex');
				watermark.setAttribute('class', 'hidden');
				setTimeout(() => {
					visible = false;
				}, 3000);
			});

	}

	const popupFeatured: PopupSettings = {
		event: 'click',
		target: 'popupFeatured',
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
{#if visible}
		<aside class="fixed top-18 right-4 shadow-lg rounded-lg py-4 px-20 z-50 alert variant-filled-primary">
			<!-- Message -->
			<div>✔</div>
			<div class="alert-message">
				<p>Copied</p>
			</div>
		</aside>
{/if}
{#each dataListRecord as data}
	{#if data[5] == 'collection'}
		{@const dummy = collectionTitle = data[7]}
		<div class="sticky top-0 card p-4 !variant-glass-secondary max-w-[90rem] m-auto my-4">
			<div class="hadithGroup grid px-5">
				<ol class="breadcrumb">
					<li class="crumb anchor"><a href="/?lang={languageStore.value.toString()}">Home</a></li>
					<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
					<li class="crumb anchor">
						<a href="/{$page.params.collection}?lang={languageStore.value.toString()}">{data[7]}</a>
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
			<div class="px-4 card variant-glass-primary max-w-[90rem] m-auto">
				<div class="hadithGroup font-medium grid">
					{#each { length: languageStore.value.length ? languageStore.value.length : 2 } as _, i}
						<div class="break-words leading-7 m-3 pb-4">
							<article id="myDiv">({data[4]}) {@html data[i + 7]}</article>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else if data[5] == 'chapter_intro'}
		<div class="p-4 max-w-[90rem] m-auto">
			<!-- <div class="card flex-wrap"> -->
			<div class="hadithGroup font-medium grid">
				{#each { length: languageStore.value.length ? languageStore.value.length : 2 } as _, i}
					<div class="break-words leading-7 m-3 pb-4">
						<article id="myDiv">{@html data[i + 7]}</article>
					</div>
				{/each}
			</div>
			<!-- </div> -->
		</div>
	{:else if data[5] == 'hadith'}
		<div class="p-4" id="hadith{data[0]}{data[1]}">
			<div class="p-4 card max-w-[90rem] m-auto">
				<div class="card flex-wrap">
					<div class="hadithGroup font-medium grid">
						{#each { length: languageStore.value.length ? languageStore.value.length : 2 } as _, i}
							<div class="break-words leading-7 m-3 pb-4">
								<article id="myDiv">{@html data[i + 7]}</article>
							</div>
						{/each}
					</div>
				</div>
				<!-- GRADINGS -->
				<!-- <div class="flex flex-wrap justify-between items-center px-3 pt-2 pb-2">
					{data[6]}
				</div> -->
				<div class="hadithGroup font-medium grid place-items-center">
					<!-- [0] because if there are multiple languages selected we only take from the first one, since gradings don't change for different languages -->
					{#each data[6] as grade, i}
					
						{#if grade[0] != ''}
						<button
								class="btn m-1 {grade[3]} text-wrap max-w-md w-[95%] h-[95%]"
								use:popup={{
									event: 'click',
									target: 'popupFeatured' + grade[0] + i + data[1]
								}}
							>
								{@html grade[0] + ' : ' + grade[1]}
							</button>
							<div
								class="card p-4 w-72 shadow-xl variant-filled-secondary z-[1]"
								data-popup="popupFeatured{grade[0]}{i}{data[1]}"
							>
								<!-- Why is it not working for  loadPopupForIndex = i -->
								<!-- {#if loadPopupForMuhaddith == grade[0] && loadPopupForIndex >= grade[1]} -->
								<GradingPopup
									muhaddithName={grade[4]}
									source={grade[2]}
								/>
								<!-- {/if} -->
							</div>
						{/if}
					{/each}
				</div>
				<!-- REFERENCE AND BUTTONS -->
				<div
					class="font-thin lgcd flex justify-between items-center px-3 pb-2 text-primary-700 dark:text-primary-400 text-sm"
				>
					<div>
						<div>
							{collectionTitle} : {data[1]}
						</div>
						<div>
							{bookTitle} : {data[3]}
						</div>
						<div>
							Book {data[2]} : {data[3]}
						</div>
					</div>
					<div class="text-[0px] whitespace-pre flex justify-center min-[820px]:justify-end relative">
						<div id="buttonGroup{data[0]}{data[1]}" class="flex">
						<div class="mx-1">
							<button
								id="permalink{data[0]}{data[1]}"
								class="text-center justify-center px-4 min-[480px]:px-8 btn bg-primary-500 btn-sm text-black mt-6 h-10 rounded-r-none"
								on:click={() =>
									captureHadithScreenshot(data[0] + data[1], 'hadith-screenshot.png', true)}
							>
								<SvgIcon name="copy" fill="fill-black" />
							</button>
							<button
								class="btn bg-primary-500 btn-sm text-black mt-6 h-10 rounded-l-none px-4 min-[480px]:px-8 border-l-2 border-primary-900"
								on:click={() =>
									captureHadithScreenshot(data[0] + data[1], 'hadith-screenshot.png', false)}
							>
								<SvgIcon name="download" fill="fill-black" />
							</button>
							<div class="text-center">
								<p class="text-sm badge opacity-50">SCREENSHOT</p>
							</div>
						</div>
						<br />
						<div class="mx-1">
							<button
								id="permalink{data[0]}{data[1]}"
								class="text-center justify-center px-4 min-[480px]:px-8 btn bg-primary-500 btn-sm text-black mt-6 h-10 rounded-r-none"
								use:clipboard={$page.url.protocol +
									'//' +
									$page.url.host +
									'/' +
									data[0] +
									':' +
									(data[1] | 0)
										.toString()
										.replace('<span style="color:red;">', '')
										.replace('</span>', '')}
							>
								<SvgIcon name="copy" fill="fill-black" />
							</button>
							<a
								class="btn bg-primary-500 btn-sm text-black mt-6 h-10 rounded-l-none px-4 min-[480px]:px-8 border-l-2 border-primary-900"
								href={$page.url.protocol +
									'//' +
									$page.url.host +
									'/' +
									data[0] +
									':' +
									(data[1] | 0)
										.toString()
										.replace('<span style="color:red;">', '')
										.replace('</span>', '')}
								target="_blank"
								rel="noreferrer"
							>
								<SvgIcon name="openExternal" fill="fill-black" />
							</a>
							<div class="text-center">
								<p class="text-sm badge opacity-50">LINK</p>
							</div>
						</div>
					</div>
					</div>
					<div id="watermark{data[0]}{data[1]}" class="hidden pt-6 pr-10">
						<SvgIcon class="!w-10" name="icon" />
						<SvgIcon class="!w-40" name="hadithHub" />
						<SvgIcon class="!w-20 !fill-error-500 pt-1" name="com" />
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
