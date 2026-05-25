import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export interface ICardCatalog {
    id: string;
    title: string;
    price: number | null;
    category: keyof typeof categoryMap;
    image: string;
}

export class CardCatalog extends Component<ICardCatalog> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, onClick?: () => void) {
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

        if (onClick) {
            this.container.addEventListener('click', onClick);
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
}