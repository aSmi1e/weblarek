import { ICatalog, Product } from '../../types';
import { IEvents } from '../base/Events';

export class Catalog implements ICatalog {
    private productList: Product[] = [];
    private selectedProductId: string | null = null;

    constructor(private readonly events?: IEvents) {

    }

    saveProducts(products: Product[]): void {
        this.productList = products;

        this.events?.emit('catalog:change', {
            products: this.productList,
        });
    }

    getProducts(): Product[] {
        return this.productList;
    }

    getProductById(id: string): Product | null {
        return this.productList.find((product) => product.id === id) ?? null;
    }

    saveSelectedProductId(id: string): void {
        this.selectedProductId = id;
        this.events?.emit('catalog:selected-change', {
            selectedProductId: this.selectedProductId,
        });
    }


    getSelectedProductId(): string | null {
        return this.selectedProductId;
    }
}