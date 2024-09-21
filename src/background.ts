importScripts('utils.js')

chrome.runtime.onMessage.addListener((request: RequestMessageType, sender) => {
    if (sender.id != chrome.runtime.id || request.target != "background") return;
    if (isRequestKeysType(request.key)) {
        request.target = "contentScript";
        chrome.tabs.query({ url: 'https://www.google.com/search?q=*' }, (tabs) => {
            tabs.forEach((tab) => {
                const id = tab.id!;
                chrome.tabs.sendMessage<RequestMessageType>(id, request);
            })
        });
    }
});
