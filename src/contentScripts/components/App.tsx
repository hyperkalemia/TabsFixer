import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { RequestMessageSchema, type TabClasses, TabClassesArraySchema, defaultTabsOrder, tabsData, zodValidate } from '../../types';
import { getCurrentUrl, getLocalValue } from '../../utils';

const App = () => {
	const { cleanUrl, currentParamVal } = getCurrentUrl();
	const [tabsOrder, setTabsOrder] = useState([] as TabClasses[]);

	useEffect(() => {
		(async () => {
			const localValue: unknown = await getLocalValue('TabsArray');
			const initialValue = zodValidate(TabClassesArraySchema, localValue) ? localValue : defaultTabsOrder;
			setTabsOrder(initialValue);
		})();
		const handleMessage = (request: unknown, sender: chrome.runtime.MessageSender) => {
			if (sender.id !== chrome.runtime.id || !zodValidate(RequestMessageSchema, request) || request.target !== 'contentScripts') return;
			for (const [key, value] of Object.entries(request.content)) {
				if (key === 'TabsArray') setTabsOrder(value);
			}
		};
		chrome.runtime.onMessage.addListener(handleMessage);
		// クリーンアップ関数
		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage);
		};
	}, []);

	const getLuminance = (r: number, g: number, b: number): number => {
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	};

	const isDarkMode = (backgroundColor: string): boolean => {
		const rgb = backgroundColor.match(/\d+/g)!.map(Number);
		const luminance = getLuminance(rgb[0], rgb[1], rgb[2]);
		return luminance < 128;
	};

	const bodyElement = document.querySelector('body');
	const backgroundColor = window.getComputedStyle(bodyElement!).backgroundColor;
	const darkmode = isDarkMode(backgroundColor);
	const classes = classNames('tabsfixer-container', {
		darkmode: darkmode,
	});

	const generateElement = (order: TabClasses[], url: string, currentParamVal: string) => {
		if (order.length === 0) return <div className='tab loading'>loading...</div>;
		let skip = false;
		return order.map((tabClass) => {
			if (skip || tabClass === 'separator') {
				skip = true;
				return <></>;
			}
			let isActive = tabsData[tabClass].val === currentParamVal;
			if (tabClass === 'tab-video' && currentParamVal === 'udm=7') isActive = true;
			const classes = classNames('tab', {
				active: isActive,
			});
			let href = url + '&' + tabsData[tabClass].val;
			if (tabsData[tabClass].val && !tabsData[tabClass].val.includes('=')) {
				href = url.replace('search', tabsData[tabClass].val);
			}

			return (
				<a key={tabClass} className={classes} href={href}>
					{tabsData[tabClass]?.label}
				</a>
			);
		});
	};

	return <div className={classes}>{generateElement(tabsOrder, cleanUrl, currentParamVal)}</div>;
};

export default App;
