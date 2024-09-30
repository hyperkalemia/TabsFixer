/* eslint @typescript-eslint/no-explicit-any: off */

const RequestKeys = ['TabsArray'] as const;
export type RequestKeysType = (typeof RequestKeys)[number];
export function isRequestKeysType(item: any): item is RequestKeysType {
	return RequestKeys.indexOf(item as RequestKeysType) !== -1;
}

export type RequestMessageType = {
	target: 'background' | 'contentScript';
	key: RequestKeysType;
	value: any;
};
export function isRequestMessageType(item: any): item is RequestMessageType {
	return (
		!!(item as RequestMessageType)?.target &&
		['background', 'contentScript'].indexOf(item.target) !== -1 &&
		!!(item as RequestMessageType)?.key &&
		isRequestKeysType(item.key) &&
		!!(item as RequestMessageType)?.value
	);
}

const TabClasses = [
	'tab-all',
	'tab-web',
	'tab-picture',
	'tab-video',
	'tab-shopping',
	'tab-news',
	'tab-book',
	'tab-map',
	'tab-flight',
	'tab-finance',
	'separator',
] as const;
export type TabClassesType = (typeof TabClasses)[number];
export function isTabClassesType(item: any): item is TabClassesType {
	return TabClasses.indexOf(item as TabClassesType) !== -1;
}
export function isTabClassesTypeArray(item: any): item is TabClassesType[] {
	return Array.isArray(item) && item.every((item) => isTabClassesType(item));
}

export const defaultTabsOrder: TabClassesType[] = [
	'tab-all',
	'tab-web',
	'tab-picture',
	'tab-video',
	'separator',
	'tab-shopping',
	'tab-news',
	'tab-book',
	'tab-map',
	'tab-flight',
	'tab-finance',
] as const;

const TabLabels = ['すべて', 'ウェブ', '画像', '動画', 'ショッピング', 'ニュース', '書籍', '地図', 'フライト', '金融'] as const;
export type TabLabelsType = (typeof TabLabels)[number];
export function isTabLabels(item: any): item is TabLabelsType {
	return TabLabels.indexOf(item as TabLabelsType) !== -1;
}

type TabDataType = {
	[key in TabClassesType]?: {
		label: TabLabelsType;
		val: string | null;
	};
};

export const tabsData: TabDataType = {
	'tab-all': {
		label: 'すべて',
		val: 'search',
	},
	'tab-web': {
		label: 'ウェブ',
		val: 'udm=14',
	},
	'tab-picture': {
		label: '画像',
		val: 'udm=2',
	},
	'tab-video': {
		label: '動画',
		val: 'tbm=vid',
	},
	'tab-shopping': {
		label: 'ショッピング',
		val: 'tbm=shop',
	},
	'tab-news': {
		label: 'ニュース',
		val: 'tbm=nws',
	},
	'tab-book': {
		label: '書籍',
		val: 'tbm=bks',
	},
	'tab-map': {
		label: '地図',
		val: 'maps',
	},
	'tab-flight': {
		label: 'フライト',
		val: 'travel/flights',
	},
	'tab-finance': {
		label: '金融',
		val: 'finance',
	},
};

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

export async function getLocalValue(key: RequestKeysType) {
	return await chrome.storage.local.get(key).then((res) => res[key]);
}
export async function setLocalValue(key: RequestKeysType, value: any) {
	return await chrome.storage.local.set({ [key]: value });
}
