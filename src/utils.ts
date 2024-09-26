/* eslint @typescript-eslint/no-explicit-any: off */

export const RequestKeys = ['TabsArray'] as const;
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

export const TabClasses = [
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
	'tab-bar',
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
	'tab-bar',
	'tab-shopping',
	'tab-news',
	'tab-book',
	'tab-map',
	'tab-flight',
	'tab-finance',
] as const;

export const TabLabels = ['すべて', 'ウェブ', '画像', '動画', 'ショッピング', 'ニュース', '書籍', '地図', 'フライト', '金融'] as const;
export type TabLabelsType = (typeof TabLabels)[number];

export type TabDataType = {
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
		val: null,
	},
};

export function debug(...arg: any) {
	console.log('[DEBUG]', ...arg);
}

export async function searchForElement(name: string, intervalMs: number = 1000, maxAttempts: number = 3): Promise<HTMLElement | null> {
	let attempts = 0;
	while (attempts < maxAttempts || maxAttempts === undefined) {
		const element = document.querySelector(name);
		if (element !== null) return element as HTMLElement;

		attempts++;
		await new Promise((resolve) => setTimeout(resolve, intervalMs));
	}
	return null;
}

export async function getLocalValue(key: RequestKeysType): Promise<any> {
	return await chrome.storage.local.get(key).then((res) => res[key]);
}

export async function setLocalValue(key: RequestKeysType, value: any): Promise<void> {
	await chrome.storage.local.set({
		[key]: value,
	});
}
