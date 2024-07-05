import { ctx } from '../services/canvas.service.js';
import { DimensionImageEntity } from './DimensionImageEntity.js';

export class Enemy extends DimensionImageEntity {
	constructor(x, y, velocity, image) {
		super(image);
		this.x = x;
		this.y = y;
		this.platform = null;
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
}
