import { PLAYER, POTATO } from '../constants/constants.js';
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

		this.jumpCount = POTATO.INITIAL_JUMP_COUNT;
	}

	draw() {
		ctx.drawImage(this.image, this.x, this.y);
	}

	update() {
		this.draw();
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		if (this.y + this.height + this.velocity.y <= canvas.height) {
			this.velocity.y += POTATO.GRAVITY;
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
		if (this.jumpCount >= POTATO.MAX_JUMP) {
			return;
		}
		this.jumpCount++;
		this.velocity.y = isEnemyHit ? POTATO.BOUNCE_SPEED_AFTER_HITTING_ENEMY : POTATO.JUMP_SPEED;

		const avatar = POTATO.AVATARS[this.jumpCount];
		const avatarArray = !Array.isArray(avatar) ? [avatar] : avatar;
		this.animateAvatar(avatarArray);
	}

	land() {
		this.jumpCount = POTATO.INITIAL_JUMP_COUNT;
		this.velocity.y = PLAYER.INITIAL_VERTICAL_VELOCITY;
		this.animateAvatar([POTATO.AVATARS[this.jumpCount]]);
	}
}
