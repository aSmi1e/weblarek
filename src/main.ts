import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Customer } from './components/Models/Customer';
import { CatalogBase } from './components/base/CatalogBase';
import { API_URL } from './utils/constants';
import type { Product } from './types';

const products: Product[] = apiProducts.items;
const firstProduct = products[0];
const secondProduct = products[1];

const Testing = async () => {
try {
    // Cart
    console.log('Cart тестирование');
    const cart = new Cart();
    console.log('Метод getSelectedProducts (должно быть пусто):', cart.getSelectedProducts());
    cart.addProduct(firstProduct);
    console.log('Метод getSelectedProducts (после добавления одного продукта):', cart.getSelectedProducts());
    cart.addProduct(secondProduct);
    console.log('Метод getSelectedProducts (после добавления двух продуктов):', cart.getSelectedProducts());
    console.log('Метод checkProductInCart(first):', cart.checkProductInCart(firstProduct.id));
    console.log('Метод calculateTotalProductAmount:', cart.calculateTotalProductAmount());
    console.log('Метод calculateTotalPrice:', cart.calculateTotalPrice());
    console.log('Метод deleteProduct (ожидаем true):', cart.deleteProduct(firstProduct));
    console.log('Метод deleteProduct (ожидаем false):', cart.deleteProduct(firstProduct));
    console.log('Метод getSelectedProducts (ожидаем один продукт):', cart.getSelectedProducts());
    cart.clearCart();
    console.log('Метода clearCart. Проверка очистилась ли корзина:', cart.getSelectedProducts());
    console.log('Метод checkProductInCart (после очистки ожидается null):', cart.checkProductInCart(firstProduct?.id));

    // Catalog
    console.log('Catalog тест');
    const catalog = new Catalog();
    console.log('Метод saveProducts:', catalog.saveProducts(products));
    console.log('Метод getProducts:', catalog.getProducts());
    console.log('Метод getProductById (проверка существующего ID):', firstProduct?.id, catalog.getProductById(firstProduct?.id ?? ''));
    console.log('Метод getProductById (проверка рандомного ID):', catalog.getProductById('123456789'));
    console.log('Метод saveProductById - сохраняем по ID (ничего не возвращает)', catalog.saveProductById(firstProduct?.id ?? ''));
    console.log('Метод saveProductById - сохранился ли ID в атрибуте после вызова метода', catalog._selectedProductId);

    // Customer
    console.log('Customer тест');
    const customer = new Customer();
    console.log('Метод getData (пустые значения):', customer.getData());
    console.log('updateData, в случае успеха возвращает true:', customer.updateData('_paymentType', 'card'));
    console.log('updateData, в случае успеха возвращает true:', customer.updateData('_address', 'Test address'));
    console.log('updateData, в случае успеха возвращает true:', customer.updateData('_phone', '+7999999999'));
    console.log('updateData, в случае успеха возвращает true:', customer.updateData('_email', 'test@example.com'));
    console.log('Метод getData (после обновления атрибутов):', customer.getData());
    console.log('validateData (валидные данные):', customer.validateData({
        paymentType: 'card',
        address: 'Test address',
        phone: '+7999999999',
        email: 'test@example.com',
    }));
    console.log('validateData (пустые значения):', customer.validateData({
        paymentType: '',
        address: '',
        phone: '',
        email: '',
    }));
    console.log('validateData (не указан номер телефона):', customer.validateData({
        paymentType: 'card',
        address: 'Test address',
        phone: '',
        email: 'test@example.com',
    }));
    console.log('Метод clearData (ничего не возвращает):', customer.clearData());
    console.log('Метод getData (после вызова clearData):', customer.getData());

// CatalogBase
    console.log('CatalogBase тест');
    const loader = new CatalogBase();
    try {
        const res = await loader.fetchData<{ total: number; items: Product[] }>();
        console.log('Метод fetchData:', res);
    } catch (error) {
        console.log('fetchData с ошибкой:', error);
    }

    const orderData = {
        payment: 'card',
        email: 'aSmi1e@example.com',
        phone: '+79635728100',
        address: 'Biysk, Sovetskaya',
        total: (firstProduct.price ?? 0) + (secondProduct.price ?? 0),
        items: [firstProduct.id, secondProduct.id],
    };

    try {
        const res = await loader.sendData<object>(orderData);
        console.log('Метод sendData:', res);
    } catch (error) {
        console.log('sendData с ошибкой:', error);
    }
} catch (error) {
    console.log('Возникла ошибка при тестировании: ', error)
}
};
Testing();