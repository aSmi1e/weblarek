import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export type CategoryKey = keyof typeof categoryMap;

export interface ICardBase {
    id: string;
}

export interface ICardCatalog extends ICardBase {
    title: string;
    price: number | null;
    category: string;
    image: string;
}

export interface ICardPreview extends ICardCatalog {
    description: string;
    inCart: boolean;
}

export interface ICardBasket extends ICardBase {
    title: string;
    price: number | null;
    index: number;
}

export abstract class Card<T extends ICardBase> extends Component<T> {
    protected _id = '';

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
    }

    set id(value: string) {
        this._id = value;
        this.container.dataset.id = value;
    }

    protected setCategory(element: HTMLElement, value: string) {
        element.textContent = value;

        (Object.keys(categoryMap) as CategoryKey[]).forEach((key) => {
            element.classList.toggle(categoryMap[key], key === value);
        });
    }

    protected formatPrice(value: number | null): string {
        return value === null ? 'Бесценно' : `${value} синапсов`;
    }

    protected resolveImage(src: string): string {
        return `${CDN_URL}/${src}`;
    }
}

// Карточка товара в каталоге (шаблон #card-catalog)
export class CardCatalog extends Card<ICardCatalog> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);

        this.container.addEventListener('click', () => {
            this.events.emit('card:select', { id: this._id });
        });
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = this.formatPrice(value);
    }

    set category(value: string) {
        this.setCategory(this.categoryElement, value);
    }

    set image(value: string) {
        this.setImage(this.imageElement, this.resolveImage(value), this.titleElement.textContent || '');
    }
}

// Карточка товара в превью (шаблон #card-preview)
export class CardPreview extends Card<ICardPreview> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('card:toggle-cart', { id: this._id });
        });
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = this.formatPrice(value);
    }

    set category(value: string) {
        this.setCategory(this.categoryElement, value);
    }

    set image(value: string) {
        this.setImage(this.imageElement, this.resolveImage(value), this.titleElement.textContent || '');
    }

    set inCart(value: boolean) {
        this.buttonElement.textContent = value ? 'Убрать из корзины' : 'В корзину';
    }
}

// Карточка товара в корзине (шаблон #card-basket)
export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButton.addEventListener('click', () => {
            this.events.emit('basket:item-remove', { id: this._id });
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = this.formatPrice(value);
    }
}