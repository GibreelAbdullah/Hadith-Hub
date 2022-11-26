export const getData = async(url: string) => {
    return await fetch(url).then((response) => {
		return response.json();
    });
}
