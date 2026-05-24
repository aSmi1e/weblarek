import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export interface ICardBasket {
    id: string;
    title: string;
    price: number | null;
    index: number;
}

export class CardBasket extends Component<ICardBasket> {
    protected indexElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, onDelete?: () => void) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>(
            '.card__title',
            this.container
        );

        this.priceElement = ensureElement<HTMLElement>(
            '.card__price',
            this.container
        );

        this.indexElement = ensureElement<HTMLElement>(
            '.basket__item-index',
            this.container
        );

        this.deleteButton = ensureElement<HTMLButtonElement>(
            '.basket__item-delete',
            this.container
        );

        if (onDelete) {
            this.deleteButton.addEventListener('click', onDelete);
        }
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent =
            value === null ? 'Бесценно' : `${value} синапсов`;
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    get element(): HTMLElement {
        return this.container;
    }
}