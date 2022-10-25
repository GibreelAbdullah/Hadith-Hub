<script lang=ts>
	import Topbar from '../../../common/topbarOld.svelte';
	import BookLogo from '../../../common/bookLogo.svelte';
	import { page } from '$app/stores';
	import HadithContainer from '../../../components/hadithContainer.svelte';
	// import LeftSidePanelScaffold from '../../../common/leftSidePanelScaffold.svelte';
	// import {obj} from '../../../common/constants.svelte';

	const urlArabic =
		'https://cdn.jsdelivr.net/gh/GibreelAbdullah/hadith-api@2/editions/ara-'+
		$page.params['book'] +
		'/sections/' +
		$page.params['hadithId'] + 
		'.min.json';
	const urlEnglish =
		'https://cdn.jsdelivr.net/gh/GibreelAbdullah/hadith-api@2/editions/eng-' +
		$page.params['book'] +
		'/sections/' +
		$page.params['hadithId'] + 
		'.min.json';
	let arabicPromise = getData(urlArabic);
	let englishPromise = getData(urlEnglish);
	// let englishPromise = new Promise((resolve)=>{
	// 	const timer = setTimeout(() => {
    //         resolve(obj);
    //     }, 2000);
	// });

	async function getData(url:string) {
		console.log(url);
		return await fetch(url).then((response) => response.json());
		// return Promise.resolve(obj);
	}
</script>
<Topbar />
<!-- <BookLogo bookName={$page.params['book']}/> -->
<!-- <LeftSidePanelScaffold /> -->


<main>
		{#await Promise.all([englishPromise,arabicPromise])}
			<HadithContainer allHadiths = {["Loading..."]} />
		{:then data}
			<HadithContainer allHadiths = {data} />
		{:catch data}
			Error...
		{/await}

</main>
