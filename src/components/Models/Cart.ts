import { ICart } from "../../types";
import { Product } from "../../types";


export class Cart implements ICart {
    _selectedProducts: Product[] = [];

    public getSelectedProducts(): Product[] {
        return this._selectedProducts;
    }

    public addProduct(product: Product): void {
        this._selectedProducts.push(product);
    }

    public deleteProduct(product: Product): boolean {
        try {
            for (let i = 0; i < this._selectedProducts.length; i++) {
                if (this._selectedProducts[i].id == product.id) {
                    this._selectedProducts.splice(i, 1);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log(`Ошибка при удалении товара из корзины: ${error}`);
            return false;
        }
    }

    public clearCart(): void {
        this._selectedProducts = [];
    }

    public calculateTotalPrice(): number {
        const sumTotal = this._selectedProducts.reduce(
            (accumulator, currentValue) => accumulator + (currentValue.price || 0),
            0,
        );
        return sumTotal;
    }

    public calculateTotalProductAmount(): number {
        return this._selectedProducts.length;
    }

    public checkProductInCart(id: string): number | null {
        for (let i = 0; i < this._selectedProducts.length; i++) {
            if (this._selectedProducts[i].id == id) {
                return i;
            }
        }
        return null;
    }
}