import {Platform} from "./Platform.js";
import {IMAGES} from "../constants/constants.js";

export class StartingSurface extends Platform {
	constructor(x, y, velocity) {
		const image = new Image();
		image.src = IMAGES.startingSurface

		super(x, y, velocity, image, image);
	}
}

