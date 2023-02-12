export const POTATO = {
	GRAVITY: 0.5,
	MAX_JUMP: 2,
	AVATARS: [
		'../../assets/images/potato.png',
		['../../assets/images/smushed.png', '../../assets/images/jumping.png'],
		'../../assets/images/double jump.png',
	],
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
