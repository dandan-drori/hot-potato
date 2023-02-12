import { DimensionImageEntity } from './DimensionImageEntity';

export class Root extends DimensionImageEntity {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}
