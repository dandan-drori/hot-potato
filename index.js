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
	generateLavaSurfaces,
	generateNeededPlatforms,
	generateNeededRoots,
	gameOver,
	increaseScoreBy,
	resetScore,
	playBackgroundMusic,
	generateKillerRoots,
	potatoHasPowerUp,
} from './scripts/services/game.service.js';
import { GameManager } from './scripts/services/game-manager.service.js';
import {
	isCollided,
	isCollidedFromLeft,
	isCollidedFromRight,
	isCollidedFromAnyDirection,
} from './scripts/services/util.service.js';

const scoreEl = document.querySelector('.score');

function animate() {
	const game = GameManager.getInstance();
	game.animationId = requestAnimationFrame(animate);
	ctx.fillStyle = CANVAS.FILL_STYLE;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawBackground();
	generateNeededRoots();
	const startingSurface = game.lavaSurfaces[0];
	if (!game.potato.initialized || !startingSurface.initialized) return;

	// loop over roots
	game.roots.forEach(root => {
		root.draw();
	});

	// loop over killerRoots
	game.killerRoots.forEach(killerRoot => {
		killerRoot.update();
		if (keys.right.pressed && game.potato.x >= PLAYER.RIGHT_BORDER) {
			killerRoot.x -= GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED;
		} else if (keys.left.pressed && game.potato.x <= PLAYER.LEFT_BORDER) {
			killerRoot.x += GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED;
		}

		if (isCollidedFromAnyDirection(game.potato, killerRoot)) {
			if (!potatoHasPowerUp('invincible')) {
				gameOver();
			}
		}
	});

	// loop over particles
	game.particles.forEach((particle, index) => {
		// if particle should be removed, remove it, else, keep updating it
		if (particle.alpha <= 0) {
			game.particles.splice(index, 1);
		} else {
			particle.update();
			if (keys.right.pressed && game.potato.x >= PLAYER.RIGHT_BORDER) {
				particle.x -= GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED;
			} else if (keys.left.pressed && game.potato.x <= PLAYER.LEFT_BORDER) {
				particle.x += GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED;
			}
		}
	});

	// If player collides with starting surface from above, stop falling
	if (isCollided(game.potato, startingSurface)) {
		game.potato.land();
	}

	// loop over lava surfaces
	game.lavaSurfaces.forEach(lavaSurface => {
		lavaSurface.update();

		if (keys.right.pressed && game.potato.x >= PLAYER.RIGHT_BORDER) {
			lavaSurface.x -= GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED;
		} else if (keys.left.pressed && game.potato.x <= PLAYER.LEFT_BORDER) {
			lavaSurface.x += GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED;
		}

		// If player collides with lava surfaces from above, stop falling
		if (isCollided(game.potato, lavaSurface)) {
			if (lavaSurface !== game.latestLandingSurface) {
				lavaSurface?.startBlinking();
				generateNeededPlatforms(lavaSurface);
			}

			game.potato.land();
			game.latestLandingSurface = lavaSurface;
		}

		// update enemies on the platform
		lavaSurface.enemies?.forEach(enemy => {
			enemy.update();

			if (keys.right.pressed && game.potato.x >= PLAYER.RIGHT_BORDER) {
				enemy.x -= GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED;
			} else if (keys.left.pressed && game.potato.x <= PLAYER.LEFT_BORDER) {
				enemy.x += GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED;
			}

			// if spider has fallen, stop rendering it
			if (enemy.y > canvas.height) {
				const idx = lavaSurface.enemies.indexOf(enemy);
				lavaSurface.enemies.splice(idx, 1);
			}

			if (isCollided(game.potato, enemy)) {
				enemy.onDestroy(enemy);
				game.potato.jump(true);
				increaseScoreBy(GAME.ENEMY_KILL_POINTS);
			} else if (
				isCollidedFromLeft(game.potato, enemy) ||
				isCollidedFromRight(game.potato, enemy)
			) {
				if (potatoHasPowerUp('invincible')) {
					enemy.onDestroy(enemy);
					increaseScoreBy(GAME.ENEMY_KILL_POINTS);
				} else {
					gameOver();
				}
			}
		});

		lavaSurface.powerUps?.forEach(powerUp => {
			powerUp.update();

			if (keys.right.pressed && game.potato.x >= PLAYER.RIGHT_BORDER) {
				powerUp.x -= GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED;
			} else if (keys.left.pressed && game.potato.x <= PLAYER.LEFT_BORDER) {
				powerUp.x += GAME.SCROLL_BACKGROUND_HORIZONTAL_SPEED;
			}

			if (isCollidedFromAnyDirection(game.potato, powerUp)) {
				console.log('earned', powerUp.type);
				game.potato.addPowerUp(powerUp);
				powerUp.onDestroy();
			}
		});
	});

	// Limit the player movement to certain boundaries, and then start moving everything else instead
	if (keys.right.pressed && game.potato.x < PLAYER.RIGHT_BORDER) {
		game.potato.velocity.x = PLAYER.HORIZONTAL_VELOCITY;
	} else if (keys.left.pressed && game.potato.x > PLAYER.LEFT_BORDER) {
		game.potato.velocity.x = -PLAYER.HORIZONTAL_VELOCITY;
	} else {
		if (keys.right.pressed) {
			increaseScoreBy(GAME.SCROLL_OFFSET_POINTS);
		}

		if (game.score >= GAME.INITIAL_SCORE) {
			scoreEl.innerText = game.score;
		}
		game.potato.velocity.x = PLAYER.INITIAL_HORIZONTAL_VELOCITY;
	}

	// If player collides with the ceiling, reset his vertical speed
	if (game.potato.y + game.potato.velocity.y <= 0) {
		game.potato.velocity.y = PLAYER.INITIAL_VERTICAL_VELOCITY;
	}

	game.potato.update();
}

export function start() {
	document.querySelector('.game-over-modal').style.display = 'none';
	document.getElementById('home').style.display = 'none';
	document.querySelector('.score-container').style.display = 'block';
	init();
	requestAnimationFrame(animate);
	generateLavaSurfaces(GAME.INITIAL_WINDOW);
	generateKillerRoots();
	captureKeyboardEvents();
	fitCanvasToWindow();
	removeEventListener('keyup', startOnPress);
	resetScore();
	playBackgroundMusic();
	scoreEl.innerText = GameManager.getInstance().score;
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
