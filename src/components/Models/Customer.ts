import { Product } from "../../types";
import { ICustomer } from "../../types";

class Customer implements ICustomer {

    _paymentType: string | null = null;
    _address: string | null = null;
    _phone: string | null = null;
    _email: string | null = null;

    public updateData<K extends keyof this>(key: K, value: this[K]): void {
        try {
            if (key in this) {
                this[key] = value;
            }
        } catch (error) {
            console.error(`Ошибка при обновлении данных покупателя: ${error}`);
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
    }): {
        paymentType?: string,
        address?: string,
        phone?: string,
        email?: string,
    } {
        return {
            paymentType: "",
            address: "",
            phone: "",
            email: "",
        }
    }
}