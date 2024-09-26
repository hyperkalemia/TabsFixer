import '../style.css';
import type { DragOverEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext } from '@dnd-kit/sortable';
import { useState } from 'react';
import type { TabClassesType } from '../utils';
import { defaultTabsOrder, isTabClassesType, isTabClassesTypeArray } from '../utils';
import TabBox from './TabBox';

function App() {
	// const localValue: unknown = (async () => await getLocalValue('TabsArray'))();
	const localValue = null;
	const tabsOrder_: TabClassesType[] = isTabClassesTypeArray(localValue) ? localValue : defaultTabsOrder;
	const [tabsOrder, setTabsOrder] = useState(tabsOrder_);

	let isActive: boolean = true;
	const GenerateTabBox = (order: TabClassesType[]) => {
		return order.map((className) => {
			if (className === 'separator') {
				isActive = false;
			}
			return <TabBox key={className} name={className} isActive={isActive} />;
		});
	};
	const resetButtonCallback = () => {
		setTabsOrder(defaultTabsOrder);
	};

	const reorderArray = (array: TabClassesType[], active: TabClassesType, over: TabClassesType) => {
		const activeIndex = array.indexOf(active);
		const overIndex = array.indexOf(over);

		const newArray: TabClassesType[] = [...array];
		newArray.splice(activeIndex, 1);
		newArray.splice(overIndex, 0, active);

		return newArray;
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { over, active } = event;
		if (over && active && over.id !== active.id) {
			if (!isTabClassesType(active.id) || !isTabClassesType(over.id)) return;
			const active_id = active.id as TabClassesType;
			const over_id = over.id as TabClassesType;
			setTabsOrder((prevOrder) => reorderArray(prevOrder, active_id, over_id));
		}
	};

	return (
		<>
			<div className='title'>【 TabsFixer 】</div>
			<DndContext onDragOver={handleDragOver} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
				<div className='tabs-box'>
					<SortableContext items={tabsOrder}>{GenerateTabBox(tabsOrder)}</SortableContext>
				</div>
			</DndContext>
			<button type='button' onClick={resetButtonCallback} className='reset'>
				リセット
			</button>
		</>
	);
}

export default App;
