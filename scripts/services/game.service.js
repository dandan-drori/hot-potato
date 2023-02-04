// Draw the potato shape
let animationId;
const potatoSvg = document.getElementById('potato');
const backgroundSvg = document.getElementById('background');
const potatoWidth = getElementDimension(potatoSvg, 'width');
const potatoHeight = getElementDimension(potatoSvg, 'height');
const potato = new Potato(
	100,
	canvas.height / 2 - potatoHeight - DISTANCE_FROM_GROUND,
	potatoWidth,
	potatoHeight,
	{ x: 10, y: 0 },
	10,
	true
);
const startingSurfaceSvg = document.getElementById('starting-surface');
const startingSurfaceWidth = getElementDimension(startingSurfaceSvg, 'width');
const startingSurfaceHeight = getElementDimension(startingSurfaceSvg, 'height');
const startingSurface = new StartingSurface(
	100,
	canvas.height / 2,
	startingSurfaceWidth,
	startingSurfaceHeight
);
const lavaSurfaces = [];
let potatoLastState;

function generateLavaSurfaces() {
	setInterval(() => {
		placeLavaSurface();
	}, 1000);
}

function getRandomLavaElement() {
	const lavaSurfacesContainer = document.getElementById('lava-surfaces');
	const lavaElements = document.querySelectorAll('.lava');
	const index = getRandomInt(0, lavaElements.length - 1);
	const newLavaElement = lavaElements[index].cloneNode(true);
	lavaSurfacesContainer.appendChild(newLavaElement);
	return newLavaElement;
}

function placeLavaSurface() {
	if (lavaSurfaces.length > 10) return;
	const lastLavaSurface = lavaSurfaces[lavaSurfaces.length - 1] || {
		x: 100,
		y: 500,
		width: 150,
	};
	const x = getRandomInt(
		lastLavaSurface.x + lastLavaSurface.width + 50,
		lastLavaSurface.x + lastLavaSurface.width + 150
	);
	const y = getRandomInt(lastLavaSurface.y - 200, lastLavaSurface.y + 200);
	const randomLavaElement = getRandomLavaElement();
	const width = getElementDimension(randomLavaElement, 'width');
	const height = getElementDimension(randomLavaElement, 'height');
	const lava = new Lava(x, y, width, height, randomLavaElement);
	lavaSurfaces.push(lava);
}

async function move(direction, isUp) {
	potatoLastState = { x: potato.x, y: potato.y };
	const dir = direction === 'right' ? 1 : -1;
	const diff = dir * potato.velocity.x;
	if (direction) {
		potato.x += diff;
	}
	if (isUp) {
		await jump();
	}
}

async function jump() {
	if (!potato.isOnGround) return;
	potato.isOnGround = false;
	potato.gravity = 0;
	for (let i = 0; i < 30; i++) {
		potato.y -= 7;
		await sleep(10);
	}
	potato.gravity = 10;
	potato.isOnGround = true;
}

// Init
function start() {
	document.getElementById('home').style.display = 'none';
	document.getElementById('canvas').style.display = 'block';
	window.requestAnimationFrame(animate);
	generateLavaSurfaces();
	captureKeyboardEvents();
}

function gameOverModal() {
	document.getElementsByClassName('game-over-modal')[0].style.display = 'block';
	document.getElementsByTagName('body')[0].style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
}
