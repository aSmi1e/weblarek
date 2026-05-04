class CatalogBase {
    constructor(private api: Api) {}

    async load(): Promise<Product[]> {
        const response = await this.api.get('/products');
        return response.data;
    }
}