import { DndContext, type DragOverEvent } from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import {
	type RequestMessageType,
	type TabClassesType,
	defaultTabsOrder,
	getLocalValue,
	isTabClassesType,
	isTabClassesTypeArray,
	setLocalValue,
} from '../../utils';
import '../style.css';
import TabBox from './TabBox';

function App() {
	const [tabsOrder, setTabsOrder] = useState(defaultTabsOrder);

	useEffect(() => {
		(async () => {
			const localValue: unknown = await getLocalValue('TabsArray');
			const initialValue = isTabClassesTypeArray(localValue) ? localValue : defaultTabsOrder;
			setTabsOrder(initialValue);
		})();
	}, []);

	useEffect(() => {
		(async () => {
			await setLocalValue('TabsArray', tabsOrder);
		})();
	}, [tabsOrder]);

	let isActive: boolean = true;
	const generateTabBox = (order: TabClassesType[]) => {
		return order.map((className) => {
			if (className === 'separator') {
				isActive = false;
			}
			return <TabBox key={className} name={className} isActive={isActive} />;
		});
	};

	const reorderArray = (array: TabClassesType[], active: TabClassesType, over: TabClassesType) => {
		const activeIndex = array.indexOf(active);
		const overIndex = array.indexOf(over);
		const newArray: TabClassesType[] = [...array];
		newArray.splice(activeIndex, 1);
		newArray.splice(overIndex, 0, active);
		return newArray;
	};

	const sendMessage = async (value: TabClassesType[]) => {
		await chrome.runtime.sendMessage<RequestMessageType>({
			target: 'background',
			key: 'TabsArray',
			value: value,
		});
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { over, active } = event;
		if (over && active && over.id !== active.id) {
			if (!isTabClassesType(active.id) || !isTabClassesType(over.id)) return;
			const active_id = active.id as TabClassesType;
			const over_id = over.id as TabClassesType;
			setTabsOrder((prevOrder: TabClassesType[]) => reorderArray(prevOrder, active_id, over_id));
		}
	};

	const handleDragEnd = async () => {
		const localValue = await getLocalValue('TabsArray');
		if (isTabClassesTypeArray(localValue)) await sendMessage(localValue);
	};

	const resetButtonCallback = async () => {
		setTabsOrder(defaultTabsOrder);
		await sendMessage(defaultTabsOrder);
	};

	return (
		<>
			<div className='title'>【 TabsFixer 】</div>
			<DndContext onDragOver={handleDragOver} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
				<div className='tabs-box'>
					<SortableContext items={tabsOrder}>{generateTabBox(tabsOrder)}</SortableContext>
				</div>
			</DndContext>
			<button type='button' onClick={resetButtonCallback} className='reset'>
				リセット
			</button>
		</>
	);
}

export default App;
