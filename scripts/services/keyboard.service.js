import { potato } from './game.service.js';

export const keys = {
	left: {
		pressed: false,
	},
	right: {
		pressed: false,
	},
};

export const jumpState = {
	isOnGround: true,
	isJumping: false,
	isDoubleJumping: false,
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
			if (jumpState.isDoubleJumping) return;
			if (jumpState.isJumping) {
				jumpState.isOnGround = false;
				jumpState.isJumping = false;
				jumpState.isDoubleJumping = true;
			} else {
				jumpState.isOnGround = false;
				jumpState.isJumping = true;
				jumpState.isDoubleJumping = false;
			}
			potato.velocity.y -= 15;
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
