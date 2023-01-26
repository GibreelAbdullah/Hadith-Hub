<script>
	import SvgIcon from "$lib/components/svgIcon.svelte";
</script>

<div class="card card-body p-4 m-4 flex-wrap">
	<div class="text-center fill-black dark:fill-white">
		<SvgIcon class="md:w-60 w-40" name="bismillah" />
	</div>
	<div class="text-center fill-black dark:fill-white p-4">
		With the name of Allah, the All-Merciful, the Very-Merciful.
	</div>
	<div class="px-6 py-2">
		All praise and thanks are due to Allah, the Master and King of
		existence, the All-Merciful, Beneficent, who has power over all things.
		May peace and blessings be upon His final Messenger, Sayyidina Muhammad
		ﷺ, and his Family, and his Companions.
	</div>
	<div class="text-xl p-4">About<hr></div>
	<div class="px-6 py-2">
		HadithHub.com started in October 2022. It aims to make it easy for
		anyone to read, study, and learn the ahadith of Sayyidina Rasulullah ﷺ.
		This project is open source.
	</div>
	<div class="px-6 py-2">
		Frontend source code can be found
		<a href="https://github.com/GibreelAbdullah/Hadith-Hub"> here </a> and
		all the data in the app can be found
		<a href="https://github.com/GibreelAbdullah/hadith-api"> here</a>. We
		will be grateful if you contribute in this project to make it better.
	</div>
	<div class="px-6 py-2">
		It would be a grave injustice to omit the mention of
		<a href="https://github.com/fawazahmed0"> Fawaz Ahmed </a> who made the enormous
		effort in collecting Ahadith in multiple languages and their gradings by
		multiple scholars. This project wouldn't be possible without his efforts.
		May Allah ﷻ reward him immensely.
	</div>

	<div class="text-xl p-4">Credits <hr></div>
	<div class="px-6 py-2">
		<a href="https://github.com/fawazahmed0" class="font-bold">
			Fawaz Ahmed
		</a>: For collecting all the
		<a href="https://github.com/fawazahmed0/hadith-api">Ahadith data</a>. A
		complete list of sources of the data can be found
		<a
			href="https://github.com/fawazahmed0/hadith-api/blob/1/References.md"
		>
			here
		</a>.
	</div>
	<div class="px-6 py-2">
		<a
			href="https://github.com/GibreelAbdullah/HadithHub/graphs/contributors"
			class="font-bold"
		>
			Contributors - UI</a
		>: Contributors who helped in creating the website.
	</div>
	<div class="px-6 py-2">
		<a
			href="https://github.com/GibreelAbdullah/hadith-api/graphs/contributors"
			class="font-bold"
		>
			Contributors - Data</a
		>: Contributors who helped in collecting hadith/gradings or correcting
		them.
	</div>
	<div class="px-6 py-2">
		<a href="https://svelte.dev/" class="font-bold"> Svelte </a>: A
		front-end, open-source JavaScript framework for making interactive
		webpages.
	</div>
	<div class="px-6 py-2">
		<a href="https://www.skeleton.dev/" class="font-bold"> Skeleton </a>: A
		fully featured UI Toolkit for svelte.
	</div>
	<div class="px-6 py-2">
		<a href="https://github.com/bubkoo/html-to-image/" class="font-bold">
			html-to-image
		</a>: A javascript library to convert html to image, essentially
		allowing us to download screenshots of Ahadith.
	</div>
</div>
