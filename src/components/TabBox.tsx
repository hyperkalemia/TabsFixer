// import { useState } from 'react';
import classNames from 'classnames';
import type { FC } from 'react';
import type { TabClassesType } from '../utils';
import { tabsData } from '../utils';

type TabBoxProps = {
	name: TabClassesType;
	isActive: boolean;
};

const TabBox: FC<TabBoxProps> = (props) => {
	// const [isActive, setIsActive] = useState(props.isActive);
	// const toggleActive = (prevState: boolean) => setIsActive(!prevState);
	const label = props.name !== 'tab-bar' ? tabsData[props.name]?.label : '- 非表示のタブ -';
	const classes = classNames('tab', {
		onGrab: false,
		inactive: !props.isActive,
	});

	return <div className={classes}> {label} </div>;
};

export default TabBox;
