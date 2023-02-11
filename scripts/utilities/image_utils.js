import {ctx} from "../services/canvas.service.js";

export function drawCropImage(image, x, y, width, height) {
    ctx.drawImage(image, 0, 0, width, height, x, y, width, height);
}
