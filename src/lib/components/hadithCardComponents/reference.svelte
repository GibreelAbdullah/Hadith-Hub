<!-- ReferenceSection.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import SvgIcon from '../common/svgIcon.svelte';
    import * as htmlToImage from 'html-to-image';
	import download from 'downloadjs';
	import { getFontStyleForText, type AppSettings } from '$lib/functions/settingsStore';
	import { languageStore } from '$lib/functions/store.svelte';

	interface Props {
		collectionTitle: string;
		bookTitle: string;
		collectionShortName: string;
		hadithNumberInCollection: string;
		hadithNumberInBook: string;
		bookNumber: any;
		fontSettings: AppSettings;
		displayLang?: string;
	}

	let { collectionTitle, bookTitle, collectionShortName, hadithNumberInCollection, hadithNumberInBook, bookNumber, fontSettings, displayLang }: Props = $props();

	let linkLang = $derived.by(() => {
		const langs = [...languageStore.value];
		if (displayLang) {
			for (const l of displayLang.split(',')) {
				if (l && !langs.includes(l)) {
					langs.push(l);
				}
			}
		}
		return langs.join(',');
	});

	let visible = $state(false);

	function showAndHideCopiedAlert() {
		visible = true;
		setTimeout(() => {
			visible = false;
		}, 3000);
	}

	function copyPermalink() {
		const link = $page.url.protocol +
			'//' +
			$page.url.host +
			base +
			'/' +
			collectionShortName +
			':' +
			hadithNumberInCollection
				.replace('<span style="color:red;">', '')
				.replace('</span>', '') +
			'?lang=' +
			linkLang;
		navigator.clipboard.writeText(link).then(() => {
			showAndHideCopiedAlert();
		}).catch((err) => {
			console.error('Failed to copy:', err);
		});
	}

    function captureHadithScreenshot(
		elementId: string,
		copy: boolean = false
	) {
		const hadithGroup = document.getElementById('hadith' + elementId);
		const buttonGroup = document.getElementById('buttonGroup' + elementId)!;
		const watermark = document.getElementById('watermark' + elementId)!;
		if (!hadithGroup) return;

		// Temporarily show watermark and hide buttons (visibility preserves layout)
		watermark.classList.remove('hidden');
		watermark.classList.add('flex');
		buttonGroup.style.visibility = 'hidden';
		visible = false;

		htmlToImage
			.toPng(hadithGroup, {
				style: { margin: '0' },
				backgroundColor: getComputedStyle(hadithGroup).backgroundColor || (document.documentElement.classList.contains('dark') ? '#1a1a2e' : '#ffffff'),
				filter: (node) => {
					if (node === buttonGroup) return false;
					return true;
				}
			})
			.then((dataUrl) => {
				if (!copy) {
					download(dataUrl, `${collectionTitle} : ${hadithNumberInCollection}.png`);
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
								function () {
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
				watermark.classList.remove('flex');
				watermark.classList.add('hidden');
				buttonGroup.style.visibility = '';
				visible = true;
				setTimeout(() => {
					visible = false;
				}, 3000);
			});
	}
</script>
{#if visible}
	<aside
		class="fixed top-20 right-4 transform shadow-lg rounded-lg py-4 px-20 z-50 alert preset-filled-primary-500"
	>
		<div>✔</div>
		<div class="alert-message">
			<p>Copied</p>
		</div>
	</aside>
{/if}
<div
	class="lgcd flex flex-col sm:flex-row sm:justify-between sm:items-center items-center px-3 py-3 mt-3 border-t border-surface-300-600 text-surface-950-50 text-sm gap-2 relative"
	style={getFontStyleForText(collectionTitle, 'en', fontSettings)}
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
					class="text-center justify-center px-4 min-[480px]:px-8 btn preset-filled-primary-500 btn-sm mt-6 h-10 rounded-r-none"
					onclick={() => captureHadithScreenshot(collectionShortName + hadithNumberInCollection, true)}
				>
					<SvgIcon name="copy" fill="fill-black" class="w-5 h-5" />
				</button>
				<button
					class="btn preset-filled-primary-500 btn-sm mt-6 h-10 rounded-l-none px-4 min-[480px]:px-8 border-l-2 border-primary-900"
					onclick={() =>
						captureHadithScreenshot(collectionShortName + hadithNumberInCollection, false)}
				>
					<SvgIcon name="download" fill="fill-black" class="w-5 h-5" />
				</button>
				<div class="text-center">
					<p class="text-sm badge opacity-50">SCREENSHOT</p>
				</div>
			</div>
			<br />
			<div class="mx-1">
				<button
					class="text-center justify-center px-4 min-[480px]:px-8 btn preset-filled-primary-500 btn-sm mt-6 h-10 rounded-r-none"
					onclick={copyPermalink}
				>
					<SvgIcon name="copy" fill="fill-black" class="w-5 h-5" />
				</button>
				<a
					class="btn preset-filled-primary-500 btn-sm mt-6 h-10 rounded-l-none px-4 min-[480px]:px-8 border-l-2 border-primary-900"
					href={$page.url.protocol +
						'//' +
						$page.url.host +
						base +
						'/' +
						collectionShortName +
						':' +
						hadithNumberInCollection
							.replace('<span style="color:red;">', '')
							.replace('</span>', '') +
						'?lang=' +
						linkLang}
					target="_blank"
					rel="noreferrer"
				>
					<SvgIcon name="openExternal" fill="fill-black" class="w-5 h-5"/>
				</a>
				<div class="text-center">
					<p class="text-sm badge opacity-50">LINK</p>
				</div>
			</div>
		</div>
	</div>
	<div id="watermark{collectionShortName}{hadithNumberInCollection}" class="hidden absolute top-[65%] sm:top-[45%] -translate-y-1/2 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-3">
		<SvgIcon class="!w-10" name="icon" />
		<SvgIcon class="!w-40" name="hadithHub" />
		<SvgIcon class="!w-20 !fill-error-500 pt-1" name="com" />
	</div>
</div>
