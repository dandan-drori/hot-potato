import { ctx } from '../services/canvas.service.js';
import { DimensionImageEntity } from './DimensionImageEntity.js';
import { getRandomInt } from '../services/util.service.js';
import { ImageService } from '../services/image.service.js';

export class PowerUp extends DimensionImageEntity {
	constructor(x, y, velocity, type) {
		const image = ImageService.getInstance().powerUpImagesByType[type];
		super(image);
		this.x = x;
		this.y = y;
		this.velocity = velocity;
		this.type = type;
		this.initialY = y;
	}

	draw() {
		ctx.drawImage(this.image, this.x, this.y);
	}

	update() {
		this.draw();
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		if (this.y <= this.initialY - this.height - 20) {
			this.velocity.y = 0.3;
		} else if (this.y >= this.initialY - this.height) {
			this.velocity.y = -0.3;
		}
	}

	setOnDestroy(onDestroy) {
		this.onDestroy = onDestroy;
	}

	adjustPositionRelativeToPlatform(lava) {
		this.y -= this.height;
		this.x = getRandomInt(lava.x, lava.x + lava.width - this.width);
	}

	float() {
		this.velocity.y = 0.3;
	}
}
