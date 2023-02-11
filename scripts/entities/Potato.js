import { GRAVITY } from '../constants/constants.js';
import { ctx } from '../services/canvas.service.js';
import { gameOver } from '../services/game.service.js';
import { DimensionImageEntity } from './DimensionImageEntity.js';

const MAX_JUMP = 2;

export class Potato extends DimensionImageEntity {
	constructor(x, y, velocity) {
		const image = new Image();
		image.src = '../../assets/images/potato.png';
		super(image);

		this.x = x;
		this.y = y;
		this.velocity = velocity;

		this.jumpCount = 0;
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
			gameOver();
		}
	}

	jump() {
		if (this.jumpCount > MAX_JUMP - 1) {
			return;
		}
		this.jumpCount += 1;
		this.velocity.y = -15;
	}

	land() {
		this.jumpCount = 0;
		this.velocity.y = 0;
	}
}
