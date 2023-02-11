import { LAVA_SURFACES_OPTIONS } from '../constants/constants.js';
import { Platform } from './Platform.js';

export class Lava extends Platform {
	constructor(x, y, velocity) {
		const image = new Image();
		image.src = '../../assets/images/lava-surface-loop/lava.png';
		const decorationImage = new Image();
		decorationImage.src = '../../assets/images/lava-surface-loop/spikes.png';
		super(x, y, velocity, image, decorationImage);
		this.alphaCounter = 0;
	}

	loop() {
		setTimeout(() => {
			if (this.alphaCounter < 100) {
				if (this.alpha <= 0.5) {
					this.alphaChangeSpeed = 0.05;
				} else if (this.alpha >= 1) {
					this.alphaChangeSpeed = -0.05;
				}
				this.loop();
			}
		}, 500);
	}

	startBlinking() {
		this.alphaCounter++;
		this.loop();
		setTimeout(this.explode, 2000);
	}

	explode() {
		console.log('exploding!');
	}
}
