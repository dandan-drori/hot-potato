// Draw the roots (Thorns)

function animate() {
	animationId = requestAnimationFrame(animate);
	ctx.fillStyle = 'rgba(255,255,255,0.1)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	const img = new Image();
	const xml = new XMLSerializer().serializeToString(backgroundSvg);
	const svg64 = btoa(xml);
	const b64Start = 'data:image/svg+xml;base64,';
	const image64 = b64Start + svg64;
	img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	img.src = image64;
	// Draw the Potato
	potato.draw();
	// Draw the starting surface
	startingSurface.draw();
	// Draw the Lava surfaces in a loop
	lavaSurfaces.forEach(lavaSurface => {
		lavaSurface.draw();
	});
}
