import { createRoot } from 'react-dom/client';
import { getCurrentUrl } from '../utils.ts';
import App from './components/App.tsx';

const { currentParamVal } = getCurrentUrl();
const classname = currentParamVal.startsWith('tbm') ? '.nfdoRb' : '.crJ18e';
const targetElement = document.querySelector(classname);
if (targetElement) createRoot(targetElement).render(<App />);
