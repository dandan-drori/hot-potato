import { ctx } from '../services/canvas.service.js';
import { Platform } from './Platform.js';

export class Lava extends Platform {
	constructor(x, y, velocity, width) {
		const image = new Image();
		image.src = '../../assets/images/lava-surface-loop/lava.png';
		const decorationImage = new Image();
		decorationImage.src = '../../assets/images/lava-surface-loop/spikes.png';
		super(x, y, velocity, image, decorationImage, width);
		this.alpha = 1;
		this.alphaChangeSpeed = 0.05;
		this.enemies = [];
	}

	startBlinking(counter = 0) {
		setTimeout(
			() => {
				if (counter >= 6) {
					this.onDestroy?.(this);
					return;
				}
				if (this.alpha <= 0.5) {
					this.alphaChangeSpeed = 0.05;
				} else if (this.alpha >= 1) {
					this.alphaChangeSpeed = -0.05;
				}
				this.startBlinking(counter + 1);
			},
			counter ? 200 : 0
		);
	}

	update() {
		this.x += this.velocity.x;
		this.alpha += this.alphaChangeSpeed;
		this.alpha = this.alpha >= 1 ? 1 : this.alpha <= 0.5 ? 0.5 : this.alpha;
		ctx.globalAlpha = this.alpha;
		this.draw();
		ctx.globalAlpha = 1;
	}

	setOnDestroy(onDestroy) {
		this.onDestroy = onDestroy;
	}

	addEnemy(enemy) {
		this.enemies.push(enemy);
	}
}
