import { ctx, canvas, fitCanvasToWindow } from './scripts/services/canvas.service.js';
import { keys, captureKeyboardEvents } from './scripts/services/keyboard.service.js';
import {
	init,
	drawBackground,
	potato,
	startingSurface,
	lavaSurfaces,
	generateLavaSurfaces,
	game,
} from './scripts/services/game.service.js';

// Draw the roots (Thorns)

const scoreEl = document.querySelector('.score');

function isCollided(potato, surface) {
	return potato.y + potato.height <= surface.y &&
		potato.y + potato.height + potato.velocity.y >= surface.y &&
		potato.x + potato.width >= surface.x &&
		potato.x <= surface.x + surface.width
}

function animate() {
	game.animationId = requestAnimationFrame(animate);
	ctx.fillStyle = 'rgba(255,255,255,0.1)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawBackground();
	startingSurface.update();
	// If player collides with starting surface from above, stop falling
	if (isCollided(potato, startingSurface)) {
		potato.land();
	}
	// If player collides with lava surfaces from above, stop falling
	lavaSurfaces.forEach(lavaSurface => {
		lavaSurface.update();
		if (isCollided(potato, lavaSurface)) {
			potato.land();
		}
	});

	// Limit the player movement to certain boundaries, and then start moving everything else instead
	if (keys.right.pressed && potato.x < 400) {
		potato.velocity.x = 5;
	} else if (keys.left.pressed && potato.x > 100) {
		potato.velocity.x = -5;
	} else {
		if (keys.right.pressed) {
			game.scrollOffset += 5;
			startingSurface.x -= 5;
		} else if (keys.left.pressed) {
			game.scrollOffset -= 5;
			startingSurface.x += 5;
		}
		scoreEl.innerText = game.scrollOffset;
		lavaSurfaces.forEach(lavaSurface => {
			if (keys.right.pressed) {
				lavaSurface.x -= 5;
			} else if (keys.left.pressed) {
				lavaSurface.x += 5;
			}
		});
		potato.velocity.x = 0;
	}

	// If player collides with the ceiling, reset his vertical speed
	if (potato.y + potato.velocity.y <= 0) {
		potato.velocity.y = 0;
	}

	potato.update();
}

export function start() {
	document.querySelector('.game-over-modal').style.display = 'none';
	document.getElementById('home').style.display = 'none';
	document.querySelector('.score-container').style.display = 'block';
	init();
	requestAnimationFrame(animate);
	generateLavaSurfaces();
	captureKeyboardEvents();
	fitCanvasToWindow();
	removeEventListener('keyup', startOnSpace);
	game.scrollOffset = 0;
	scoreEl.innerText = game.scrollOffset;
}

document.querySelector('.button.start-now').addEventListener('click', start);

document.querySelector('button.play-again').addEventListener('click', start);

addEventListener('keyup', startOnSpace);

function startOnSpace({ key }) {
	if (key === ' ') {
		start();
	}
}
