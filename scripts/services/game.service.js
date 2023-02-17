import { getRandomInt } from './util.service.js';
import { Potato } from '../entities/Potato.js';
import { Lava } from '../entities/Lava.js';
import { StartingSurface } from '../entities/StartingSurface.js';
import { Particle } from '../entities/Particle.js';
import { SpiderEnemy } from '../entities/SpiderEnemy.js';
import { ctx, canvas, removeResizeListener } from './canvas.service.js';
import { addSpacePressListener, clearEventListeners, keys } from './keyboard.service.js';
import { getHighscore, saveScore } from './score.service.js';
import { PLAYER, GAME, PLATFORM, SPIDER, POTATO } from '../constants/constants.js';
import { AudioService } from './audio.service.js';
import { Roots } from '../entities/Roots.js';

export let potato;
export let lavaSurfaces;
export let particles;
export let roots;
export const game = {
	latestLandingSurface: null,
	animationId: null,
	scrollOffset: GAME.INITIAL_SCROLL_OFFSET,
	score: GAME.INITIAL_SCORE,
};
let backgroundImage = new Image();

export function init() {
	potato = new Potato(PLAYER.INITIAL_X, PLAYER.INITIAL_Y, {
		x: PLAYER.INITIAL_HORIZONTAL_VELOCITY,
		y: PLAYER.INITIAL_VERTICAL_VELOCITY,
	});
	const startingSurface = new StartingSurface(PLAYER.INITIAL_X, canvas.height / 2, {
		x: PLATFORM.INITIAL_VELOCITY_X,
		y: PLATFORM.INITIAL_VELOCITY_X,
	});
	lavaSurfaces = [startingSurface];
	particles = [];
	roots = [];
}

export function generateLavaSurfaces(numToGenerate = 1) {
	for (let i = 0; i < numToGenerate; i++) {
		placeLavaSurface();
	}
}

export function placeLavaSurface() {
	const lastLavaSurface = lavaSurfaces[lavaSurfaces.length - 1];
	const lastLavaSurfaceWidth = lastLavaSurface.width || PLATFORM.DEFAULT_WIDTH;
	const x = getRandomInt(
		lastLavaSurface.x + lastLavaSurfaceWidth + PLATFORM.MIN_X_DISTANCE_BETWEEN_PLATFORMS,
		lastLavaSurface.x + lastLavaSurfaceWidth + PLATFORM.MAX_X_DISTANCE_BETWEEN_PLATFORMS
	);
	const distanceFromCeil = lastLavaSurface.y;
	const nextYMin =
		distanceFromCeil > POTATO.MAX_JUMP_HEIGHT
			? lastLavaSurface.y - POTATO.MAX_JUMP_HEIGHT + POTATO.HEIGHT
			: lastLavaSurface.height + POTATO.HEIGHT * 2 + SPIDER.HEIGHT;
	const nextYMax = canvas.height - lastLavaSurface.height - POTATO.HEIGHT;
	const y = getRandomInt(nextYMin, nextYMax);
	const lava = new Lava(
		x,
		y,
		{ x: PLATFORM.INITIAL_VELOCITY_X, y: PLATFORM.INITIAL_VELOCITY_Y },
		Math.floor(Math.random() * (PLATFORM.MAX_WIDTH - PLATFORM.MIN_WIDTH)) + PLATFORM.MIN_WIDTH
	);
	lava.setOnDestroy(lavaInstance => {
		const idx = lavaSurfaces.indexOf(lavaInstance);
		lavaSurfaces.splice(idx, 1);
		increaseScoreBy(GAME.PLATFORM_DESTROY_POINTS);
		addParticles(lavaInstance);
		lavaInstance.enemies.forEach(enemy => enemy?.onDestroy(enemy));
	});
	lavaSurfaces.push(lava);
	if (shouldGenerateSpider(lava, lava.height + POTATO.HEIGHT + SPIDER.HEIGHT + 100)) {
		const spider = new SpiderEnemy(lava.x, lava.y, {
			x: SPIDER.INITIAL_VELOCITY_X,
			y: SPIDER.INITIAL_VELOCITY_Y,
		});
		spider.onImageLoad = () => {
			spider.adjustPositionRelativeToPlatform(lava);
		};
		spider.setOnDestroy(enemyInstance => {
			// const idx = lava.enemies.indexOf(enemyInstance);
			// lava.enemies.splice(idx, 1);
			enemyInstance.fall();
		});
		spider.patrolPlatform(lava);
		lava.addEnemy(spider);
	}
}

export function gameOverModal() {
	document.querySelector('.game-over-modal').style.display = 'flex';
	document.querySelector('body').style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
	addSpacePressListener();
}

export function gameOver() {
	cancelAnimationFrame(game.animationId);
	gameOverModal();
	removeResizeListener();
	clearEventListeners();
	saveScore(game.score);
	AudioService.getInstance().stopAllSounds();
	document.querySelector('.highscore').innerText = getHighscore();
	// fixes bug where after clicking "play again", if one of the arrows was still pressed upon death,
	// the potato starts moving without pressing any key
	keys.right.pressed = false;
	keys.left.pressed = false;
}

export function drawBackground() {
	backgroundImage.onload = function () {
		backgroundImage = this;
		ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
	};
	backgroundImage.src = '../../assets/images/background.png';
}

function shouldGenerateSpider(lava, miniumHeight = 0) {
	const isPlatformWideEnoughForSpider = lava.width > SPIDER.WIDTH;
	const chanceToGenerate = !getRandomInt(0, 5);
	const platformIsFarEnoughFromCeiling = lava.y > miniumHeight;
	return isPlatformWideEnoughForSpider && chanceToGenerate && platformIsFarEnoughFromCeiling;
}

export function increaseScoreBy(amount) {
	game.score += amount;
}

export function resetScore() {
	game.score = GAME.INITIAL_SCORE;
}

export function addParticles(destroyedEntity) {
	const color = destroyedEntity instanceof Lava ? '#ffbb00' : '#050505';
	const horizontalMiddle = destroyedEntity.x + destroyedEntity.width / 2;
	const verticalMiddle = destroyedEntity.y + destroyedEntity.height / 2;
	const radius = Math.random() * 2;
	for (let i = 0; i < destroyedEntity.width * 2; i++) {
		particles.push(
			new Particle(horizontalMiddle, verticalMiddle, radius, color, {
				x: (Math.random() - 0.5) * (Math.random() * 6),
				y: Math.random() - 0.5 * (Math.random() * 6),
			})
		);
	}
}

export function playBackgroundMusic() {
	AudioService.getInstance().playSound('background');
}

export function generateNeededPlatforms(lavaSurface) {
	const indexOfPlatform = lavaSurfaces.indexOf(lavaSurface);

	generateLavaSurfaces(
		Math.max(GAME.AHEAD_WINDOW - (lavaSurfaces.length - 1 - indexOfPlatform), 0)
	);
	lavaSurfaces.splice(0, Math.max(indexOfPlatform - GAME.DISCARD_AFTER, 0));
}

export function generateNeededRoots() {
	const combinedRootsWidth = roots.reduce((combinedWidth, currRoot) => {
		return combinedWidth + currRoot.width;
	}, 0);

	// if roots fill the entire screen width, stop generating more roots
	if (combinedRootsWidth >= canvas.width) return;

	placeRoots();
}

export function placeRoots() {
	const lastRoots = roots[roots.length - 1] || { x: 0, y: canvas.height - 540, width: 0 };
	const newRoots = new Roots(lastRoots.x + lastRoots.width, lastRoots.y);

	// fixes bug where roots didn't fill the entire screen width
	if (roots.length) {
		newRoots.onImageLoad = () => {
			newRoots.adjustPositionRelativeToLastRoots(lastRoots);
		};
	}

	roots.push(newRoots);
}
