import { ctx, canvas } from './scripts/services/canvas.service.js';
import { keys, jumpState, captureKeyboardEvents } from './scripts/services/keyboard.service.js';
import {
	init,
	drawBackground,
	potato,
	startingSurface,
	lavaSurfaces,
	generateLavaSurfaces,
} from './scripts/services/game.service.js';
import { FLOWERS_HEIGHT } from './scripts/constants/constants.js';

// Draw the roots (Thorns)

let scrollOffset = 0;
let animationId;

function animate() {
	animationId = requestAnimationFrame(animate);
	ctx.fillStyle = 'rgba(255,255,255,0.1)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawBackground();
	potato.update();
	startingSurface.update();
	// If player collides with starting surface from above, stop falling
	if (
		potato.y + potato.height <= startingSurface.y &&
		potato.y + potato.height + potato.velocity.y >= startingSurface.y &&
		potato.x + potato.width >= startingSurface.x &&
		potato.x <= startingSurface.x + startingSurface.width
	) {
		jumpState.isOnGround = true;
		jumpState.isJumping = false;
		jumpState.isDoubleJumping = false;
		potato.velocity.y = 0;
	}
	// If player collides with lava surfaces from above, stop falling
	lavaSurfaces.forEach(lavaSurface => {
		lavaSurface.update();
		if (
			potato.y + potato.height <= lavaSurface.y &&
			potato.y + potato.height + potato.velocity.y >= lavaSurface.y &&
			potato.x + potato.width >= lavaSurface.x &&
			potato.x <= lavaSurface.x + lavaSurface.width
		) {
			jumpState.isOnGround = true;
			jumpState.isJumping = false;
			jumpState.isDoubleJumping = false;
			potato.velocity.y = 0;
		}
	});

	// Limit the player movement to certain boundaries, and then start moving everything else instead
	if (keys.right.pressed && potato.x < 400) {
		potato.velocity.x = 5;
	} else if (keys.left.pressed && potato.x > 100) {
		potato.velocity.x = -5;
	} else {
		if (keys.right.pressed) {
			scrollOffset += 5;
			startingSurface.x -= 5;
		} else if (keys.left.pressed) {
			scrollOffset -= 5;
			startingSurface.x += 5;
		}
		lavaSurfaces.forEach(lavaSurface => {
			if (keys.right.pressed) {
				lavaSurface.x -= 5;
			} else if (keys.left.pressed) {
				lavaSurface.x += 5;
			}
		});
		potato.velocity.x = 0;
	}

	if (scrollOffset >= 2000) {
		console.log('You Win');
	}
}

export function start() {
	document.getElementById('home').style.display = 'none';
	document.getElementById('canvas').style.display = 'block';
	init();
	requestAnimationFrame(animate);
	generateLavaSurfaces();
	captureKeyboardEvents();
}

document.querySelector('.button.start-now').addEventListener('click', start);
