<script>
	// import { initDb, query } from '@sqlbro/client';
	import { onMount } from 'svelte';

	let fileContent = '';

	async function sqliteWasm() {
		import('$lib/common/sqlclient').then((sqlbro) => {
			sqlbro.initDbConfig({baseUrl: "https://raw.githubusercontent.com/GibreelAbdullah/hadith-db/master/database/", fileName: "config.json"});
			// sqlbro.initDbConfig({fileName: "config.json"});
			sqlbro
				.query(`select
      hadithnumber ,
      highlight(hadith,
      1 ,
      '<span style="color:red;">',
      '</span>') arabicnumber ,
      highlight(hadith,
      2 ,
      '<span style="color:red;">',
      '</span>') "text" ,
      grades ,
      highlight(hadith,
      4 ,
      '<span style="color:red;">',
      '</span>') bookNumber ,
      highlight(hadith,
      5 ,
      '<span style="color:red;">',
      '</span>') bookhadith ,
      highlight(hadith,
      6 ,
      '<span style="color:red;">',
      '</span>') bookname,
      language,
      shortname
  from
      hadith
  WHERE hadith
  MATCH "Allah"
  and text != ""
  and text != "empty"
  order by rank
  LIMIT 10
  `)
				.then((data) => {
					console.log(data);
					fileContent = JSON.stringify(data);
				});
		});
	}
	onMount(sqliteWasm);
</script>

<div>
	<h1>Content of the text file:</h1>
	<p>{fileContent}</p>
</div>
