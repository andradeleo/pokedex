export function delay(ms: number = 2000) {
	return new Promise((res) => {
		setTimeout(res, ms);
	});
}
