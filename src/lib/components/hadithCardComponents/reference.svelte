<!-- ReferenceSection.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { clipboard } from '@skeletonlabs/skeleton';
	import SvgIcon from '../common/svgIcon.svelte';
    import * as htmlToImage from 'html-to-image';
	import download from 'downloadjs';
	let visible: boolean = false;

	export let collectionTitle: string;
	export let bookTitle: string;
	export let collectionShortName: string;
	export let hadithNumberInCollection: string;
	export let hadithNumberInBook: string;
	export let bookNumber: any;

	function showAndHideCopiedAlert() {
		visible = true;
		setTimeout(() => {
			visible = false;
		}, 3000);
	}

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
					// Copy the image to clipboard
					visible = true;
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
									// console.log('Image copied to clipboard successfully!');
								},
								function (err) {
									// console.error('Failed to copy image: ', err);
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
										visible = true;
						setTimeout(() => {
							visible = false;
						}, 3000);
				// showAndHideCopiedAlert();
			});
	}
</script>
{#if visible}
	<aside
		class="fixed top-20 right-4 transform shadow-lg rounded-lg py-4 px-20 z-50 alert variant-filled-primary"
	>
		<div>✔</div>
		<div class="alert-message">
			<p>Copied</p>
		</div>
	</aside>
{/if}
<div
	class="lgcd flex flex-col sm:flex-row sm:justify-between sm:items-center items-center px-3 py-3 mt-3 border-t border-surface-300 dark:border-surface-600 text-black dark:text-white text-sm gap-2"
>
	<div class="text-center sm:text-left">
		<div class="flex items-center gap-1 justify-center sm:justify-start">
			<span>{collectionTitle}</span><span dir="ltr">: {hadithNumberInCollection}</span>
		</div>
		<div class="flex items-center gap-1 justify-center sm:justify-start">
			<span>{bookTitle}</span><span dir="ltr">: {hadithNumberInBook}</span>
		</div>
		<div>
			Book {bookNumber} : {hadithNumberInBook}
		</div>
	</div>
	<div class="text-[0px] whitespace-pre flex justify-center min-[820px]:justify-end relative">
		<div id="buttonGroup{collectionShortName}{hadithNumberInCollection}" class="flex">
			<div class="mx-1">
				<button
					id="permalink{collectionShortName}{hadithNumberInCollection}"
					class="text-center justify-center px-4 min-[480px]:px-8 btn bg-primary-500 btn-sm text-black mt-6 h-10 rounded-r-none"
					on:click={() => captureHadithScreenshot(collectionShortName + hadithNumberInCollection, 'hadith-screenshot.png', true)}
				>
					<SvgIcon name="copy" fill="fill-black" />
				</button>
				<button
					class="btn bg-primary-500 btn-sm text-black mt-6 h-10 rounded-l-none px-4 min-[480px]:px-8 border-l-2 border-primary-900"
					on:click={() =>
						captureHadithScreenshot(collectionShortName + hadithNumberInCollection, 'hadith-screenshot.png', false)}
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
					id="permalink{collectionShortName}{hadithNumberInCollection}"
					class="text-center justify-center px-4 min-[480px]:px-8 btn bg-primary-500 btn-sm text-black mt-6 h-10 rounded-r-none"
					use:clipboard={$page.url.protocol +
						'//' +
						$page.url.host +
						base +
						'/' +
						collectionShortName +
						':' +
						hadithNumberInCollection
							.replace('<span style="color:red;">', '')
							.replace('</span>', '')}
					on:click={() => {
						showAndHideCopiedAlert();
					}}
				>
					<SvgIcon name="copy" fill="fill-black" />
				</button>
				<a
					class="btn bg-primary-500 btn-sm text-black mt-6 h-10 rounded-l-none px-4 min-[480px]:px-8 border-l-2 border-primary-900"
					href={$page.url.protocol +
						'//' +
						$page.url.host +
						base +
						'/' +
						collectionShortName +
						':' +
						hadithNumberInCollection
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
	<div id="watermark{collectionShortName}{hadithNumberInCollection}" class="hidden pt-6 pr-10">
		<SvgIcon class="!w-10" name="icon" />
		<SvgIcon class="!w-40" name="hadithHub" />
		<SvgIcon class="!w-20 !fill-error-500 pt-1" name="com" />
	</div>
</div>
