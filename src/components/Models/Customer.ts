import {
    CustomerData,
    CustomerDataKey,
    ICustomer,
    ResultValidationType
} from "../../types";

export class Customer implements ICustomer {

    private payment: CustomerData['payment'] = null;

    private address: CustomerData['address'] = '';

    private phone: CustomerData['phone'] = '';

    private email: CustomerData['email'] = '';

    updateData(
        key: CustomerDataKey,
        value: CustomerData[CustomerDataKey]
    ): boolean {
        (this[key] as CustomerData[typeof key]) = value;

        return true;
    }

    getData(): CustomerData {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
        };
    }

    clearData(): void {
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    validateData(): ResultValidationType {
        const res: ResultValidationType = {};

        if (!this.payment) {
            res.payment = 'Укажите тип оплаты';
        }

        if (!this.address.trim()) {
            res.address = 'Укажите адрес';
        }

        if (!this.phone.trim()) {
            res.phone = 'Укажите телефон';
        }

        if (!this.email.trim()) {
            res.email = 'Укажите электронную почту';
        }

        return res;
    }
}