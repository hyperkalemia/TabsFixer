function debug(...arg: any) {
    console.log("[DEBUG]", ...arg);
}

async function searchForElement(name: string, intervalMs: number = 1000, maxAttempts: number = 3) {
    let attempts = 0;
    while (attempts < maxAttempts || maxAttempts === undefined) {
        const element = document.querySelector(name);
        if (element !== null) {
            // debug("要素", className, "が見つかりました:", element);
            return element;
        }
        attempts++;
        await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
    // debug("要素が見つかりませんでした");
    return null;
}

const RequestKeys = [
    "TabsArray"
] as const;
type RequestKeysType = typeof RequestKeys[number];
function isRequestKeysType(str: string): boolean {
    return RequestKeys.indexOf(str as RequestKeysType) !== -1
}

interface RequestMessageType {
    target: "background" | "contentScript",
    key: RequestKeysType,
    value: any
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
function isTabClassesType(str: string): boolean {
    return TabClasses.indexOf(str as TabClassesType) !== -1
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
    "tab-all": { label: "すべて", val: "udm=1" },
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