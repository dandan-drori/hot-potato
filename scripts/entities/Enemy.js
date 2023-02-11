class Enemy extends DimensionImageEntity {
	constructor(x, y, width, image) {
		this.x = x;
		this.y = y;
		this.image = image;
		this.width = image.width;
		this.height = image.height;

		super(image, width);
	}
}
