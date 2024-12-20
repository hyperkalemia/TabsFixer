import { type Config, type ConfigKeys, configValidate } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debug(...arg: any) {
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log('[DEBUG]', ...arg);
}

export function isPermutation(arr: string[], original: string[]): boolean {
	const setOriginal = new Set(original);
	const setArr = new Set(arr);
	return (
		arr.length === setArr.size && original.length === setOriginal.size && original.length === arr.length && [...setOriginal].every((item) => setArr.has(item))
	);
}

export function getCurrentUrl() {
	const currentUrl = new URL(window.location.href);
	const searchParams = new URLSearchParams(currentUrl.search);
	const qValue = searchParams.get('q');
	const newUrl = new URL(currentUrl.origin + currentUrl.pathname);
	if (qValue !== null) newUrl.searchParams.append('q', qValue);

	let currentParamVal = 'search';
	const udmValue = searchParams.get('udm');
	if (udmValue !== null) {
		currentParamVal = 'udm=' + udmValue;
	} else {
		const tbmValue = searchParams.get('tbm');
		if (tbmValue !== null) {
			currentParamVal = 'tbm=' + tbmValue;
		}
	}
	const cleanUrl = newUrl.href;

	return { cleanUrl: cleanUrl, currentParamVal: currentParamVal };
}

export async function getLocalValue<K extends ConfigKeys>(key: K): Promise<Exclude<Config[K], undefined> | null> {
	return await chrome.storage.local.get(key).then(
		(res: {
			[key: string]: unknown;
		}) => (configValidate(key, res[key]) ? res[key] : null),
	);
}
export async function setLocalValue<K extends ConfigKeys>(key: K, value: Exclude<Config[K], undefined>) {
	return await chrome.storage.local.set({ [key]: value });
}
