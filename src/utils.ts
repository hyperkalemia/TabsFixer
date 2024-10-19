import { type Config, type ConfigKeys, configValidate } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debug(...arg: any) {
	console.log('[DEBUG]', ...arg);
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

export async function getLocalValue<K extends ConfigKeys>(key: K): Promise<Config[K] | null> {
	return await chrome.storage.local.get(key).then((res) => (configValidate(key, res[key]) ? res[key] : null));
}
export async function setLocalValue<K extends ConfigKeys>(key: K, value: Config[K]) {
	return await chrome.storage.local.set({ [key]: value });
}
