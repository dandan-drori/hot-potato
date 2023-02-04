class Lava {
	constructor(x, y, width, height, element) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.element = element;
	}

	draw() {
		const img = new Image();
		const xml = new XMLSerializer().serializeToString(this.element);
		const svg64 = btoa(xml);
		const b64Start = 'data:image/svg+xml;base64,';
		const image64 = b64Start + svg64;
		img.onload = () => ctx.drawImage(img, this.x, this.y);
		img.src = image64;
	}
}
