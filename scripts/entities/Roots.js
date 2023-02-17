import { ctx } from '../services/canvas.service.js';
import { DimensionImageEntity } from './DimensionImageEntity.js';

export class Roots extends DimensionImageEntity {
	constructor(x, y) {
		const image = new Image();
		image.src = '../../assets/images/roots.png';
		super(image);
		this.x = x;
		this.y = y;
	}

	draw() {
		ctx.drawImage(this.image, this.x, this.y);
	}

	adjustPositionRelativeToLastRoots(lastRoots) {
		if (this.x === lastRoots.x) {
			this.x += this.width;
		}
	}
}
