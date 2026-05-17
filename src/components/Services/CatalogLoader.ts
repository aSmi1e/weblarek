import { ApiPostMethods, ICatalogLoader, IApi, OrderRequest, OrderResponse, ProductListResponse } from "../../types";

export class CatalogLoader implements ICatalogLoader {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    fetchProductList(): Promise<ProductListResponse> {
        return this.api.get<ProductListResponse>('/product/');
    }

    sendData(data: OrderRequest, method: ApiPostMethods = 'POST'): Promise<OrderResponse> {
        return this.api.post<OrderResponse>('/order/', data, method);
    }
}