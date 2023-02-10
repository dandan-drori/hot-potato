import {Platform} from "./Platform.js"
import {IMAGES} from "../constants/constants.js";

export class Lava extends Platform {
	constructor(x, y, velocity) {
		const image = new Image();
		image.src = IMAGES.lavaSurfaceSmall

		super(x, y, velocity, image, image);
	}
}
