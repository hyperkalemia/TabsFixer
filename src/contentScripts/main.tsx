import { createRoot } from 'react-dom/client';
import { getCurrentUrl } from '../utils.ts';
import App from './components/App.tsx';

const { currentParamVal } = getCurrentUrl();
const classname = currentParamVal.startsWith('tbm') ? '.sSeWs' : '.qogDvd';
const targetElement = document.querySelector(classname);
if (targetElement) createRoot(targetElement).render(<App />);
