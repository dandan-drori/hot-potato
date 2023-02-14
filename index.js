import { GAME, PLAYER, CANVAS } from './scripts/constants/constants.js';
import { ctx, canvas, fitCanvasToWindow } from './scripts/services/canvas.service.js';
import {
	keys,
	captureKeyboardEvents,
	resetGame,
	startOnPress,
} from './scripts/services/keyboard.service.js';
import {
	init,
	drawBackground,
	potato,
	lavaSurfaces,
	particles,
	generateLavaSurfaces,
	game,
	gameOver,
	increaseScoreBy,
	resetScore,
} from './scripts/services/game.service.js';
import {
	isCollided,
	isCollidedFromLeft,
	isCollidedFromRight,
} from './scripts/services/util.service.js';

const scoreEl = document.querySelector('.score');

function generateNeededPlatforms(lavaSurface) {
	const indexOfPlatform = lavaSurfaces.indexOf(lavaSurface);

	generateLavaSurfaces(
		Math.max(GAME.AHEAD_WINDOW - (lavaSurfaces.length - 1 - indexOfPlatform), 0)
	);
	lavaSurfaces.splice(0, Math.max(indexOfPlatform - GAME.DISCARD_AFTER, 0));
}

function animate() {
	game.animationId = requestAnimationFrame(animate);
	ctx.fillStyle = CANVAS.FILL_STYLE;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawBackground();
	const startingSurface = lavaSurfaces[0];
	if (!potato.initialized || !startingSurface.initialized) return;

	// loop over particles
	particles.forEach((particle, index) => {
		// if particle should be removed, remove it, else, keep updating it
		if (particle.alpha <= 0) {
			particles.splice(index, 1);
		} else {
			particle.update();
		}
	});

	// If player collides with starting surface from above, stop falling
	if (isCollided(potato, startingSurface)) {
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
				increaseScoreBy(GAME.ENEMY_KILL_POINTS);
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
	});

	// Limit the player movement to certain boundaries, and then start moving everything else instead
	if (keys.right.pressed && potato.x < PLAYER.RIGHT_BORDER) {
		potato.velocity.x = PLAYER.HORIZONTAL_VELOCITY;
	} else if (keys.left.pressed && potato.x > PLAYER.LEFT_BORDER) {
		potato.velocity.x = -PLAYER.HORIZONTAL_VELOCITY;
	} else {
		if (keys.right.pressed) {
			increaseScoreBy(GAME.SCROLL_OFFSET_POINTS);
			particles.forEach(particle => (particle.x -= GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED));
		} else if (keys.left.pressed) {
			particles.forEach(particle => (particle.x += GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED));
		}

		if (game.score >= GAME.INITIAL_SCORE) {
			scoreEl.innerText = game.score;
		}
		lavaSurfaces.forEach(lavaSurface => {
			if (keys.right.pressed) {
				lavaSurface.x -= GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED;
				lavaSurface.enemies?.forEach(enemy => (enemy.x -= GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED));
			} else if (keys.left.pressed) {
				lavaSurface.x += GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED;
				lavaSurface.enemies?.forEach(enemy => (enemy.x += GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED));
			}
		});
		potato.velocity.x = PLAYER.INITIAL_HORIZONTAL_VELOCITY;
	}

	// If player collides with the ceiling, reset his vertical speed
	if (potato.y + potato.velocity.y <= 0) {
		potato.velocity.y = PLAYER.INITIAL_VERTICAL_VELOCITY;
	}

	potato.update();
}

export function start() {
	document.querySelector('.game-over-modal').style.display = 'none';
	document.getElementById('home').style.display = 'none';
	document.querySelector('.score-container').style.display = 'block';
	init();
	requestAnimationFrame(animate);
	generateLavaSurfaces(GAME.INITIAL_WINDOW);
	captureKeyboardEvents();
	fitCanvasToWindow();
	removeEventListener('keyup', startOnPress);
	resetScore();
	scoreEl.innerText = game.score;
}

function goToHome() {
	document.querySelector('.game-over-modal').style.display = 'none';
	document.querySelector('.score-container').style.display = 'none';
	document.getElementById('home').style.display = 'block';
}

document.querySelector('.button.start-now').addEventListener('click', start);

document.querySelector('button.play-again').addEventListener('click', resetGame);

document.querySelector('button.cancel').addEventListener('click', goToHome);

window.onload = () => {
	if (document.getElementById('home').style.display === 'none') return;
	addEventListener('keyup', startOnPress);
};
