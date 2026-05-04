export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface ICatalogLoader {
    _api: IApi,
    sendData: void,
    fetchData: void
}

export type Product = {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface ICatalog {
    _productList: Product[],
    _selectedProductId: string | null,

    saveProducts(products: Product[]): boolean,
    getProducts(): Product[],
    getProductById(id: string): Product | null,
    saveProductById(id: string): void
}

export interface ICart {
    _selectedProducts: Product[],

    getSelectedProducts(): Product[],
    addProduct(product: Product): void,
    deleteProduct(product: Product): boolean,
    clearCart(): void,
    calculateTotalPrice(): number,
    calculateTotalProductAmount(): number,
    checkProductInCart(id: string): number | null
}

export interface ICustomer {
    _paymentType: string | null,
    _address: string | null,
    _phone: string | null,
    _email: string | null,

    updateData<K extends keyof this>(key: K, value: this[K]): void,
    getData(): {
        paymentType: string | null,
        address: string | null,
        phone: string | null,
        email: string | null,
    },
    clearData(): void,
    validateData(object: {
        paymentType: string,
        address: string,
        phone: string,
        email: string,
    }): {
        paymentType?: string,
        address?: string,
        phone?: string,
        email?: string,
    }
}