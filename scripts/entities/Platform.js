import { ctx } from '../services/canvas.service.js';
import { drawCropImage } from '../utilities/image_utils.js';
import { DimensionImageEntity } from './DimensionImageEntity.js';

export class Platform extends DimensionImageEntity {
	constructor(x, y, velocity, image, decorationImage, width) {
		super(image, width);
		this.x = x;
		this.y = y;
		this.image = image;
		this.width = image.width;
		this.height = image.height;
		this.decorationImage = decorationImage;
		this.velocity = velocity;
	}

	drawPlatform(x, y, width, height) {
		width = width || this.image.width;
		height = height || this.image.height;
		const decorHeight = this.decorationImage.height;
		drawCropImage(this.image, x, y, width, height);
		if (this.decorationImage) {
			drawCropImage(this.decorationImage, x, y - decorHeight, width, decorHeight);
		}
	}

	draw() {
		if (!this.image.width) {
			this.drawPlatform(this.x, this.y);
			return;
		}

		const numOfDuplications = Math.floor(this.width / this.image.width);
		const widthRest = this.width % this.image.width;

		let xIterator = this.x;
		for (let i = 0; i < numOfDuplications; i++) {
			this.drawPlatform(xIterator, this.y);
			xIterator += this.image.width;
		}
		if (widthRest) this.drawPlatform(xIterator, this.y, widthRest);
	}

	update() {
		this.x += this.velocity.x;
		this.alpha += this.alphaChangeSpeed;
		this.alpha = this.alpha >= 1 ? 1 : this.alpha <= 0.5 ? 0.5 : this.alpha;
		ctx.globalAlpha = this.alpha;
		this.draw();
		ctx.globalAlpha = 1;
	}
}
