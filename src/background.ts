importScripts('utils.js')

chrome.runtime.onMessage.addListener((request: RequestMessageType, sender) => {
    if (sender.id != chrome.runtime.id || request.target != "background") return;
    if (isRequestKeysType(request.key)) {
        request.target = "contentScript";
        chrome.tabs.query({ url: ["https://www.google.com/*", "https://www.google.co.jp/*"] }, (tabs) => {
            tabs.forEach((tab) => {
                const id = tab.id!;
                (async () => { await chrome.tabs.sendMessage<RequestMessageType>(id, request); })();
            })
        });
    }
});
