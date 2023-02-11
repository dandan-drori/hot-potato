import { Platform } from './Platform.js';

export class StartingSurface extends Platform {
	constructor(x, y, velocity) {
		const image = new Image();
		image.src = '../../assets/images/terrain-loop/terrain group.png';
		const decorationImage = new Image();
		decorationImage.src = '../../assets/images/terrain-loop/flowers.png';

		super(x, y, velocity, image, decorationImage);
	}
}
