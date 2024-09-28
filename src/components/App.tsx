import { DndContext, type DragOverEvent } from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext } from '@dnd-kit/sortable';
import '../style.css';
import { type RequestMessageType, type TabClassesType, defaultTabsOrder, getLocalValue, isTabClassesType, useLocalStorage } from '../utils';
import TabBox from './TabBox';

function App() {
	const [tabsOrder, setTabsOrder] = useLocalStorage('TabsArray', defaultTabsOrder);

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
			setTabsOrder((prevOrder: TabClassesType[]) => reorderArray(prevOrder, active_id, over_id));
		}
	};

	const handleDragEnd = async () => {
		const localValue = await getLocalValue('TabsArray');
		await chrome.runtime.sendMessage<RequestMessageType>({
			target: 'background',
			key: 'TabsArray',
			value: localValue,
		});
	};

	return (
		<>
			<div className='title'>【 TabsFixer 】</div>
			<DndContext onDragOver={handleDragOver} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
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
