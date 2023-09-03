export function FormatarNumeroDoisAlgarismos(numero: number): string {
	let numeroFormatado;
	numeroFormatado = numero < 10 ? `0${numero}` : `${numero}`;
	return numeroFormatado;
}
