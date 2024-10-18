import { DndContext, type DragOverEvent } from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { defaultTabsOrder, type RequestMessage, type TabClasses, TabClassesArraySchema, TabClassesSchema, zodValidate } from '../../types';
import { getLocalValue, setLocalValue } from '../../utils';
import TabBox from './TabBox';

function App() {
	const [tabsOrder, setTabsOrder] = useState(defaultTabsOrder);

	useEffect(() => {
		(async () => {
			const localValue: unknown = await getLocalValue('TabsArray');
			const initialValue = zodValidate(TabClassesArraySchema, localValue) ? localValue : defaultTabsOrder;
			setTabsOrder(initialValue);
		})();
	}, []);

	useEffect(() => {
		(async () => {
			await setLocalValue('TabsArray', tabsOrder);
		})();
	}, [tabsOrder]);

	let isActive: boolean = true;
	const generateTabBox = (order: TabClasses[]) => {
		return order.map((className) => {
			if (className === 'separator') {
				isActive = false;
			}
			return <TabBox key={className} name={className} isActive={isActive} />;
		});
	};

	const reorderArray = (array: TabClasses[], active: TabClasses, over: TabClasses) => {
		const activeIndex = array.indexOf(active);
		const overIndex = array.indexOf(over);
		const newArray: TabClasses[] = [...array];
		newArray.splice(activeIndex, 1);
		newArray.splice(overIndex, 0, active);
		return newArray;
	};

	const sendMessage = async (value: TabClasses[]) => {
		await chrome.runtime.sendMessage<RequestMessage>({
			target: 'background',
			content: {
				TabsArray: value,
			},
		});
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { over, active } = event;
		if (over && active && over.id !== active.id) {
			if (!zodValidate(TabClassesSchema, active.id) || !zodValidate(TabClassesSchema, over.id)) return;
			const active_id = active.id as TabClasses;
			const over_id = over.id as TabClasses;
			setTabsOrder((prevOrder: TabClasses[]) => reorderArray(prevOrder, active_id, over_id));
		}
	};

	const handleDragEnd = async () => {
		const localValue: unknown = await getLocalValue('TabsArray');
		if (zodValidate(TabClassesArraySchema, localValue)) await sendMessage(localValue);
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
