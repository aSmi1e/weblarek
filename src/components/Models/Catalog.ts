import { ICatalog } from "../../types";
import { Product } from "../../types";

export class Catalog implements ICatalog {
    private productList: Product[] = [];
    private selectedProductId: string | null = null;

    saveProducts(products: Product[]): void {
        this.productList = products;
    };

    getProducts(): Product[] {
        return this.productList;
    }

    getProductById(id: string): Product | null {
        return this.productList.find((product) => product.id === id) ?? null;
    };

    saveSelectedProductId(id: string): void {
        this.selectedProductId = id;
    };

    getSelectedProductId(): string | null {
        return this.selectedProductId;
    };
}