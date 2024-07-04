export class ElementsService {
    elements = {};

    static getInstance() {
        if (!this.instance) {
            this.instance = new ElementsService();
        }
        return this.instance;
    }

    getElement(selector) {
        if (!this.elements[selector]) {
            this.elements[selector] = document.querySelector(selector);
        }
        return this.elements[selector];
    }
}