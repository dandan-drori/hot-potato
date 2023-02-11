export function getRandomInt(min, max) {
	return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

export function isCollided(potato, surface) {
	return (
		potato.y + potato.height <= surface.y &&
		potato.y + potato.height + potato.velocity.y >= surface.y &&
		potato.x + potato.width >= surface.x &&
		potato.x <= surface.x + surface.width
	);
}

export function isCollidedFromLeft(potato, enemy) {
	return (
		potato.x + potato.width <= enemy.x &&
		potato.x + potato.width + potato.velocity.x >= enemy.x &&
		potato.y + potato.height >= enemy.y &&
		potato.y <= enemy.y + enemy.height
	);
}

export function isCollidedFromRight(potato, enemy) {
	return (
		potato.x >= enemy.x + enemy.width &&
		potato.x + potato.velocity.x <= enemy.x + enemy.width &&
		potato.y + potato.height >= enemy.y &&
		potato.y <= enemy.y + enemy.height
	);
}
