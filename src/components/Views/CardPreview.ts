import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export interface ICardPreview {
    id: string;
    title: string;
    price: number | null;
    category: keyof typeof categoryMap;
    image: string;
    description: string;
    buttonText: string;
    buttonDisabled: boolean;
}

export class CardPreview extends Component<ICardPreview> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, onToggleCart?: () => void) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>(
            '.card__title',
            this.container
        );

        this.priceElement = ensureElement<HTMLElement>(
            '.card__price',
            this.container
        );

        this.categoryElement = ensureElement<HTMLElement>(
            '.card__category',
            this.container
        );

        this.imageElement = ensureElement<HTMLImageElement>(
            '.card__image',
            this.container
        );

        this.descriptionElement = ensureElement<HTMLElement>(
            '.card__text',
            this.container
        );

        this.buttonElement = ensureElement<HTMLButtonElement>(
            '.card__button',
            this.container
        );

        if (onToggleCart) {
            this.buttonElement.addEventListener('click', onToggleCart);
        }
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent =
            value === null ? 'Бесценно' : `${value} синапсов`;
    }

    set category(value: keyof typeof categoryMap) {
        this.categoryElement.textContent = value;

        Object.values(categoryMap).forEach((className) => {
            this.categoryElement.classList.remove(className);
        });

        this.categoryElement.classList.add(categoryMap[value]);
    }

    set image(value: string) {
        this.setImage(
            this.imageElement,
            `${CDN_URL}/${value}`,
            this.titleElement.textContent || ''
        );
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}