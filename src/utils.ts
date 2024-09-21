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