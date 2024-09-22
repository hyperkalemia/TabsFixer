function getLuminance(r: number, g: number, b: number): number {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isDarkMode(backgroundColor: string): boolean {
    const rgb = backgroundColor.match(/\d+/g)!.map(Number);
    const luminance = getLuminance(rgb[0], rgb[1], rgb[2]);
    return luminance < 128;
}

function getCurrentUrl() {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    const qValue = searchParams.get('q');
    const newUrl = new URL(currentUrl.origin + currentUrl.pathname);
    if (qValue !== null) {
        newUrl.searchParams.append('q', qValue);
    }
    let currentParamVal = "search";
    const udmValue = searchParams.get("udm");
    if (udmValue !== null) {
        currentParamVal = "udm=" + udmValue;
    } else {
        const tbmValue = searchParams.get("tbm");
        if (tbmValue !== null) {
            currentParamVal = "tbm=" + tbmValue;
        }
    }
    const cleanUrl = newUrl.href;

    return [cleanUrl, currentParamVal];
}

async function generateElem(url: string, currentParamVal: string): Promise<HTMLElement> {

    const bodyElement = await searchForElement("body") as HTMLElement;
    const backgroundColor = window.getComputedStyle(bodyElement).backgroundColor;
    
    const newElement = document.createElement('div');
    newElement.className = 'tabsfixer-container';
    if (isDarkMode(backgroundColor)) {
        newElement.classList.add("darkmode")
    }

    let tabsOrder = await getLocalValue("TabsArray");
    if (tabsOrder === undefined || !isTabClassesTypeArray(tabsOrder)) { tabsOrder = defaultTabsOrder; }

    let skip = false;
    (tabsOrder as TabClassesType[]).forEach(tabClass => {
        if (tabClass === "tab-bar") { skip = true; }
        if (skip || !tabsData[tabClass]) { return; }

        const tab = document.createElement('a');
        tab.className = 'tab';
        if (tabsData[tabClass].val == currentParamVal) {
            tab.classList.add('active');
        }
        let href = url + "&" + tabsData[tabClass].val;
        if (tabsData[tabClass].val && !tabsData[tabClass].val.includes("=")) {
            href = url.replace("search", tabsData[tabClass].val);
        }
        tab.textContent = tabsData[tabClass]?.label;
        tab.href = href;

        tab.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = href;
        });
        newElement.appendChild(tab);
    });
    return newElement;
}

async function main() {
    const [currentUrl, currentParamVal] = getCurrentUrl();
    let classname = currentParamVal.startsWith("tbm") ? ".sSeWs" : ".qogDvd" ;
    const targetElem = await searchForElement(classname, 800, 3);
    if (targetElem != null) {
        const firstChild = targetElem.firstElementChild;
        if (firstChild) {
            targetElem.removeChild(firstChild);
        }

        const newElem = await generateElem(currentUrl, currentParamVal);
        targetElem.prepend(newElem);
    }
}

if (document.readyState !== "loading") {
    (async () => { await main() })();
} else {
    document.addEventListener("DOMContentLoaded", main);
}

chrome.runtime.onMessage.addListener((request: RequestMessageType, sender) => {
    if (sender.id != chrome.runtime.id || request.target != "contentScript") return;
    if (isRequestKeysType(request.key)) {
        if (request.key == "TabsArray") {
            (async () => { await main() })();
        }
    }
});
