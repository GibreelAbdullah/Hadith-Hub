<script lang="ts">
	import SvgIcon from '$lib/common/svgIcon.svelte';
</script>

<div class="p-8 sticky top-[100vh]">
	<div class="card p-4 m-4 !bg-surface-500">
		<div class="hadithGroup font-medium p-2 grid text-center text-white">
			Requesting Talib Ul-Ilm to help in adding more books and Takhreej. Connect with me on any of
			the platforms below.
		</div>
	</div>
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
				<SvgIcon name="mail" fill="fill-white" />
				<span class="hidden lg:inline-block ml-2 text-white pt-1">Mail</span>
			</a>
			<a
				class="btn bg-[#6e5494] text-white"
				href="https://github.com/GibreelAbdullah/Hadith-Hub"
				target="_blank"
				rel="noreferrer"
			>
				<SvgIcon name="github" fill="fill-white" />
				<span class="hidden lg:inline-block ml-2 text-white pt-1">Github</span>
			</a>
			<a
				class="btn bg-[#1da1f2]"
				href="https://twitter.com/TheHadithHub"
				target="_blank"
				rel="noreferrer"
			>
				<SvgIcon name="twitter" fill="fill-white" />
				<span class="hidden lg:inline-block ml-2 text-white pt-1">Twitter</span>
			</a>
			<a
				class="btn bg-[#2aa1da] text-white"
				href="https://t.me/GibreelAbdullah"
				target="_blank"
			>
				<img
					width="32"
					alt="Telegram logo"
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png"
				/>
				<span class="hidden lg:inline-block ml-2 text-white pt-1">Telegram</span>

			</a>
			<a
				class="btn bg-[#008c40] text-white"
				href="https://play.google.com/store/apps/details?id=com.islamicproapps.hadithpro"
				target="_blank"
				rel="noreferrer"
			>
				<SvgIcon name="playstore" fill="fill-white" />
				<span class="hidden lg:inline-block ml-2 text-white pt-1">PlayStore</span>
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
		<a
			class="anchor float-right pl-8"
			href="https://github.com/fawazahmed0/hadith-api/blob/1/References.md"
			target="_blank">References</a
		>
	</section>
</div>
