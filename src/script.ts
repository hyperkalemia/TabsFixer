function generateElem(url: string, currentParamVal: string) {
    const tabs = [
        { name: 'すべて', val: "udm=1" },
        { name: 'ウェブ', val: "udm=14" },
        { name: '画像', val: "udm=2" },
        { name: '動画', val: "tbm=vid" }
    ];

    const newElement = document.createElement('div');
    newElement.className = 'navbar';

    tabs.forEach(tabData => {
        const tab = document.createElement('a');
        tab.textContent = tabData.name;
        tab.href = url + "&" + tabData.val
        tab.className = 'tab';
        if (tabData.val == currentParamVal) {
            tab.classList.add('active');
        }
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = url + "&" + tabData.val;
        });
        newElement.appendChild(tab);
    });

    newElement.style.display = 'flex';
    newElement.style.borderBottom = '1px solid #ddd';
    newElement.style.backgroundColor = '#1f1f1f';

    Array.from(newElement.getElementsByClassName('tab')).forEach(tab => {
        if (tab instanceof HTMLElement) {
            tab.style.padding = '10px 20px';
            tab.style.textDecoration = 'none';
            tab.style.color = '#9aa0a6';
            if (tab.classList.contains("active")) {
                tab.style.color = "#1a73e8"
                tab.style.borderBottom = "3px solid #1a73e8"
            }
            tab.style.fontSize = '14px';
            tab.style.fontWeight = 'bold';
            tab.style.cursor = 'pointer';
            tab.addEventListener('mouseenter', () => {
                if (!tab.classList.contains("active")) {
                    tab.style.color = "#e8e8e8"
                    tab.style.borderBottom = '3px solid #e8e8e8';
                }
            });
            tab.addEventListener('mouseleave', () => {
                tab.style.color = '#555';
                if (tab.classList.contains("active")) {
                    tab.style.color = "#1a73e8"
                } else {
                    tab.style.borderBottom = 'none';
                }
            });
        }
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
    let classname = (currentParamVal == "tbm=vid") ? ".sSeWs" : ".qogDvd" ;
    const targetElem = await searchForElement(classname, 800, 3);
    if (targetElem != null) {
        const firstChild = targetElem.firstElementChild;
        if (firstChild) {
            targetElem.removeChild(firstChild);
        }

        const newElem = generateElem(currentUrl, currentParamVal);
        targetElem.prepend(newElem);
    }
}
(async () => { await googleModifier(); })();