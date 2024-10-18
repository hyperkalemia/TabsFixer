import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import { type TabClasses, tabsData } from '../../types';

type TabBoxProps = {
	name: TabClasses;
	isActive: boolean;
};

const TabBox = ({ name, isActive }: TabBoxProps) => {
	const isSeparator: boolean = name === 'separator';

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: name,
		disabled: isSeparator,
	});
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const label = name !== 'separator' ? tabsData[name]?.label : '- 非表示のタブ -';
	const classes = classNames('tab', {
		separator: isSeparator,
		onGrab: isDragging,
		inactive: !isActive,
	});

	return (
		<div className={classes} ref={setNodeRef} style={style} {...listeners} {...attributes}>
			{label}
		</div>
	);
};

export default TabBox;
