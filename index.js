import { AHEAD_WINDOW, DISCARD_AFTER, INITIAL_WINDOW } from './scripts/constants/constants.js';
import { ctx, canvas, fitCanvasToWindow } from './scripts/services/canvas.service.js';
import { keys, captureKeyboardEvents, startOnSpace } from './scripts/services/keyboard.service.js';
import {
	init,
	drawBackground,
	potato,
	lavaSurfaces,
	generateLavaSurfaces,
	game,
	gameOver,
} from './scripts/services/game.service.js';
import {
	isCollided,
	isCollidedFromLeft,
	isCollidedFromRight,
	isFallingOffTheEdge,
} from './scripts/services/util.service.js';

// Draw the roots (Thorns)

const scoreEl = document.querySelector('.score');

function generateNeededPlatforms(lavaSurface) {
	const indexOfPlatform = lavaSurfaces.indexOf(lavaSurface);

	generateLavaSurfaces(Math.max(AHEAD_WINDOW - (lavaSurfaces.length - 1 - indexOfPlatform), 0));
	lavaSurfaces.splice(0, Math.max(indexOfPlatform - DISCARD_AFTER, 0));
}

function animate() {
	game.animationId = requestAnimationFrame(animate);
	ctx.fillStyle = 'rgba(255,255,255,0.1)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawBackground();
	if (!potato.initialized || !lavaSurfaces[0].initialized) return;

	// If player collides with starting surface from above, stop falling
	if (isCollided(potato, lavaSurfaces[0])) {
		potato.land();
	}
	// If player collides with lava surfaces from above, stop falling
	lavaSurfaces.forEach(lavaSurface => {
		lavaSurface.update();
		// update enemies on the platform
		lavaSurface.enemies?.forEach(enemy => {
			enemy.update();
			if (isCollided(potato, enemy)) {
				enemy.onDestroy();
				potato.jump(true);
				game.score += 1000;
			} else if (isCollidedFromLeft(potato, enemy) || isCollidedFromRight(potato, enemy)) {
				gameOver();
			}
		});
		if (isCollided(potato, lavaSurface)) {
			if (lavaSurface !== game.latestLandingSurface) {
				lavaSurface?.startBlinking();
				generateNeededPlatforms();
			}

			potato.land();
			game.latestLandingSurface = lavaSurface;
		}

		// If player is falling of the edge of the platform, "waste" a jump
		if (isFallingOffTheEdge(potato, lavaSurface)) {
			console.log('?!?');
			potato.jump();
		}
	});

	// Limit the player movement to certain boundaries, and then start moving everything else instead
	if (keys.right.pressed && potato.x < 400) {
		potato.velocity.x = 5;
	} else if (keys.left.pressed && potato.x > 100) {
		potato.velocity.x = -5;
	} else {
		if (keys.right.pressed) {
			game.score += 5;
		} else if (keys.left.pressed) {
		}
		if (game.score >= 0) {
			scoreEl.innerText = game.score;
		}
		lavaSurfaces.forEach(lavaSurface => {
			if (keys.right.pressed) {
				lavaSurface.x -= 5;
				lavaSurface.enemies?.forEach(enemy => (enemy.x -= 5));
			} else if (keys.left.pressed) {
				lavaSurface.x += 5;
				lavaSurface.enemies?.forEach(enemy => (enemy.x += 5));
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
	generateLavaSurfaces(INITIAL_WINDOW);
	captureKeyboardEvents();
	fitCanvasToWindow();
	removeEventListener('keyup', startOnSpace);
	game.score = 0;
	scoreEl.innerText = game.score;
}

function goToHome() {
	document.querySelector('.game-over-modal').style.display = 'none';
	document.querySelector('.score-container').style.display = 'none';
	document.getElementById('home').style.display = 'block';
}

document.querySelector('.button.start-now').addEventListener('click', start);

document.querySelector('button.play-again').addEventListener('click', start);

document.querySelector('button.cancel').addEventListener('click', goToHome);

window.onload = () => {
	if (document.getElementById('home').style.display === 'none') {
		return;
	}
	addEventListener('keyup', startOnSpace);
};
