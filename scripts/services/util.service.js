function getRandomInt(min, max) {
	return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function checkForCollisionX(rect1, rect2) {
	return rect1.x <= rect2.x + rect2.width && rect1.x + rect1.width >= rect2.x;
}

function checkForCollisionY(rect1, rect2) {
	return rect1.y <= rect2.y + rect2.height && rect1.height + rect1.y >= rect2.y;
}

function getElementDimension(element, dimension) {
	return +element.getAttribute(dimension);
}
