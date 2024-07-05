import { CANVAS, GAME, POTATO } from './scripts/constants/constants.js';
import { canvas, ctx, fitCanvasToWindow } from './scripts/services/canvas.service.js';
import { captureKeyboardEvents, startOnPress } from './scripts/services/keyboard.service.js';
import {
	drawBackground,
	generateKillerRoots,
	generateLavaSurfaces,
	generateNeededRoots,
	initGameInstance,
	playBackgroundMusic,
	resetScore, updateKillerRoots,
	updateLavaSurfaces,
	updateParticles, updatePlayerMovement,
} from './scripts/services/game.service.js';
import { GameManager } from './scripts/services/game-manager.service.js';
import { ImageService } from './scripts/services/image.service.js';
import { ElementsService } from './scripts/services/elements.service.js';
import { isCollided } from './scripts/services/util.service.js';
import { navigate, registerEventListeners } from './scripts/utilities/cosmetics.util.js';

function animate() {
	const game = GameManager.getInstance();
	game.animationId = requestAnimationFrame(animate);
	ctx.fillStyle = CANVAS.FILL_STYLE;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawBackground();
	generateNeededRoots();
	const startingSurface = game.lavaSurfaces[0];
	if (!game.potato.initialized || !startingSurface.initialized) return;

	// If player collides with starting surface from above, stop falling
	if (isCollided(game.potato, startingSurface)) {
		game.potato.land();
	}

	// loop over roots
	game.roots.forEach(root => {
		root.draw();
	});

	// loop over killerRoots
	updateKillerRoots(game);

	// loop over particles
	updateParticles(game);

	// loop over lava surfaces
	updateLavaSurfaces(game);

	// Limit the player movement to certain boundaries, and then start moving everything else instead
	updatePlayerMovement(game);
}

export function start() {
	navigate({ gameOverModal: 'none', score: 'block', home: 'none' });
	ImageService.getInstance().preloadImages(POTATO.AVATARS);
	ImageService.getInstance().loadPowerUpImages();
	initGameInstance();
	requestAnimationFrame(animate);
	generateLavaSurfaces(GAME.INITIAL_WINDOW);
	generateKillerRoots();
	captureKeyboardEvents();
	fitCanvasToWindow();
	removeEventListener('keyup', startOnPress);
	resetScore();
	playBackgroundMusic();
	ElementsService.getInstance().getElement('.score').innerText = GameManager.getInstance().score;
}


window.onload = () => {
	registerEventListeners();
	if (ElementsService.getInstance().getElement('#home').style.display === 'none') return;
	addEventListener('keyup', startOnPress);
};
