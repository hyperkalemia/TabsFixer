import '../style.css';
import { useState } from 'react';
import type { TabClassesType } from '../utils';
import { defaultTabsOrder, isTabClassesTypeArray } from '../utils';
import TabBox from './TabBox';

function App() {
	// const localValue: unknown = (async () => await getLocalValue('TabsArray'))();
	const localValue = null;
	const tabsOrder_: TabClassesType[] = isTabClassesTypeArray(localValue) ? localValue : defaultTabsOrder;
	const [tabsOrder, setTabsOrder] = useState(tabsOrder_);

	let isActive: boolean = true;
	const GenerateTabBox = (order: TabClassesType[]) => {
		return order.map((className) => {
			if (className === 'tab-bar') {
				isActive = false;
			}
			return <TabBox key={className} name={className} isActive={isActive} />;
		});
	};
	const resetButtonCallback = () => {
		setTabsOrder(defaultTabsOrder);
	};

	return (
		<>
			<div className='title'>【 TabsFixer 】</div>
			<div className='tabs-box'>{GenerateTabBox(tabsOrder)}</div>
			<button type='button' onClick={resetButtonCallback} className='reset'>
				リセット
			</button>
		</>
	);
}

export default App;
