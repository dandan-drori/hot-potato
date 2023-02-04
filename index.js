// Draw the roots (Thorns)

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
	// Draw the Potato
	potato.draw();
	// Draw the starting surface
	startingSurface.draw();
	// Draw the Lava surfaces in a loop
	lavaSurfaces.forEach(lavaSurface => {
		lavaSurface.draw();
	});
}
<<<<<<< Updated upstream

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
=======
>>>>>>> Stashed changes
