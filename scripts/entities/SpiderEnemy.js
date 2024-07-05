import { Enemy } from './Enemy.js';
import { getRandomInt } from '../services/util.service.js';
import { isFallingOffLeftEdge, isFallingOffRightEdge } from '../services/util.service.js';
import { SPIDER } from '../constants/constants.js';

export class SpiderEnemy extends Enemy {
	constructor(x, y, velocity) {
		const image = new Image();
		image.src = '../../assets/images/enemy.png';
		super(x, y, velocity, image);
		this.gravity = 0;
		this.platform = null;
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
			this.velocity.x = SPIDER.PATROL_SPEED;
		} else if (isFallingOffRightEdge(this, this.platform, this.width / 2)) {
			this.velocity.x = -SPIDER.PATROL_SPEED;
		}
	}

	fall() {
		this.velocity.x = SPIDER.INITIAL_VELOCITY_X;
		this.gravity = 0.7;
	}

	patrolPlatform(platform) {
		this.velocity.x = SPIDER.PATROL_SPEED;
		this.platform = platform;
	}
}
