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

export interface ICardActions {
    onClick?: () => void;
    onToggleCart?: () => void;
    onDelete?: () => void;
}

export abstract class Card<T extends ICardBase> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = this.formatPrice(value);
    }

    protected formatPrice(value: number | null): string {
        return value === null ? 'Бесценно' : `${value} синапсов`;
    }
}

// Карточка товара в каталоге (шаблон #card-catalog)
export class CardCatalog extends Card<ICardCatalog> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(events: IEvents, container: HTMLElement, actions?: ICardActions) {
        super(events, container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        (Object.keys(categoryMap) as CategoryKey[]).forEach((key) => {
            this.categoryElement.classList.toggle(categoryMap[key], key === value);
        });
    }

    set image(value: string) {
        this.setImage(
            this.imageElement,
            `${CDN_URL}/${value}`,
            this.titleElement.textContent || '',
        );
    }
}

// Карточка товара в превью (шаблон #card-preview)
export class CardPreview extends Card<ICardPreview> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement, actions?: ICardActions) {
        super(events, container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.onToggleCart) {
            this.buttonElement.addEventListener('click', actions.onToggleCart);
        }
    }

    set price(value: number | null) {
        super.price = value;
        const unavailable = value === null;
        this.buttonElement.disabled = unavailable;
        if (unavailable) {
            this.buttonElement.textContent = 'Недоступно';
        }
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        (Object.keys(categoryMap) as CategoryKey[]).forEach((key) => {
            this.categoryElement.classList.toggle(categoryMap[key], key === value);
        });
    }

    set image(value: string) {
        this.setImage(
            this.imageElement,
            `${CDN_URL}/${value}`,
            this.titleElement.textContent || '',
        );
    }

    set inCart(value: boolean) {
        if (this.buttonElement.disabled) {
            return;
        }
        this.buttonElement.textContent = value ? 'Убрать из корзины' : 'В корзину';
    }
}

// Карточка товара в корзине (шаблон #card-basket)
export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement, actions?: ICardActions) {
        super(events, container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onDelete) {
            this.deleteButton.addEventListener('click', actions.onDelete);
        }
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

}