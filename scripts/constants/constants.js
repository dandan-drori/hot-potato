export const POTATO = {
	GRAVITY: 0.5,
	MAX_JUMP: 2,
	MAX_JUMP_WITH_POWER_UP: 3,
	AVATARS: [
		'../../assets/images/potato.png',
		['../../assets/images/smushed.png', '../../assets/images/jumping.png'],
		'../../assets/images/double jump.png',
		'../../assets/images/potato.png',
	],
	MAX_JUMP_HEIGHT: 400,
	HEIGHT: 57,
	JUMP_SPEED: -15,
	BOUNCE_SPEED_AFTER_HITTING_ENEMY: -10,
	INITIAL_JUMP_COUNT: 0,
};

export const CANVAS = {
	FILL_STYLE: 'rgba(255,255,255,0.1)',
};

export const GAME = {
	INITIAL_SCORE: 0,
	SCROLL_OFFSET_POINTS: 5,
	SCROLL_BACKGROUND_HORIZONTAL_SPEED: 5,
	INITIAL_SCROLL_OFFSET: 0,
	ENEMY_KILL_POINTS: 1000,
	PLATFORM_DESTROY_POINTS: 100,
	INITIAL_WINDOW: 20,
	DISCARD_AFTER: 10,
	AHEAD_WINDOW: 20,
};

export const PLAYER = {
	RIGHT_BORDER: 400,
	LEFT_BORDER: 100,
	INITIAL_HORIZONTAL_VELOCITY: 0,
	INITIAL_VERTICAL_VELOCITY: 0,
	HORIZONTAL_VELOCITY: 5,
	INITIAL_X: 100,
	INITIAL_Y: 0,
};

export const PLATFORM = {
	INITIAL_VELOCITY_X: 0,
	INITIAL_VELOCITY_Y: 0,
	MIN_X_DISTANCE_BETWEEN_PLATFORMS: 50,
	MAX_X_DISTANCE_BETWEEN_PLATFORMS: 250,
	MIN_WIDTH: 100,
	MAX_WIDTH: 400,
	DEFAULT_WIDTH: 168,
};

export const SPIDER = {
	HEIGHT: 72,
	WIDTH: 122,
	INITIAL_VELOCITY_X: 0,
	INITIAL_VELOCITY_Y: 0,
};

export const POWER_UP = {
	TYPES: ['invincible', 'double-score', 'triple-jump'],
	TYPE_TO_IMAGE: {
		invincible: '../../assets/images/potato.png',
		'double-score': '../../assets/images/jumping.png',
		'triple-jump': '../../assets/images/double jump.png',
	},
	CHANCE_TO_GENERATE: 10,
	INITIAL_VELOCITY_X: 0,
	INITIAL_VELOCITY_Y: 0,
};

export const KILLER_ROOT = {
	INITIAL_VERTICAL_VELOCITY: -20,
};
