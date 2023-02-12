import { getRandomInt } from './util.service.js';
import { Potato } from '../entities/Potato.js';
import { Lava } from '../entities/Lava.js';
import { StartingSurface } from '../entities/StartingSurface.js';
import { ctx, canvas, removeResizeListener } from './canvas.service.js';
import { addSpacePressListener, clearEventListeners, keys } from './keyboard.service.js';
import { getHighscore, saveScore } from './score.service.js';
import { SpiderEnemy } from '../entities/SpiderEnemy.js';
import { PLAYER, GAME } from '../constants/constants.js';

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
	potato = new Potato(PLAYER.INITIAL_X, PLAYER.INITIAL_Y, { x: 0, y: 0 });
	const startingSurface = new StartingSurface(PLAYER.INITIAL_X, canvas.height / 2, {
		x: 0,
		y: 0,
	});
	lavaSurfaces = [startingSurface];
}

export function generateLavaSurfaces(numToGenerate = 1) {
	for (let i = 0; i < numToGenerate; i++) {
		placeLavaSurface();
	}
}

export function placeLavaSurface() {
	const lastLavaSurface = lavaSurfaces[lavaSurfaces.length - 1] || {
		x: 100,
		y: 500,
		width: 150,
	};
	const x = getRandomInt(
		lastLavaSurface.x + lastLavaSurface.width + 50,
		lastLavaSurface.x + lastLavaSurface.width + 200
	);
	if (lastLavaSurface.y + 700 > canvas.height) {
	}
	const nextYMax =
		lastLavaSurface.y + 700 > canvas.height ? lastLavaSurface.y - 200 : lastLavaSurface.y + 600;
	const nextYMin = lastLavaSurface.y - 500 < 0 ? lastLavaSurface.y + 500 : lastLavaSurface.y - 400;
	const y = getRandomInt(nextYMin, nextYMax);
	const lava = new Lava(x, y, { x: 0, y: 0 }, Math.floor(Math.random() * 300) + 100);
	lava.setOnDestroy(lavaInstance => {
		const idx = lavaSurfaces.indexOf(lavaInstance);
		lavaSurfaces.splice(idx, 1);
	});
	lavaSurfaces.push(lava);
	if (lava.width > 100 && !getRandomInt(0, 5)) {
		const spider = new SpiderEnemy(lava.x + 20, lava.y, { x: 0, y: 0 });
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
