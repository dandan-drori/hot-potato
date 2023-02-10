export class Root {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	draw() {
		const rootsSvg = document.getElementsByClassName('roots')[0];
		const img = new Image();
		const xml = new XMLSerializer().serializeToString(rootsSvg);
		const svg64 = btoa(xml);
		const b64Start = 'data:image/svg+xml;base64,';
		const image64 = b64Start + svg64;
		img.onload = () => ctx.drawImage(img, this.x, this.y);
		img.src = image64;
	}
}
