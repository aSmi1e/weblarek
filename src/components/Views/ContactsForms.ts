import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { FormView, IFormView } from './Forms.ts';

export interface IContactsFormView extends IFormView {
    email: string;
    phone: string;
}

export class ContactsFormView extends FormView<IContactsFormView> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, container);

        this.emailInput = ensureElement<HTMLInputElement>(
            'input[name="email"]',
            container
        );

        this.phoneInput = ensureElement<HTMLInputElement>(
            'input[name="phone"]',
            container
        );

        this.emailInput.addEventListener('input', () => {
            this.events.emit('contacts:email-change', {
                email: this.emailInput.value,
            });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:phone-change', {
                phone: this.phoneInput.value,
            });
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    protected onSubmit(): void {
        this.events.emit('contacts:submit');
    }
}