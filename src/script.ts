function getLuminance(r: number, g: number, b: number): number {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isDarkMode(backgroundColor: string): boolean {
    const rgb = backgroundColor.match(/\d+/g)!.map(Number);
    const luminance = getLuminance(rgb[0], rgb[1], rgb[2]);
    return luminance < 128;
}

async function generateElem(url: string, currentParamVal: string): Promise<HTMLElement> {
    const tabs = [
        { name: 'すべて', val: "udm=1" },
        { name: 'ウェブ', val: "udm=14" },
        { name: '画像', val: "udm=2" },
        { name: '動画', val: "tbm=vid" },
        { name: 'ショッピング', val: "tbm=shop"},
        { name: 'ニュース', val: "tbm=nws"},
        { name: '書籍', val: "tbm=bks"},
        { name: '地図', val: "maps"},
        { name: 'フライト', val: "travel/flights"},
        { name: '金融', val: null},
    ];

    const bodyElement = await searchForElement("body") as HTMLElement;
    const backgroundColor = window.getComputedStyle(bodyElement).backgroundColor;
    
    const newElement = document.createElement('div');
    newElement.className = 'tabsfixer-container';
    if (isDarkMode(backgroundColor)) {
        newElement.classList.add("darkmode")
    }

    tabs.forEach(tabData => {
        const tab = document.createElement('a');
        tab.className = 'tab';
        tab.textContent = tabData.name;

        let href = url + "&" + tabData.val;
        if (tabData.val && !tabData.val?.includes("=")) {
            href = url.replace("search", tabData.val);
        }
        tab.href = href;
        if (tabData.val == currentParamVal) {
            tab.classList.add('active');
        }
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = href;
        });
        newElement.appendChild(tab);
    });
    return newElement;
}

function getCurrentUrl() {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    const qValue = searchParams.get('q');
    const newUrl = new URL(currentUrl.origin + currentUrl.pathname);
    if (qValue !== null) {
        newUrl.searchParams.append('q', qValue);
    }
    let currentParamVal = "udm=1";
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

async function googleModifier() {
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
(async () => { await googleModifier(); })();