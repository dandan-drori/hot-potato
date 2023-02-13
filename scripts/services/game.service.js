import { getRandomInt } from './util.service.js';
import { Potato } from '../entities/Potato.js';
import { Lava } from '../entities/Lava.js';
import { StartingSurface } from '../entities/StartingSurface.js';
import { ctx, canvas, removeResizeListener } from './canvas.service.js';
import { addSpacePressListener, clearEventListeners, keys } from './keyboard.service.js';
import { getHighscore, saveScore } from './score.service.js';
import { SpiderEnemy } from '../entities/SpiderEnemy.js';
import { PLAYER, GAME, PLATFORM, SPIDER, POTATO } from '../constants/constants.js';

export let potato;
export let lavaSurfaces;
export let game = {
	latestLandingSurface: null,
	animationId: null,
	scrollOffset: GAME.INITIAL_SCROLL_OFFSET,
	score: GAME.INITIAL_SCORE,
};
export let backgroundImage = new Image();

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
}

export function generateLavaSurfaces(numToGenerate = 1) {
	for (let i = 0; i < numToGenerate; i++) {
		placeLavaSurface();
	}
}

export function placeLavaSurface() {
	const lastLavaSurface = lavaSurfaces[lavaSurfaces.length - 1];
	const x = getRandomInt(
		lastLavaSurface.x + lastLavaSurface.width + PLATFORM.MIN_X_DISTANCE_BETWEEN_PLATFORMS,
		lastLavaSurface.x + lastLavaSurface.width + PLATFORM.MAX_X_DISTANCE_BETWEEN_PLATFORMS
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
			const idx = lava.enemies.indexOf(enemyInstance);
			lava.enemies.splice(idx, 1);
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
