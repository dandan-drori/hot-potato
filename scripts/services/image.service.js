import { POWER_UP } from '../constants/constants.js';

export class ImageService {
    avatarImages = [];
    powerUpImagesByType = {};

    static getInstance() {
        if (!this.instance) {
            this.instance = new ImageService();
        }
        return this.instance;
    }

    preloadImages(imagesPaths) {
        this.avatarImages = imagesPaths.map(imagePath => {
            if (Array.isArray(imagePath)) {
                return imagePath.map(currImagePath => {
                    const img= new Image();
                    img.src = currImagePath;
                    return img;
                });
            }
            const img= new Image();
            img.src = imagePath;
            return img;
        });
    }

    loadPowerUpImages() {
        this.powerUpImagesByType = Object.entries(POWER_UP.TYPE_TO_IMAGE).reduce((acc, [type, path]) => {
            if (!acc[type]) {
                const image = new Image();
                image.src = path
                acc[type] = image;
            }
            return acc;
        }, {});
    }
}
