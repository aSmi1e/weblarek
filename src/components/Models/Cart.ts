import { ICart, Product } from '../../types';
import { IEvents } from '../base/Events';

export class Cart implements ICart {
    private selectedProducts: Product[] = [];

    constructor(private readonly events?: IEvents) {}

    getSelectedProducts(): Product[] {
        return this.selectedProducts;
    }

    private emitChange() {
        this.events?.emit('cart:change');
    }

    addProduct(product: Product): void {
        this.selectedProducts.push(product);
        this.emitChange();
    }

    deleteProduct(product: Product): boolean {
        const lengthBefore = this.selectedProducts.length;
        this.selectedProducts = this.selectedProducts.filter((item) => item.id !== product.id);
        const changed = this.selectedProducts.length < lengthBefore;
        if (changed) {
            this.emitChange();
        }
        return changed;
    }

    clearCart(): void {
        if (this.selectedProducts.length === 0) {
            return;
        }
        this.selectedProducts = [];
        this.emitChange();
    }

    calculateTotalPrice(): number {
        const sumTotal = this.selectedProducts.reduce(
            (accumulator, currentValue) => accumulator + (currentValue.price || 0),
            0,
        );
        return sumTotal;
    }

    calculateTotalProductAmount(): number {
        return this.selectedProducts.length;
    }

    checkProductInCart(id: string): boolean {
        return this.selectedProducts.some((item) => item.id === id);
    }
}