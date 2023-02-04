class StartingSurface {
	constructor(x, y, width, height, element) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	draw() {
		const img = new Image();
		const startingSurfaceSvg = document.getElementById('starting-surface');
		const xml = new XMLSerializer().serializeToString(startingSurfaceSvg);
		const svg64 = btoa(xml);
		const b64Start = 'data:image/svg+xml;base64,';
		const image64 = b64Start + svg64;
		img.onload = () => ctx.drawImage(img, this.x, this.y);
		img.src = image64;
	}
}
