import { GRAVITY } from '../constants/constants.js';
import { ctx } from '../services/canvas.service.js';
import { jumpState } from '../services/keyboard.service.js';

export class Potato {
	constructor(x, y, velocity, image) {
		this.x = x;
		this.y = y;
		this.image = image;
		this.width = image.width;
		this.height = image.height;
		this.velocity = velocity;
	}

	draw() {
		ctx.drawImage(this.image, this.x, this.y);
	}

	update() {
		this.draw();
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		if (this.y + this.height + this.velocity.y <= canvas.height) {
			this.velocity.y += GRAVITY;
		} else {
			jumpState.isOnGround = true;
			jumpState.isJumping = false;
			jumpState.isDoubleJumping = false;
			this.velocity.y = 0;
		}
	}
}
