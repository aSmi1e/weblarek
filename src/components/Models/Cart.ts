import { ICart } from "../../types";
import { Product } from "../../types";


export class Cart implements ICart {
    private selectedProducts: Product[] = [];

    getSelectedProducts(): Product[] {
        return this.selectedProducts;
    }

    addProduct(product: Product): void {
        this.selectedProducts.push(product);
    }

    deleteProduct(product: Product): boolean {
        const lengthBefore = this.selectedProducts.length;
        this.selectedProducts = this.selectedProducts.filter((item) => item.id !== product.id);
        return this.selectedProducts.length < lengthBefore;
    }

    clearCart(): void {
        this.selectedProducts = [];
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