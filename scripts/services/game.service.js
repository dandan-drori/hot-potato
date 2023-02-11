import { getRandomInt } from './util.service.js';
import { Potato } from '../entities/Potato.js';
import { Lava } from '../entities/Lava.js';
import { StartingSurface } from '../entities/StartingSurface.js';
import { ctx, canvas, removeResizeListener } from './canvas.service.js';
import { clearEventListeners, keys } from './keyboard.service.js';
import { getHighscore, saveScore } from './score.service.js';

export let potato;
export let lavaSurfaces;
export let game = {
	latestLandingSurface: null,
	animationId: null,
	scrollOffset: 0,
	score: 0
};

export function init() {
	potato = new Potato(100, 0, { x: 0, y: 0 });
	const startingSurface = new StartingSurface(100, canvas.height / 2, { x: 0, y: 0 });
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
	return lava;
}

export function gameOverModal() {
	document.getElementsByClassName('game-over-modal')[0].style.display = 'flex';
	document.getElementsByTagName('body')[0].style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
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
	const img = new Image();
	img.src = '../../assets/images/background.png';
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}
