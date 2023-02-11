import { ctx } from '../services/canvas.service.js';
import {
	isFallingOffLeftEdge,
	isFallingOffRightEdge,
	isFallingOffTheEdge,
} from '../services/util.service.js';
import { DimensionImageEntity } from './DimensionImageEntity.js';

export class Enemy extends DimensionImageEntity {
	constructor(x, y, velocity, image) {
		super(image);
		this.x = x;
		this.y = y;
		this.velocity = velocity;
	}

	draw() {
		ctx.drawImage(this.image, this.x, this.y);
	}

	update() {
		this.draw();
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}

	setOnDestroy(onDestroy) {
		this.onDestroy = onDestroy;
	}

	patrolPlatform(platform) {
		this.velocity.x = 3;
		if (isFallingOffLeftEdge(this, platform)) {
			this.velocity.x = 3;
		} else if (isFallingOffRightEdge(this, platform)) {
			this.velocity.x = -3;
		}
	}
}
