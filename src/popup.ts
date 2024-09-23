import TabsBoxHandler from './TabsBoxHandler.js';
import { searchForElement, RequestKeys, getLocalValue, defaultTabsOrder, isTabClassesTypeArray } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
	//initialize
	const tabsBoxHandler = new TabsBoxHandler();
	RequestKeys.forEach(async (key) => {
		const localValue: unknown = await getLocalValue(key);
		if (key === 'TabsArray') {
			const tabsOrder = isTabClassesTypeArray(localValue) ? localValue : defaultTabsOrder;
			tabsBoxHandler.util.sortByOrder(tabsOrder, false);
		}
	});

	const resetButton = await searchForElement('.reset');
	resetButton!.addEventListener('click', () => {
		tabsBoxHandler.util.sortByOrder(defaultTabsOrder);
	});
});
