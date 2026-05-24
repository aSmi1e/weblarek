import { Component } from '../base/Component';

interface IGalleryView {
    items: HTMLElement[];
}

export class GalleryView extends Component<IGalleryView> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(value: HTMLElement[]) {
        this.container.replaceChildren(...value);
    }

    showError(message: string): void {
        this.container.innerHTML = `<div class="error">${message}</div>`;
    }

    get element(): HTMLElement {
        return this.container;
    }
}