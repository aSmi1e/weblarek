import { Api } from "./Api";
import { ApiPostMethods, ICatalogBase } from "../../types";
import { API_URL } from "../../utils/constants";

export class CatalogBase implements ICatalogBase {
    _api: Api;
    _fetchUrl: string;
    _sendUrl: string;

    constructor(fetchUrl: string = '/product/', sendUrl: string = '/order/') {
        this._api = new Api(API_URL);
        this._fetchUrl = fetchUrl;
        this._sendUrl = sendUrl;
    }

    public fetchData<T extends object>(): Promise<T> {
        return this._api.get<T>(this._fetchUrl);
    }

    public sendData<T extends object>(data: object, method: ApiPostMethods = 'POST'): Promise<T> {
        return this._api.post<T>(this._sendUrl, data, method);
    }
}