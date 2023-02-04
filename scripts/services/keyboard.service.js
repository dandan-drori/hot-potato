function captureKeyboardEvents() {
	const keysPressed = {};
	const movementFunctions = {
		ArrowLeft: async () => move('left'),
		ArrowRight: async () => move('right'),
		Space: async () => move('', true),
		LeftUp: async () => move('left', true),
		RightUp: async () => move('right', true),
	};
	window.addEventListener('keydown', async event => {
		keysPressed[event.key] = event.key;

		if (event.code === 'Space') {
			await movementFunctions.Space();
		} else {
			await movementFunctions?.[event.key]?.();
		}

		if (keysPressed['ArrowRight'] && event.code === 'Space') {
			await movementFunctions?.RightUp?.();
		}

		if (keysPressed['ArrowLeft'] && event.code === 'Space') {
			await movementFunctions?.LeftUp?.();
		}
	});

	// remove pressed keys from object
	window.addEventListener('keyup', event => {
		delete keysPressed[event.key];
	});
}
