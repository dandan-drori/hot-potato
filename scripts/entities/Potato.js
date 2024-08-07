import { PLAYER, POTATO } from '../constants/constants.js';
import { ctx } from '../services/canvas.service.js';
import { gameOver, potatoHasPowerUp } from '../services/game.service.js';
import { DimensionImageEntity } from './DimensionImageEntity.js';
import { AudioService } from '../services/audio.service.js';
import { ImageService } from '../services/image.service.js';

export class Potato extends DimensionImageEntity {
	constructor(x, y, velocity) {
		const potatoImage = ImageService.getInstance().avatarImages[0];
		super(potatoImage);

		this.x = x;
		this.y = y;
		this.velocity = velocity;

		this.jumpCount = POTATO.INITIAL_JUMP_COUNT;
		this.activePowerUps = [];
		this.powerUpsTimers = {
			invincibility: undefined,
			'triple-jump': undefined,
			'double-score': undefined,
		}
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
		// keep jumpCount in a closure
		const currJumpCount = this.jumpCount;
		setTimeout(
			() => {
				// only change to jump avatar if not in super jump
				if (currJumpCount !== this.jumpCount) return;
				this.image = avatar[counter];
				// don't change avatars if there are not more avatars to change to
				if (counter >= avatar.length - 1) return;
				this.animateAvatar(avatar, counter + 1);
			},
			counter ? 200 : 0
		);
	}

	jump(isEnemyHit = false) {
		const maxJump = potatoHasPowerUp('triple-jump')
			? POTATO.MAX_JUMP_WITH_POWER_UP
			: POTATO.MAX_JUMP;
		AudioService.getInstance().stopAllJumpSounds();
		if (isEnemyHit) {
			this.jumpCount--;
		}
		if (this.jumpCount >= maxJump) {
			return;
		}
		this.jumpCount++;
		this.velocity.y = isEnemyHit ? POTATO.BOUNCE_SPEED_AFTER_HITTING_ENEMY : POTATO.JUMP_SPEED;

		const avatar = ImageService.getInstance().avatarImages[this.jumpCount];
		const avatarArray = !Array.isArray(avatar) ? [avatar] : avatar;
		this.animateAvatar(avatarArray);
		AudioService.getInstance().playSound('jump');
	}

	land() {
		this.jumpCount = POTATO.INITIAL_JUMP_COUNT;
		this.velocity.y = PLAYER.INITIAL_VERTICAL_VELOCITY;
		const avatar = ImageService.getInstance().avatarImages[this.jumpCount];
		this.animateAvatar([avatar]);
	}

	addPowerUp(powerUp) {
		this.removeTypePowerUps(powerUp.type);
		this.activePowerUps.push(powerUp);
		if (this.powerUpsTimers[powerUp.type]) clearTimeout(this.powerUpsTimers[powerUp.type]);
		this.powerUpsTimers[powerUp.type] = setTimeout(() => {
			const idx = this.activePowerUps.findIndex(
				activePowerUp => activePowerUp.type === powerUp.type
			);
			this.activePowerUps.splice(idx, 1);
		}, 10 * 1000);
	}

	removeTypePowerUps(type) {
		this.activePowerUps.filter(powerUp => powerUp.type !== type);
	}
}
