import {ctx} from "../services/canvas.service.js";

export class Platform {
    constructor(x, y, velocity, image, decorationImage) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.width = image.width;
        this.height = image.height;
        this.decorationImage = decorationImage;
        this.velocity = velocity;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y);
        if (this.decorationImage) {
            ctx.drawImage(this.decorationImage, this.x, this.y - this.decorationImage.height);
        }
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
    }
}
