import { ICatalog, Product } from '../../types';
import { IEvents } from '../base/Events';

export class Catalog implements ICatalog {
    private productList: Product[] = [];
    private selectedProductId: string | null = null;

    constructor(private readonly events: IEvents) { // Убрали опциональность
        this.events = events;
    }

    saveProducts(products: Product[]): void {
        this.productList = products;
        this.events.emit('catalog:change'); // Не передаем данные в событии
    }

    getProducts(): Product[] {
        return this.productList;
    }

    getProductById(id: string): Product | null {
        return this.productList.find((product) => product.id === id) ?? null;
    }

    saveSelectedProductId(id: string): void {
        this.selectedProductId = id;
        this.events.emit('catalog:selected-change'); // Не передаем данные в событии
    }

    getSelectedProductId(): string | null {
        return this.selectedProductId;
    }
}