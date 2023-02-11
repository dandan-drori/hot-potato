import { Enemy } from './Enemy.js';
import { getRandomInt } from '../services/util.service.js';

export class SpiderEnemy extends Enemy {
	constructor(x, y, velocity) {
		const image = new Image();
		image.src = '../../assets/images/enemy.png';
		super(x, y, velocity, image);
	}

	adjustPositionRelativeToPlatform(lava) {
		console.log(this.height);
		this.y -= this.height;
		this.x = getRandomInt(lava.x, lava.x + lava.width - this.width);

		console.log();
	}
}
