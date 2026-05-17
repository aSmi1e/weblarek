import { CustomerData, CustomerDataKey, ICustomer, ResultValidationType } from "../../types";

export class Customer implements ICustomer {

    private payment: CustomerData['payment'] = null;
    private address: CustomerData['address'] = null;
    private phone: CustomerData['phone'] = null;
    private email: CustomerData['email'] = null;

    updateData(key: CustomerDataKey, value: CustomerData[CustomerDataKey]): boolean {
        if (!(key in this)) {
            return false;
        }
        this[key] = value;
        return true;
    }

    getData(): CustomerData {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
        }
    }

    clearData(): void {
        this.payment = null;
        this.address = null;
        this.phone = null;
        this.email = null;
    }

    validateData(): ResultValidationType {
        const res: ResultValidationType = {};
        if (!this.payment?.trim()) {
            res['payment'] = "Укажите тип оплаты";
        }
        if (!this.address?.trim()) {
            res['address'] = "Укажите адрес";
        }
        if (!this.phone?.trim()) {
            res['phone'] = "Укажите телефон";
        }
        if (!this.email?.trim()) {
            res['email'] = "Укажите электронную почту";
        }
        return res;
    }
}