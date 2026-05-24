import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { FormView, IFormView } from './Forms.ts';

export interface IOrderFormView extends IFormView {
    payment: string | null;
    address: string;
}

export class OrderFormView extends FormView<IOrderFormView> {
    protected buttonCard: HTMLButtonElement;
    protected buttonCash: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, container);

        this.buttonCard = ensureElement<HTMLButtonElement>(
            'button[name="card"]',
            container
        );

        this.buttonCash = ensureElement<HTMLButtonElement>(
            'button[name="cash"]',
            container
        );

        this.addressInput = ensureElement<HTMLInputElement>(
            'input[name="address"]',
            container
        );

        this.buttonCard.addEventListener('click', () => {
            this.events.emit('order:payment-change', {
                payment: 'card',
            });
        });

        this.buttonCash.addEventListener('click', () => {
            this.events.emit('order:payment-change', {
                payment: 'cash',
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:address-change', {
                address: this.addressInput.value,
            });
        });
    }

    set payment(value: string | null) {
        this.buttonCard.classList.toggle(
            'button_alt-active',
            value === 'card'
        );

        this.buttonCash.classList.toggle(
            'button_alt-active',
            value === 'cash'
        );
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    protected onSubmit(): void {
        this.events.emit('order:submit');
    }
}