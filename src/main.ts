import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Customer } from './components/Models/Customer';
import { CatalogLoader } from './components/Services/CatalogLoader';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import type { OrderRequest, Product, ProductListResponse } from './types';

const products: Product[] = apiProducts.items;
const firstProduct = products[0];
const secondProduct = products[1] ?? products[0];

const methodTest = async () => {
    try {
        // Cart
        console.log('Тестирование Cart');
        const cart = new Cart();
        console.log('Метод getSelectedProducts (ожидается пусто):', cart.getSelectedProducts());
        cart.addProduct(firstProduct);
        console.log('Метод getSelectedProducts (при добавлении одного продукта):', cart.getSelectedProducts());
        cart.addProduct(secondProduct);
        console.log('Метод getSelectedProducts (при добавлении двух продуктов):', cart.getSelectedProducts());

        console.log('Метод checkProductInCart (ожидается true):', cart.checkProductInCart(firstProduct.id));
        console.log('Метод calculateTotalProductAmount (подсчет итогового количества):', cart.calculateTotalProductAmount());
        console.log('Метод calculateTotalPrice (подсчет итоговой цены):', cart.calculateTotalPrice());

        console.log('Метод deleteProduct (удаление настоящего, ожидается true):', cart.deleteProduct(firstProduct));
        console.log('Метод deleteProduct (удаление удалённого продукта, ожидается false):', cart.deleteProduct(firstProduct));
        console.log('Метод getSelectedProducts (ожидается меньшее количество продуктов):', cart.getSelectedProducts());

        console.log('Метод clearCart (ничего не ожидается):', cart.clearCart());
        console.log('Метод на проверку очищенной корзины:', cart.getSelectedProducts());
        console.log('Метод checkProductInCart (после очистки корзины ожидается false):', cart.checkProductInCart(firstProduct?.id));

        // Catalog
        console.log('Тестирование Catalog');
        const catalog = new Catalog();
        console.log('Метод saveProducts (ничего не возвращает):', catalog.saveProducts(products));
        console.log('Метод getProducts:', catalog.getProducts());
        console.log('Метод getProductById (тест существующего ID):', firstProduct?.id, catalog.saveSelectedProductId(firstProduct?.id ?? ''));
        console.log('Метод getProductById (тест выдуманного ID):', catalog.saveSelectedProductId('111111111'));
        console.log('Метод saveProductById (ничего не возвращается)', catalog.saveSelectedProductId(firstProduct?.id ?? ''));
        console.log('Метод saveProductById (сохраняется ли ID после вызова):', catalog.getSelectedProductId());

        // Customer
        console.log('Тест Customer');
        const customer = new Customer();
        console.log('Метод getData (пустые значения по умолчанию):', customer.getData());
        console.log('Метод updateData (true при успехе):', customer.updateData('payment', 'card'));
        console.log('Метод updateData (true при успехе):', customer.updateData('address', 'Tested address'));
        console.log('Метод updateData (true при успехе):', customer.updateData('phone', '+7999999999'));
        console.log('Метод updateData (true при успехе):', customer.updateData('email', 'email@example.com'));
        console.log('Метод getData (после обновления атрибутов):', customer.getData());
        console.log('validateData (проверка валидных значений):', customer.validateData());
        customer.clearData();
        console.log('validateData (проверка пустых значений):', customer.validateData());
        customer.updateData('payment', 'card');
        customer.updateData('address', 'Tested address');
        customer.updateData('phone', '');
        customer.updateData('email', 'email@example.com');
        console.log('Метод validateData (телефон не указан):', customer.validateData());
        console.log('Метод clearData (ничего не возвращает):', customer.clearData());
        console.log('Метод getData (после вызова clearData):', customer.getData());

        // CatalogLoader
        console.log('Тест CatalogLoader');
        const api = new Api(API_URL);
        const loader = new CatalogLoader(api);
        try {
            const res: ProductListResponse = await loader.fetchProductList();
            console.log('Метод fetchProductList:', res);
        } catch (error) {
            console.log('fetchProductList с ошибкой:', error);
        }

        const orderData: OrderRequest = {
            payment: 'card',
            email: 'realemail@example.com',
            phone: '+79635728144',
            address: 'Biysk, Sovetskaya',
            total: (firstProduct?.price ?? 0) + (secondProduct?.price ?? 0),
            items: [firstProduct.id, secondProduct.id],
        };

        try {
            const res = await loader.sendData(orderData);
            console.log('Метод sendData:', res);
        } catch (error) {
            console.log('sendData с ошибкой:', error);
        }
    } catch (error) {
        console.log('Во время тестирования возникла ошибка: ', error)
    }
};

methodTest();