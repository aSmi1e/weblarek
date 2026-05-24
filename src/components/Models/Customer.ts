import {
    CustomerData,
    CustomerDataKey,
    ICustomer,
    ResultValidationType,
} from '../../types';
import { IEvents } from '../base/Events';

export class Customer implements ICustomer {
    private data: CustomerData = {
        payment: null,
        address: '',
        phone: '',
        email: '',
    };

    constructor(private readonly events: IEvents) {}

    updateData<K extends CustomerDataKey>(
        key: K,
        value: CustomerData[K]
    ): boolean {
        this.data[key] = value;

        this.events.emit('customer:change');

        return true;
    }

    getData(): CustomerData {
        return this.data;
    }

    clearData(): void {
        this.data = {
            payment: null,
            address: '',
            phone: '',
            email: '',
        };

        this.events.emit('customer:change');
    }

    validateData(): ResultValidationType {
        const errors: ResultValidationType = {};

        if (!this.data.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }

        if (!this.data.address) {
            errors.address = 'Необходимо указать адрес';
        }

        if (!this.data.email) {
            errors.email = 'Необходимо указать email';
        }

        if (!this.data.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        return errors;
    }
}