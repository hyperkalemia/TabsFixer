import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import { type TabClassesType, tabsData } from '../../utils';
import '../style.css';

type TabBoxProps = {
	name: TabClassesType;
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

	const label = !isSeparator ? tabsData[name]?.label : '- 非表示のタブ -';
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
