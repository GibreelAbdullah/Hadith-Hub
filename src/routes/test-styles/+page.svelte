<script lang="ts">
</script>

<div class="p-8 max-w-4xl mx-auto space-y-12">
	<h1 class="text-2xl font-bold text-center mb-8">Islamic Arch Card Styles</h1>

	<!-- Style 1: CSS clip-path pointed arch -->
	<section>
		<h2 class="text-lg font-semibold mb-4">Style 1: Pointed Arch (clip-path)</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="relative">
				<div class="bg-primary-500/10 border border-primary-500/30 rounded-b-lg pt-12 pb-4 px-4 text-center" style="clip-path: polygon(0% 15%, 5% 8%, 15% 3%, 30% 0.5%, 50% 0%, 70% 0.5%, 85% 3%, 95% 8%, 100% 15%, 100% 100%, 0% 100%);">
					<p class="font-medium">Sahih al-Bukhari</p>
					<p class="text-sm opacity-70">صحيح البخاري</p>
				</div>
			</div>
			<div class="relative">
				<div class="bg-primary-500/10 border border-primary-500/30 rounded-b-lg pt-12 pb-4 px-4 text-center" style="clip-path: polygon(0% 15%, 5% 8%, 15% 3%, 30% 0.5%, 50% 0%, 70% 0.5%, 85% 3%, 95% 8%, 100% 15%, 100% 100%, 0% 100%);">
					<p class="font-medium">Book 1: Revelation</p>
					<p class="text-sm opacity-70">كتاب بدء الوحي</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Style 2: SVG arch border top -->
	<section>
		<h2 class="text-lg font-semibold mb-4">Style 2: SVG Arch Top</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="relative">
				<svg viewBox="0 0 200 30" class="w-full h-8" preserveAspectRatio="none">
					<path d="M0,30 C0,30 0,12 20,6 C40,0 60,0 100,0 C140,0 160,0 180,6 C200,12 200,30 200,30" fill="none" stroke="currentColor" class="text-primary-500" stroke-width="1"/>
				</svg>
				<div class="border border-t-0 border-primary-500/30 rounded-b-lg p-4 text-center">
					<p class="font-medium">Sahih al-Bukhari</p>
					<p class="text-sm opacity-70">صحيح البخاري</p>
				</div>
			</div>
			<div class="relative">
				<svg viewBox="0 0 200 30" class="w-full h-8" preserveAspectRatio="none">
					<path d="M0,30 C0,30 0,12 20,6 C40,0 60,0 100,0 C140,0 160,0 180,6 C200,12 200,30 200,30" fill="none" stroke="currentColor" class="text-primary-500" stroke-width="1"/>
				</svg>
				<div class="border border-t-0 border-primary-500/30 rounded-b-lg p-4 text-center">
					<p class="font-medium">Book 1: Revelation</p>
					<p class="text-sm opacity-70">كتاب بدء الوحي</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Style 3: Filled arch header with card body -->
	<section>
		<h2 class="text-lg font-semibold mb-4">Style 3: Filled Arch Header</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<div class="relative overflow-hidden rounded-t-lg">
					<svg viewBox="0 0 400 60" class="w-full h-12" preserveAspectRatio="none">
						<path d="M0,60 L0,40 C0,15 50,0 200,0 C350,0 400,15 400,40 L400,60 Z" class="fill-primary-500/20"/>
					</svg>
				</div>
				<div class="card rounded-t-none p-4 text-center border-t-0">
					<p class="font-medium">Sahih al-Bukhari</p>
					<p class="text-sm opacity-70">صحيح البخاري</p>
					<p class="text-xs mt-2">7563 Hadith</p>
				</div>
			</div>
			<div>
				<div class="relative overflow-hidden rounded-t-lg">
					<svg viewBox="0 0 400 60" class="w-full h-12" preserveAspectRatio="none">
						<path d="M0,60 L0,40 C0,15 50,0 200,0 C350,0 400,15 400,40 L400,60 Z" class="fill-primary-500/20"/>
					</svg>
				</div>
				<div class="card rounded-t-none p-4 text-center border-t-0">
					<p class="font-medium">Book 1: Revelation</p>
					<p class="text-sm opacity-70">كتاب بدء الوحي</p>
					<p class="text-xs mt-2">Hadith 1 - 7</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Style 4: Ogee/Horseshoe arch with border-radius -->
	<section>
		<h2 class="text-lg font-semibold mb-4">Style 4: Rounded Arch (border-radius only)</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="border border-primary-500/30 p-4 text-center" style="border-radius: 50% 50% 0.5rem 0.5rem / 20% 20% 0.5rem 0.5rem;">
				<p class="font-medium mt-2">Sahih al-Bukhari</p>
				<p class="text-sm opacity-70">صحيح البخاري</p>
			</div>
			<div class="border border-primary-500/30 p-4 text-center" style="border-radius: 50% 50% 0.5rem 0.5rem / 20% 20% 0.5rem 0.5rem;">
				<p class="font-medium mt-2">Book 1: Revelation</p>
				<p class="text-sm opacity-70">كتاب بدء الوحي</p>
			</div>
		</div>
	</section>

	<!-- Style 5: Hadith card with arch top and full content -->
	<section>
		<h2 class="text-lg font-semibold mb-4">Style 5: Full Hadith Card with Arch</h2>
		<div class="max-w-2xl mx-auto">
			<div class="relative">
				<svg viewBox="0 0 400 40" class="w-full h-8" preserveAspectRatio="none">
					<path d="M0,40 L0,30 C0,10 80,0 200,0 C320,0 400,10 400,30 L400,40 Z" class="fill-primary-500/15" stroke="currentColor" stroke-width="0.5" style="color: var(--color-primary-500)"/>
				</svg>
				<div class="card rounded-t-none border-t-0 p-6">
					<div class="text-center mb-3">
						<span class="text-xs bg-primary-500/15 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">Sunan Abu Dawud : 1</span>
					</div>
					<div class="leading-7 text-right mb-4" dir="rtl">
						<p>حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ قَالَ حَدَّثَنَا سُفْيَانُ</p>
					</div>
					<div class="leading-7 mb-4">
						<p>Narrated 'Umar bin Al-Khattab: I heard Allah's Messenger (ﷺ) saying, "The reward of deeds depends upon the intentions..."</p>
					</div>
					<div class="text-center">
						<span class="inline-block px-2 py-1 rounded text-xs bg-green-600/20 text-green-800 dark:text-green-300 border border-green-600/30">Al-Albani : Hasan Sahih</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Style 6: Minimal arch with just top-border shape -->
	<section>
		<h2 class="text-lg font-semibold mb-4">Style 6: Subtle Arch Shadow</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="card p-4 text-center overflow-hidden">
				<div class="absolute inset-x-0 top-0 h-2 bg-primary-500" style="border-radius: 0 0 50% 50% / 0 0 100% 100%;"></div>
				<p class="font-medium mt-2">Sahih al-Bukhari</p>
				<p class="text-sm opacity-70">صحيح البخاري</p>
			</div>
			<div class="card p-4 text-center overflow-hidden relative">
				<div class="absolute inset-x-0 top-0 h-2 bg-primary-500" style="border-radius: 0 0 50% 50% / 0 0 100% 100%;"></div>
				<p class="font-medium mt-2">Book 1: Revelation</p>
				<p class="text-sm opacity-70">كتاب بدء الوحي</p>
			</div>
		</div>
	</section>

	<!-- Style 7: Pointed Islamic Arch (Ogee - matching reference) -->
	<section>
		<h2 class="text-lg font-semibold mb-4">Style 7: Pointed Islamic Arch (Ogee)</h2>
		
		<!-- Hadith card -->
		<div class="max-w-2xl mx-auto mb-8">
			<div class="relative">
				<svg viewBox="0 0 800 120" class="w-full" preserveAspectRatio="none" style="height: 50px;">
					<path d="M0,120 L0,90 C0,90 50,90 120,70 C200,47 250,20 350,8 C380,4 390,1 400,0 C410,1 420,4 450,8 C550,20 600,47 680,70 C750,90 800,90 800,90 L800,120 Z"
						fill="none" stroke="#c9a84c" stroke-width="3"/>
					<path d="M0,120 L0,93 C0,93 52,93 122,73 C202,50 252,23 352,11 C382,7 392,4 400,3 C408,4 418,7 448,11 C548,23 598,50 678,73 C748,93 800,93 800,93 L800,120 Z"
						fill="none" stroke="#c9a84c" stroke-width="1" opacity="0.3"/>
				</svg>
				<div class="border border-t-0 rounded-b-lg p-6" style="border-color: #c9a84c55;">
					<div class="text-center mb-4">
						<span class="text-sm px-3 py-1 rounded-full font-medium" style="background: #c9a84c22; color: #9a7b2f;">Sahih al-Bukhari : 1</span>
					</div>
					<div class="leading-7 text-right mb-4" dir="rtl">
						<p>حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ قَالَ حَدَّثَنَا سُفْيَانُ قَالَ حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ</p>
					</div>
					<div class="leading-7 mb-4">
						<p>Narrated 'Umar bin Al-Khattab: I heard Allah's Messenger (ﷺ) saying, "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended."</p>
					</div>
					<div class="text-center mb-3">
						<span class="inline-block px-2 py-1 rounded text-xs bg-green-600/20 text-green-800 dark:text-green-300 border border-green-600/30">Al-Albani : Hasan Sahih</span>
					</div>
					<div class="border-t pt-3 text-center text-sm" style="border-color: #c9a84c33;">
						Sahih al-Bukhari : 1 · Book 1 : 1
					</div>
				</div>
			</div>
		</div>

		<!-- Collection cards -->
		<h3 class="text-md font-semibold mb-4">Collection Cards</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div class="relative">
				<svg viewBox="0 0 800 120" class="w-full" preserveAspectRatio="none" style="height: 35px;">
					<path d="M0,120 L0,90 C0,90 50,90 120,70 C200,47 250,20 350,8 C380,4 390,1 400,0 C410,1 420,4 450,8 C550,20 600,47 680,70 C750,90 800,90 800,90 L800,120 Z"
						fill="none" stroke="#c9a84c" stroke-width="3"/>
				</svg>
				<div class="border border-t-0 rounded-b-lg p-4 text-center" style="border-color: #c9a84c55;">
					<p class="font-medium">Sahih al-Bukhari</p>
					<p class="text-sm opacity-70">صحيح البخاري</p>
				</div>
			</div>
			<div class="relative">
				<svg viewBox="0 0 800 120" class="w-full" preserveAspectRatio="none" style="height: 35px;">
					<path d="M0,120 L0,90 C0,90 50,90 120,70 C200,47 250,20 350,8 C380,4 390,1 400,0 C410,1 420,4 450,8 C550,20 600,47 680,70 C750,90 800,90 800,90 L800,120 Z"
						fill="none" stroke="#c9a84c" stroke-width="3"/>
				</svg>
				<div class="border border-t-0 rounded-b-lg p-4 text-center" style="border-color: #c9a84c55;">
					<p class="font-medium">Sahih Muslim</p>
					<p class="text-sm opacity-70">صحيح مسلم</p>
				</div>
			</div>
			<div class="relative">
				<svg viewBox="0 0 800 120" class="w-full" preserveAspectRatio="none" style="height: 35px;">
					<path d="M0,120 L0,90 C0,90 50,90 120,70 C200,47 250,20 350,8 C380,4 390,1 400,0 C410,1 420,4 450,8 C550,20 600,47 680,70 C750,90 800,90 800,90 L800,120 Z"
						fill="none" stroke="#c9a84c" stroke-width="3"/>
				</svg>
				<div class="border border-t-0 rounded-b-lg p-4 text-center" style="border-color: #c9a84c55;">
					<p class="font-medium">Sunan an-Nasa'i</p>
					<p class="text-sm opacity-70">سنن النسائي</p>
				</div>
			</div>
		</div>
	</section>
</div>
