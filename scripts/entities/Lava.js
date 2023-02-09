import { ctx } from '../services/canvas.service.js';

export class Lava {
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
	}
}
