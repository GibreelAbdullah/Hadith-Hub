<script lang="ts">
	import { page } from '$app/stores';
	import * as htmlToImage from 'html-to-image';
	import { clipboard, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import SvgIcon from '../common/svgIcon.svelte';
	import download from 'downloadjs';
	import GradingPopup from '$lib/common/gradingPopup.svelte';
	export let book = '';
	export let allHadiths: any[] = [];
	export let singleHadithView: boolean = false;
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
</script>
{#each { length: allHadiths[0].hadiths.length } as _, i}
	{#if allHadiths[0].hadiths[i].chapter !== undefined && allHadiths[0].hadiths[i].chapter.id && (singleHadithView || allHadiths[0].hadiths[i].chapter['isFirstHadith'])}
	<div class="p-4">
			<div class="card variant-glass-primary z-[-1] relative max-w-[90rem] m-auto">
				<div class="hadithGroup grid">
					<div class="break-words leading-7 m-3">
						Chapter {allHadiths[0].hadiths[i].chapter['id']} - {allHadiths[0].hadiths[i].chapter['eng-name'] || ''}
					</div>
					<div class="break-words leading-7 m-3 text-right">
						باب {allHadiths[0].hadiths[i].chapter['id']} - {allHadiths[0].hadiths[i].chapter[
							'ara-name'
						]}
					</div>
				</div>
			</div>
		</div>
	{/if}
	<div class="p-4">
		<div class="p-4 card max-w-[90rem] m-auto">
			<div id="hadithGroup{i}">
				<div class="card flex-wrap">
					<!-- HADITH TEXT -->
					<div class="hadithGroup font-medium grid">
						{#each { length: allHadiths.filter(n => n).length } as _, j}
							<div class="break-words leading-7 m-3 pb-4">
								{#if allHadiths[j]}
									{#if !allHadiths[j].hadiths[i] || allHadiths[j].hadiths[i].text == ''}
										<center>
											<code class="!text-white !bg-red-500">Hadith translation not found</code>
										</center>
									{:else}
										<article>{@html allHadiths[j].hadiths[i].text}</article>
									{/if}
								{/if}
							</div>
						{/each}
					</div>
					<!-- GRADINGS -->
					<div class="hadithGroup font-medium grid place-items-center">
						{#if allHadiths[0].hadiths[i].grades.size > 0}
							<hr />
						{/if}
						<!-- [0] because if there are multiple languages selected we only take from the first one, since gradings don't change for different languages -->
						{#each allHadiths[0].hadiths[i].grades as grade}
							{#if grade['name'] != ''}
							<button
									class="btn m-1 {gradingColor(grade['grade'])} text-wrap max-w-md w-[95%] h-[95%]"
									use:popup={{
										state: (event) => func(event, grade['name'], i),
										event: 'click',
										target: 'popupFeatured' + grade['name']
									}}
								>
									{@html grade['name'] + ' : ' + grade['grade']}
								</button>
								<div
									class="card p-4 w-72 shadow-xl variant-filled-secondary z-[1]"
									data-popup="popupFeatured{grade['name']}"
								>
									<!-- Why is it not working for  loadPopupForIndex = i -->
									{#if loadPopupForMuhaddith == grade['name'] && loadPopupForIndex >= i}
										<GradingPopup
											muhaddithName={loadPopupForMuhaddith}
											collection={allHadiths[0].hadiths[i].shortName ?? book}
										/>
									{/if}
								</div>
							{/if}
						{/each}
					</div>
					<hr />
					<div class="hadithGroup grid text-sm mx-4">
						<div class="py-4 px-2 text-center md:text-left">
							{#if allHadiths[0].metadata}
								{@html allHadiths[0].metadata.name}
							{:else}
								{@html allHadiths[0].hadiths[i].bookName}
							{/if}
							{@html allHadiths[0].hadiths[i].arabicnumber}
							<br />
							Book {@html allHadiths[0].hadiths[i].reference.book}, Hadith {@html allHadiths[0]
								.hadiths[i].reference.hadith}
						</div>
						<!-- <span class=""/> -->

						<div class="text-[0px] whitespace-nowrap flex justify-center md:justify-end relative">
							<div id="buttonGroup{i}" class="flex">
								<div class="mx-2">
									<button
										id="permalink{i}"
										class="text-center justify-center px-8 btn bg-primary-500 btn-sm text-black mt-6 h-10 rounded-r-none"
										on:click={() =>
											capture(
												i,
												(
													(allHadiths[0].metadata
														? allHadiths[0].metadata.name
														: allHadiths[0].hadiths[i].bookName) +
													' ' +
													allHadiths[0].hadiths[i].arabicnumber
												)
													.replace('<span style="color:red;">', '')
													.replace('</span>', ''),
												true,
												false
											)}
									>
										<SvgIcon name="copy" fill="fill-black" />
									</button>
									<button
										class="btn bg-primary-500 btn-sm text-black mt-6 h-10 rounded-l-none px-8 border-l-2 border-primary-900"
										on:click={() =>
											capture(
												i,
												(
													(allHadiths[0].metadata
														? allHadiths[0].metadata.name
														: allHadiths[0].hadiths[i].bookName) +
													' ' +
													allHadiths[0].hadiths[i].arabicnumber
												)
													.replace('<span style="color:red;">', '')
													.replace('</span>', ''),
												false,
												true
											)}
									>
										<SvgIcon name="download" fill="fill-black" />
									</button>
									<div class="text-center">
										<p class="text-sm badge opacity-50">SCREENSHOT</p>
									</div>
								</div>

								<div class="mx-2">
									<button
										id="permalink{i}"
										class="text-center justify-center px-8 btn bg-primary-500 btn-sm text-black mt-6 h-10 rounded-r-none"
										use:clipboard={$page.url.protocol +
											'//' +
											$page.url.host +
											'/' +
											(allHadiths[0].hadiths[i].shortName ?? book) +
											':' +
											(allHadiths[0].hadiths[i].hadithnumber | 0)
												.toString()
												.replace('<span style="color:red;">', '')
												.replace('</span>', '')}
									>
										<SvgIcon name="copy" fill="fill-black" />
									</button>
									<a
										class="btn bg-primary-500 btn-sm text-black mt-6 h-10 rounded-l-none px-8 border-l-2 border-primary-900"
										href={$page.url.protocol +
											'//' +
											$page.url.host +
											'/' +
											(allHadiths[0].hadiths[i].shortName ?? book) +
											':' +
											(allHadiths[0].hadiths[i].hadithnumber | 0)
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
							<div id="watermark{i}" class="hidden pt-6 pr-10">
								<SvgIcon class="!w-10" name="icon" />
								<SvgIcon class="!w-40" name="hadithHub" />
								<SvgIcon class="!w-20 !fill-error-500 pt-1" name="com" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/each}

<style>
	.hadithGroup {
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		word-wrap: normal;

	}
</style>
