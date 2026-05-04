import { ICatalog } from "../../types";
import { Product } from "../../types";


export class Catalog implements ICatalog {
    _productList: Product[] = [];
    _selectedProductId: string | null = null;

    public saveProducts(products: Product[]): boolean {
        try {
            this._productList.push(...products);
            console.log(this._productList);
            return true;
        } catch (error) {
            console.log(`Ошибка при сохранении данных товаров: ${error}`);
            return false;
        }
    };

    public getProducts(): Product[] {
        return this._productList;
    }

    public getProductById(id: string): Product | null {
        try {
            const productFilteredList = this._productList.filter((product) => product.id == id);
            return productFilteredList.length == 0 ? null : productFilteredList[0];
        } catch (error) {
            console.log(`Ошибка при получении продукта по ID: ${error}`);
            return null;
        }
    };

    public saveProductById(id: string): void {
        this._selectedProductId = id;
    };
}