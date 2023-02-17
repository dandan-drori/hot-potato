import { start } from '../../index.js';
import { potato } from './game.service.js';

export const keys = {
	left: {
		pressed: false,
	},
	right: {
		pressed: false,
	},
};

function onKeyDown({ key }) {
	switch (key) {
		case 'ArrowLeft':
			keys.left.pressed = true;
			break;
		case 'ArrowRight':
			keys.right.pressed = true;
			break;
		case ' ':
			potato.jump();
			break;
	}
}

function onKeyUp({ key }) {
	switch (key) {
		case 'ArrowLeft':
			keys.left.pressed = false;
			break;
		case 'ArrowRight':
			keys.right.pressed = false;
			break;
	}
}

export function captureKeyboardEvents() {
	addEventListener('keydown', onKeyDown);
	addEventListener('keyup', onKeyUp);
}

export function clearEventListeners() {
	removeEventListener('keydown', onKeyDown);
	removeEventListener('keyup', onKeyUp);
}

export function resetGame() {
	start();
	removeEventListener('keyup', startOnPress);
}

export function startOnPress({ key }) {
	if (key === ' ') {
		resetGame();
	}
}

export function addSpacePressListener() {
	addEventListener('keyup', startOnPress);
}
