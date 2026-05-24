import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IFormView {
    valid: boolean;
    errors: string;
}

export abstract class FormView<T extends IFormView> extends Component<T> {
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLFormElement) {
        super(container);

        this.formElement = container;

        this.submitButton = ensureElement<HTMLButtonElement>(
            'button[type="submit"]',
            this.container
        );

        this.errorsElement = ensureElement<HTMLElement>(
            '.form__errors',
            this.container
        );

        this.formElement.addEventListener('submit', (event: SubmitEvent) => {
            event.preventDefault();
            this.onSubmit();
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }

    protected abstract onSubmit(): void;

    get element(): HTMLElement {
        return this.container;
    }
}