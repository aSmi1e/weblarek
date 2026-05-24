export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods
    ): Promise<T>;
}

export type PaymentMethod = 'card' | 'cash';

export type CustomerData = {
    payment: PaymentMethod | null;
    address: string;
    phone: string;
    email: string;
};

export type CustomerDataKey = keyof CustomerData;

export type ResultValidationType = Partial<
    Record<CustomerDataKey, string>
>;

export type Product = {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
};

export type ProductListResponse = {
    total: number;
    items: Product[];
};

export interface OrderRequest {
    payment: PaymentMethod;
    address: string;
    phone: string;
    email: string;
    total: number;
    items: string[];
}

export type OrderResponse = {
    id: string;
    total: number;
};

export interface ICatalogLoader {
    fetchProductList(): Promise<ProductListResponse>;
    sendData(
        data: OrderRequest,
        method?: ApiPostMethods
    ): Promise<OrderResponse>;
}

export interface ICatalog {
    saveProducts(products: Product[]): void;
    getProducts(): Product[];
    getProductById(id: string): Product | null;
    saveSelectedProductId(id: string): void,
    getSelectedProductId(): string | null;
}

export interface ICart {
    getSelectedProducts(): Product[];
    addProduct(product: Product): void;
    deleteProduct(product: Product): boolean;
    clearCart(): void;
    calculateTotalPrice(): number;
    calculateTotalProductAmount(): number;
    checkProductInCart(id: string): boolean;
}

export interface ICustomer {
    updateData<K extends CustomerDataKey>(
        key: K,
        value: CustomerData[K]
    ): boolean;

    getData(): CustomerData;
    clearData(): void;
    validateData(): ResultValidationType;
}