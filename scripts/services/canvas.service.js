import { ElementsService } from './elements.service.js';

// Get Canvas and create Context
export const canvas = ElementsService.getInstance().getElement('#canvas');
export const ctx = canvas.getContext('2d');

export function modifyCanvasDimensions() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
}

export function fitCanvasToWindow() {
	addEventListener('resize', modifyCanvasDimensions);
}

export function removeResizeListener() {
	removeEventListener('resize', modifyCanvasDimensions);
}
