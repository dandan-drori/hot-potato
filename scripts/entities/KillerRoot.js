import { ctx } from '../services/canvas.service.js';
import { DimensionImageEntity } from './DimensionImageEntity.js';

export class KillerRoot extends DimensionImageEntity {
	constructor(x, y, velocity) {
		const image = new Image();
		image.src = '../../assets/images/killer-root.png';
		super(image);
		this.x = x;
		this.y = y;
		this.velocity = velocity;
		this.gravity = 0;
	}

	draw() {
		ctx.drawImage(this.image, this.x, this.y);
	}

	update() {
		this.draw();
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		this.velocity.y += this.gravity;

		if (this.velocity.y && this.y <= 100) {
			this.fall();
		}
	}

	fall() {
		if (this.velocity.y < 0) {
			this.velocity.y = 0;
		}
		setTimeout(() => {
			this.gravity = 1;
		}, 1000);
	}
}
