
const RequestKeys = [
    "TabsArray"
] as const;
type RequestKeysType = typeof RequestKeys[number];
function isRequestKeysType(item: any): item is RequestKeysType {
    return RequestKeys.indexOf(item as RequestKeysType) !== -1
}

type RequestMessageType = {
    target: "background" | "contentScript",
    key: RequestKeysType,
    value: any
}
function isRequestMessageType(item: any): item is RequestMessageType {
    return !!(item as RequestMessageType)?.target && ["background", "contentScript"].indexOf(item.target) !== -1 &&
           !!(item as RequestMessageType)?.key && isRequestKeysType(item.key) &&
           !!(item as RequestMessageType)?.value
}

const TabClasses = [
    "tab-all",
    "tab-web",
    "tab-picture",
    "tab-video",
    "tab-shopping",
    "tab-news",
    "tab-book",
    "tab-map",
    "tab-flight",
    "tab-finance",
    "tab-bar"
] as const;
type TabClassesType = typeof TabClasses[number];
function isTabClassesType(item: any): item is TabClassesType {
    return TabClasses.indexOf(item as TabClassesType) !== -1
}
function isTabClassesTypeArray(item: any): item is TabClassesType[]  {
    return Array.isArray(item) && item.every(item => isTabClassesType(item));
}

const defaultTabsOrder: TabClassesType[] = [
    "tab-all",
    "tab-web",
    "tab-picture",
    "tab-video",
    "tab-bar",
    "tab-shopping",
    "tab-news",
    "tab-book",
    "tab-map",
    "tab-flight",
    "tab-finance",
] as const;

const TabLabels = [
    "すべて",
    "ウェブ",
    "画像",
    "動画",
    "ショッピング",
    "ニュース",
    "書籍",
    "地図",
    "フライト",
    "金融"
] as const; 
type TabLabelsType = typeof TabLabels[number];

type TabDataType = {
    [key in TabClassesType]?: {
        label: TabLabelsType,
        val: string | null
    }
}

const tabsData: TabDataType = {
    "tab-all": { label: "すべて", val: "search" },
    "tab-web": { label: "ウェブ", val: "udm=14" },
    "tab-picture": { label: "画像", val: "udm=2" },
    "tab-video": { label: "動画", val: "tbm=vid" },
    "tab-shopping": { label: "ショッピング", val: "tbm=shop" },
    "tab-news": { label: "ニュース", val: "tbm=nws" },
    "tab-book": { label: "書籍", val: "tbm=bks" },
    "tab-map": { label: "地図", val: "maps" },
    "tab-flight": { label: "フライト", val: "travel/flights" },
    "tab-finance": { label: "金融", val: null },
}

function debug(...arg: any) {
    console.log("[DEBUG]", ...arg);
}

async function searchForElement(name: string, intervalMs: number = 1000, maxAttempts: number = 3): Promise<HTMLElement | null> {
    let attempts = 0;
    while (attempts < maxAttempts || maxAttempts === undefined) {
        const element = document.querySelector(name);
        if (element !== null) { return element as HTMLElement; }
        attempts++;
        await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
    return null
}

async function getLocalValue(key: RequestKeysType): Promise<any> {
    return await chrome.storage.local.get(key).then(res => res[key])
}

async function setLocalValue(key: RequestKeysType, value: any) : Promise<void> {
    await chrome.storage.local.set({ [key]: value })
}
