import { type RequestMessage, RequestMessageSchema, zodValidate } from './types.js';

chrome.runtime.onMessage.addListener((request: unknown, sender) => {
	if (sender.id !== chrome.runtime.id || !zodValidate(RequestMessageSchema, request) || request.target !== 'background') return;

	request.target = 'contentScripts';
	chrome.tabs.query(
		{
			url: ['https://www.google.com/*', 'https://www.google.co.jp/*'],
		},
		(tabs) => {
			tabs.forEach((tab) => {
				const id = tab.id!;
				chrome.tabs.sendMessage<RequestMessage>(id, request);
			});
		},
	);
});
