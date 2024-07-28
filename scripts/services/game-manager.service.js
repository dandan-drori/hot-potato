import { GAME } from '../constants/constants.js';

export class GameManager {
	potato = null;
	lavaSurfaces = [];
	particles = [];
	roots = [];
	killerRoots = [];
	latestLandingSurface = null;
	animationId = null;
	killerRootsIntervalId = null;
	scrollOffset = GAME.INITIAL_SCROLL_OFFSET;
	score = GAME.INITIAL_SCORE;
	achievements = GAME.INITIAL_ACHIEVEMENTS;

	static getInstance() {
		if (!this.instance) {
			this.instance = new GameManager();
		}
		return this.instance;
	}
}
