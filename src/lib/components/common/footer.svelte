<script lang="ts">
	import SvgIcon from '$lib/components/common/svgIcon.svelte';
</script>

<footer>
	<div class="p-8 sticky top-[100vh]">
		<section
			class="flex flex-col lg:flex-row justify-between items-center lg:items-start space-y-5 lg:space-y-0"
		>
			<span class="pr-4">
				<SvgIcon class="!w-10" name="icon" />
				<SvgIcon class="!w-40" name="hadithHub" />
			</span>
			<div class="px-4 logo-cloud grid-cols-4 gap-1">
				<a
					class="btn bg-[#ea4335] text-white"
					href="mailto:gibreel.khan@gmail.com"
					target="_blank"
					rel="noreferrer"
				>
					<!-- Font Awesome Free - https://fontawesome.com/icons/envelope?s=solid - License: https://fontawesome.com/license/free -->
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="inline-block fill-white w-5" aria-hidden="true">
						<path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
					</svg>
					<span class="hidden lg:inline-block ml-2 text-white pt-1">Mail</span>
				</a>
				<a
					class="btn bg-[#6e5494] text-white"
					href="https://github.com/GibreelAbdullah/Hadith-Hub"
					target="_blank"
					rel="noreferrer"
				>
					<!-- Font Awesome Free - https://fontawesome.com/icons/github?s=brands - License: https://fontawesome.com/license/free -->
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" class="inline-block fill-white w-5" aria-hidden="true">
						<path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
					</svg>
					<span class="hidden lg:inline-block ml-2 text-white pt-1">Github</span>
				</a>
				<a
					class="btn bg-[#1da1f2]"
					href="https://twitter.com/TheHadithHub"
					target="_blank"
					rel="noreferrer"
				>
					<!-- Font Awesome Free - https://fontawesome.com/icons/twitter?s=brands - License: https://fontawesome.com/license/free -->
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="inline-block fill-white w-5" aria-hidden="true">
						<path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/>
					</svg>
					<span class="hidden lg:inline-block ml-2 text-white pt-1">Twitter</span>
				</a>
				<a class="btn bg-[#2aa1da] text-white" href="https://t.me/GibreelAbdullah" target="_blank">
					<!-- Telegram logo - Source: https://commons.wikimedia.org/wiki/File:Telegram_logo.svg -->
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="55 75 145 95" class="inline-block w-5" aria-hidden="true">
						<path d="M81.486,130.178,52.2,120.636s-3.5-1.42-2.373-4.64c.232-.664.7-1.229,2.1-2.2,6.489-4.523,120.106-45.36,120.106-45.36s3.208-1.081,5.1-.362a2.766,2.766,0,0,1,1.885,2.055,9.357,9.357,0,0,1,.254,2.585c-.009.752-.1,1.449-.169,2.542-.692,11.165-21.4,94.493-21.4,94.493s-1.239,4.876-5.678,5.043A8.13,8.13,0,0,1,146.1,172.5c-8.711-7.493-38.819-27.727-45.472-32.177a1.27,1.27,0,0,1-.546-.9c-.093-.469.417-1.05.417-1.05s52.426-46.6,53.821-51.492c.108-.379-.3-.566-.848-.4-3.482,1.281-63.844,39.4-70.506,43.607A3.21,3.21,0,0,1,81.486,130.178Z" fill="#fff"/>
					</svg>
					<span class="hidden lg:inline-block ml-2 text-white pt-1">Telegram</span>
				</a>
			</div>
		</section>
		<section class="pt-8 flex flex-row justify-center lg:justify-start items-center space-y-0">
			<div>
				<span class="float-left">Contributors</span>
				<p class="text-xs">
					<a
						class="anchor"
						href="https://github.com/GibreelAbdullah/hadith-api/graphs/contributors"
						target="_blank"
						rel="noreferrer">Data</a
					>
					<span class="opacity-10 mx-4">|</span>
					<a
						class="anchor"
						href="https://github.com/GibreelAbdullah/HadithHub/graphs/contributors"
						target="_blank"
						rel="noreferrer">UI</a
					>
				</p>
			</div>
			<a class="anchor float-right pl-8" href="/about">About</a>
			<a class="anchor float-right pl-8" href="/references">References</a>
			<a class="anchor float-right pl-8" href="/blogs">Blogs</a>
		</section>
	</div>
</footer>
