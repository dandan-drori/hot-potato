import { GRAVITY, AVATARS, MAX_JUMP } from '../constants/constants.js';
import { ctx } from '../services/canvas.service.js';
import { gameOver } from '../services/game.service.js';
import { DimensionImageEntity } from './DimensionImageEntity.js';

export class Potato extends DimensionImageEntity {
	constructor(x, y, velocity) {
		const image = new Image();
		image.src = '../../assets/images/potato.png';
		super(image);

		this.x = x;
		this.y = y;
		this.velocity = velocity;

		this.jumpCount = 0;
	}

	draw() {
		ctx.drawImage(this.image, this.x, this.y);
	}

	update() {
		this.draw();
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		if (this.y + this.height + this.velocity.y <= canvas.height) {
			this.velocity.y += GRAVITY;
		} else {
			gameOver();
		}
	}

	animateAvatar(avatar, counter = 0) {
		setTimeout(
			() => {
				this.image.src = avatar[counter];
				if (counter >= avatar.length - 1) {
					return;
				}
				this.animateAvatar(avatar, counter + 1);
			},
			counter ? 200 : 0
		);
	}

	jump(isEnemyHit = false) {
		if (isEnemyHit) {
			this.jumpCount--;
		}
		if (this.jumpCount > MAX_JUMP - 1) {
			return;
		}
		this.jumpCount += 1;
		this.velocity.y = -15;

		let avatar = AVATARS[this.jumpCount];
		if (!Array.isArray(avatar)) {
			avatar = [avatar];
		}
		this.animateAvatar(avatar);
	}

	land() {
		this.jumpCount = 0;
		this.velocity.y = 0;
		this.animateAvatar([AVATARS[this.jumpCount]]);
	}
}
