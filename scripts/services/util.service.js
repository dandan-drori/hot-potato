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
		potato.x + potato.width + (potato.velocity.x || 5) >= enemy.x &&
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

export function isCollidedFromBottom(potato, entity) {
	return (
		potato.y + potato.height >= entity.y &&
		potato.y + potato.height + potato.velocity.y <= entity.y &&
		potato.x + potato.width >= entity.x &&
		potato.x <= entity.x + entity.width
	);
}

export function isCollidedFromAnyDirection(potato, entity) {
	return (
		isCollided(potato, entity) ||
		isCollidedFromLeft(potato, entity) ||
		isCollidedFromRight(potato, entity) ||
		isCollidedFromBottom(potato, entity)
	);
}

export function isFallingOffLeftEdge(entity, platform, entityWidth) {
	const x = entity.x + (entityWidth ?? entity.width);

	return (
		x >= platform.x &&
		x + entity.velocity.x <= platform.x &&
		entity.y + entity.height <= platform.y
	);
}

export function isFallingOffRightEdge(entity, platform, entityWidth) {
	const x = entity.x + (entityWidth ?? 0);

	return (
		x <= platform.x + platform.width &&
		x + entity.velocity.x >= platform.x + platform.width + platform.velocity.x &&
		entity.y + entity.height + 5 >= platform.y &&
		entity.y <= platform.y + platform.height
	);
}