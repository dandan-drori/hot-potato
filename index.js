class Potato {
	constructor(x, y, width, height, velocity, gravity, isOnGround) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.velocity = {
			x: velocity.x,
			y: velocity.y,
		};
		this.gravity = gravity;
		this.isOnGround = isOnGround;
	}

	draw() {
		const img = document.getElementById('potato-image');
		const xml = new XMLSerializer().serializeToString(potatoSvg);
		const svg64 = btoa(xml);
		const b64Start = 'data:image/svg+xml;base64,';
		const image64 = b64Start + svg64;
		img.onload = () => ctx.drawImage(img, potato.x, potato.y);
		img.src = image64;

		this.y += this.gravity;
		if (this.y + height + 20 >= canvas.height) {
			this.y = canvas.height - height - 20;
		}
		if (this.y < 5) {
			this.y = 5;
		}
		if (this.x < 5) {
			this.x = 5;
		}
		if (this.x + width + 20 >= canvas.width) {
			this.x = canvas.width - width - 20;
		}
	}
}

class Lava {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

class Root {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

// Get Canvas and create Context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set the canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Draw the potato shape
let animationId;
const potatoSvg = document.getElementById('potato');
const backgroundSvg = document.getElementById('background');
const { width, height } = potatoSvg.getBoundingClientRect();
const potato = new Potato(5, canvas.height - height - 20, width, height, { x: 10, y: 0 }, 10, true);

// Init
window.onload = () => {
	window.requestAnimationFrame(animate);
};

// Draw the background

// Draw the roots (Thorns)

// Draw the Lava surfaces in a loop

// Capture keyboard events
captureKeyboardEvents();

function checkForCollision(rect1, rect2) {
	return (
		rect1.x < rect2.x + rect2.width &&
		rect1.x + rect1.width > rect2.x &&
		rect1.y < rect2.y + rect2.height &&
		rect1.height + rect1.y > rect2.y
	);
}

function animate() {
	animationId = requestAnimationFrame(animate);
	ctx.fillStyle = 'rgba(255,255,255,0.1)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	const img = new Image();
	const xml = new XMLSerializer().serializeToString(backgroundSvg);
	const svg64 = btoa(xml);
	const b64Start = 'data:image/svg+xml;base64,';
	const image64 = b64Start + svg64;
	img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	img.src = image64;
	potato.draw();
}

function captureKeyboardEvents() {
	const keysPressed = {};
	const movementFunctions = {
		ArrowLeft: async () => move('left'),
		ArrowRight: async () => move('right'),
		Space: async () => move('', true),
		LeftUp: async () => move('left', true),
		RightUp: async () => move('right', true),
	};
	window.addEventListener('keydown', async event => {
		keysPressed[event.key] = event.key;

		if (event.code === 'Space') {
			await movementFunctions.Space();
		} else {
			await movementFunctions?.[event.key]?.();
		}

		if (keysPressed['ArrowRight'] && event.code === 'Space') {
			await movementFunctions?.RightUp?.();
		}

		if (keysPressed['ArrowLeft'] && event.code === 'Space') {
			await movementFunctions?.LeftUp?.();
		}
	});

	// remove pressed keys from object
	window.addEventListener('keyup', event => {
		delete keysPressed[event.key];
	});
}

async function move(direction, isUp) {
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

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function positionLava() {
	const x = getRandomInt(0, canvas.width - width);
	const y = getRandomInt(0, canvas.height - height);
	const lava = new Lava(x, y, width, height);
	lava.draw();
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}


function start() {
	document.getElementsByClassName("game-over-modal")[0].style.display = "none"
	document.getElementById("home").style.display = "none";
	// document.getElementById("canvas").style.display = "block";
	gameOverModal();
}

function gameOverModal() {
	document.getElementsByClassName("game-over-modal")[0].style.display = "block"
	document.getElementsByTagName("body")[0].style.backgroundColor = "rgba(0, 0, 0, 0.7)"
}