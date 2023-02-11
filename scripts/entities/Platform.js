import { ctx } from '../services/canvas.service.js';

export class Platform {
	constructor(x, y, velocity, image, decorationImage) {
		this.x = x;
		this.y = y;
		this.image = image;
		this.width = image.width;
		this.height = image.height;
		this.decorationImage = decorationImage;
		this.velocity = velocity;
		this.alpha = 1;
		this.alphaChangeSpeed = 0.05;
	}

	draw() {
		ctx.drawImage(this.image, this.x, this.y);
		if (this.decorationImage) {
			ctx.drawImage(this.decorationImage, this.x, this.y - this.decorationImage.height);
		}
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
