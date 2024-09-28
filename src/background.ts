import type { RequestMessageType } from './utils.js';
import { isRequestMessageType } from './utils.js';

chrome.runtime.onMessage.addListener((request: unknown, sender) => {
	if (sender.id !== chrome.runtime.id || !isRequestMessageType(request) || request.target !== 'background') return;

	request.target = 'contentScript';
	chrome.tabs.query(
		{
			url: ['https://www.google.com/*', 'https://www.google.co.jp/*'],
		},
		(tabs) => {
			tabs.forEach(async (tab) => {
				const id = tab.id!;
				await chrome.tabs.sendMessage<RequestMessageType>(id, request);
			});
		},
	);
});
