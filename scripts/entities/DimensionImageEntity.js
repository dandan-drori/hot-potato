export class DimensionImageEntity {
	constructor(image, width) {
		this.initialized = false;
		this.onImageLoad = undefined;
		this.image = image;
		this.height = image.height;
		this.width = width || image.width;

		image.onload = () => {
			this.initialized = true;
			this.height = image.height;
			this.width = width || image.width;
			this.onImageLoad?.();
		};
	}
}
