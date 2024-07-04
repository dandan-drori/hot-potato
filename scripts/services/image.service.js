export class ImageService {
    avatarImages = [];

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
}
