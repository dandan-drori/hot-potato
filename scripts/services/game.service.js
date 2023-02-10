// Draw the potato shape
let animationId;
const potatoSvg = document.getElementById('potato');
const backgroundSvg = document.getElementById
('background');
const potatoWidth = getElementDimension(potatoSvg, 'width');
const potatoHeight = getElementDimension(potatoSvg, 'height');
var audio = document.getElementById("fluffing-a-duck");
var jumpAudio = document.getElementById("jump-audio");
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
const roots = [];
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

function placeAllRoots() {
	if (roots.length < 20) {
		addRoots();
	}
	roots.forEach(root => root.draw())
}

function addRoots() {
	const rootsSvg = document.getElementsByClassName('roots')[0];
	const width = getElementDimension(rootsSvg, 'width');
	const height = getElementDimension(rootsSvg, 'height');
	const x = roots[roots.length - 1]?.x + width || 0;
	const y = canvas.height - height;
	const root = new Root(x, y, width, height);
	roots.push(root);
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
		await start();
	}
}

async function jump() {
	if (!potato.isOnGround) return;
	potato.isOnGround = false;
	jumpAudio.play()
	console.log('jump')
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
	audio.play()
	audio.volume = 0.3;
	document.getElementById('home').style.display = 'none';
	document.getElementById('canvas').style.display = 'block';
	document.getElementsByClassName('game-over-modal')[0].style.display = 'none';
	window.requestAnimationFrame(animate);	
	generateLavaSurfaces();
	captureKeyboardEvents();
}
function liveWithMyShame() {
	document.getElementById('home').style.display = 'block';
	document.getElementsByClassName('game-over-modal')[0].style.display = 'none';

}
function gameOverModal() {
	document.getElementsByClassName('game-over-modal')[0].style.display = 'flex';
	document.getElementsByTagName('body')[0].style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
	const sadPotato = document.getElementById('sad-potato');
	const img = new Image();
	const xml = new XMLSerializer().serializeToString(sadPotato);
	const svg64 = btoa(xml);
	const b64Start = 'data:image/svg+xml;base64,';
	const image64 = b64Start + svg64;
	img.onload = () => ctx.drawImage(img, canvas.width / 2, canvas.height / 2);
	img.src = image64;
	sadPotato.style.display = 'block';
}
gameOverModal()
