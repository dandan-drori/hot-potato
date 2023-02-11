import {Platform} from "./Platform.js"

export class Lava extends Platform {
	constructor(x, y, velocity, width) {
		const image = new Image();
		image.src = '../../assets/images/lava-surface-loop/lava.png'
		const decorationImage = new Image();
		decorationImage.src = '../../assets/images/lava-surface-loop/spikes.png'

		super(x, y, velocity, image, decorationImage, width);
	}
}
