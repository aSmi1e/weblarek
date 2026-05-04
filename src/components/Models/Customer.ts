import { ValidationType } from "../../types";
import { ICustomer } from "../../types";

export class Customer implements ICustomer {

    _paymentType: string | null = null;
    _address: string | null = null;
    _phone: string | null = null;
    _email: string | null = null;

    public updateData<K extends keyof this>(key: K, value: this[K]): boolean {
        try {
            if (key in this) {
                this[key] = value;
                return true
            }
            return false
        } catch (error) {
            console.error(`Ошибка при обновлении данных покупателя: ${error}`);
            return false
        }
    }

    public getData(): {
        paymentType: string | null,
        address: string | null,
        phone: string | null,
        email: string | null,
    } {
        return {
            paymentType: this._paymentType,
            address: this._address,
            phone: this._phone,
            email: this._email
        }
    }

    public clearData(): void {
        this._paymentType = null;
        this._address = null;
        this._phone = null;
        this._email = null;
    }

    validateData(dataForValidation: {
        paymentType: string,
        address: string,
        phone: string,
        email: string,
    }): ValidationType {
        const res: ValidationType = {};
        if (dataForValidation.paymentType == "") {
            res['paymentType'] = "Укажите тип оплаты";
        }
        if (dataForValidation.address == "") {
            res['address'] = "Укажите адрес";
        }
        if (dataForValidation.phone == "") {
            res['phone'] = "Укажите номер телефона";
        }
        if (dataForValidation.email == "") {
            res['email'] = "Укажите электронную почту";
        }

        return res;
    }
}