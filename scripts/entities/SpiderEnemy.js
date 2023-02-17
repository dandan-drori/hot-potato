import { Enemy } from './Enemy.js';
import { getRandomInt } from '../services/util.service.js';
import { isFallingOffLeftEdge, isFallingOffRightEdge } from '../services/util.service.js';

export class SpiderEnemy extends Enemy {
	constructor(x, y, velocity) {
		const image = new Image();
		image.src = '../../assets/images/enemy.png';
		super(x, y, velocity, image);
		this.gravity = 0;
	}

	adjustPositionRelativeToPlatform(lava) {
		this.y -= this.height;
		this.x = getRandomInt(lava.x, lava.x + lava.width - this.width);
	}

	update() {
		this.draw();
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		this.velocity.y += this.gravity;

		if (isFallingOffLeftEdge(this, this.platform, this.width / 2)) {
			this.velocity.x = 2;
		} else if (isFallingOffRightEdge(this, this.platform, this.width / 2)) {
			this.velocity.x = -2;
		}
	}

	fall() {
		this.velocity.x = 0;
		this.gravity = 0.7;
	}
}
