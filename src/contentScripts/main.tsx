import { createRoot } from 'react-dom/client';
import { getCurrentUrl } from '../utils.ts';
import App from './components/App.tsx';
import './style.css';

const { currentParamVal } = getCurrentUrl();
let classname = currentParamVal.startsWith('tbm') ? '.nfdoRb' : '.crJ18e';
let targetElement = document.querySelector(classname);
if (!targetElement) {
	classname = currentParamVal.startsWith('tbm') ? '.nGmbUc' : '.ZaDUCc';
	targetElement = document.querySelector(classname);
}
if (targetElement) createRoot(targetElement).render(<App />);
