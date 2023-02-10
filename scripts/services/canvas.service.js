// Get Canvas and create Context
export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

function modifyCanvasDimensions() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
}

modifyCanvasDimensions();

export function fitCanvasToWindow() {
	addEventListener('resize', modifyCanvasDimensions);
}

export function removeResizeListener() {
	removeEventListener('resize', modifyCanvasDimensions);
}
