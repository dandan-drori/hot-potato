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
		let isCollidingX = false;
		let isCollidingY = false;
		const newCollisionStateX = checkForCollisionX(this, startingSurface);
		const newCollisionStateY = checkForCollisionY(this, startingSurface);
		if (!isCollidingX) {
			isCollidingX = newCollisionStateX;
		}
		if (!isCollidingY) {
			isCollidingY = newCollisionStateY;
		}
		lavaSurfaces.forEach(lavaSurface => {
			const newCollisionStateX = checkForCollisionX(this, lavaSurface);
			const newCollisionStateY = checkForCollisionY(this, lavaSurface);
			if (!isCollidingX) {
				isCollidingX = newCollisionStateX;
			}
			if (!isCollidingY) {
				isCollidingY = newCollisionStateY;
			}
		});
		if (isCollidingX && isCollidingY) {
			potato.x = potatoLastState?.x || 100;
			potato.y = potatoLastState?.y || canvas.height / 2 - potatoHeight - DISTANCE_FROM_GROUND;
		}
		const img = document.getElementById('potato-image');
		const xml = new XMLSerializer().serializeToString(potatoSvg);
		const svg64 = btoa(xml);
		const b64Start = 'data:image/svg+xml;base64,';
		const image64 = b64Start + svg64;
		img.onload = () => ctx.drawImage(img, potato.x, potato.y);
		img.src = image64;

		potatoLastState = { x: potato.x, y: potato.y };
		if (this.y + this.height + DISTANCE_FROM_GROUND <= canvas.height && !isCollidingY) {
			this.y += this.gravity;
		}
		if (this.y < 5) {
			this.y = 5;
		}
		if (this.x < 5) {
			this.x = 5;
		}
		if (this.x + this.width + 20 >= canvas.width) {
			this.x = canvas.width - this.width - 20;
		}
	}
}
