import { ensureElement } from '../../utils/utils';
import { Card } from './Card.ts';

export interface ICardBasket {
    id: string;
    title: string;
    price: number | null;
    index: number;
}

export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, onDelete?: () => void) {
        super(container);

        this.indexElement = ensureElement(
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

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}