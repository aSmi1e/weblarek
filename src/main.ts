import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Customer } from './components/Models/Customer';

import { CatalogLoader } from './components/Services/CatalogLoader';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { API_URL } from './utils/constants';

import { Header } from './components/Views/Header';
import { GalleryView } from './components/Views/Gallery';
import { Modal } from './components/Views/Modal';
import { BasketView } from './components/Views/BasketView';

import { OrderFormView } from './components/Views/OrderForms';
import { ContactsFormView } from './components/Views/ContactsForms';

import { SuccessView } from './components/Views/Success';

import { CardBasket } from './components/Views/CardBasket';
import { CardCatalog } from './components/Views/CardCatalog';
import { CardPreview } from './components/Views/CardPreview';

import type { OrderRequest, ProductListResponse } from './types';

const events = new EventEmitter();

const catalogModel = new Catalog(events);
const cartModel = new Cart(events);
const customerModel = new Customer(events);

const api = new Api(API_URL);
const loader = new CatalogLoader(api);

const header = new Header(
    events,
    ensureElement<HTMLElement>('.header')
);

const gallery = new GalleryView(
    ensureElement<HTMLElement>('.gallery')
);

const modal = new Modal(
    events,
    ensureElement<HTMLElement>('#modal-container')
);

const basketView = new BasketView(
    events,
    cloneTemplate<HTMLDivElement>('#basket')
);

const orderFormView = new OrderFormView(
    events,
    cloneTemplate<HTMLFormElement>('#order')
);

const contactsFormView = new ContactsFormView(
    events,
    cloneTemplate<HTMLFormElement>('#contacts')
);

const successView = new SuccessView(
    events,
    cloneTemplate<HTMLDivElement>('#success')
);


const cardPreview = new CardPreview(
    cloneTemplate<HTMLDivElement>('#card-preview'),
    () => {
        events.emit('preview:toggle-cart');
    }
);

const renderCatalog = () => {
    const products = catalogModel.getProducts();

    const items = products.map((product) => {
        const card = new CardCatalog(
            cloneTemplate<HTMLButtonElement>('#card-catalog'),
            () => {
                events.emit('card:select', { id: product.id });
            }
        );

        return card.render({
            id: product.id,
            title: product.title,
            price: product.price,
            category: product.category as keyof typeof import('./utils/constants').categoryMap,
            image: product.image,
        });
    });

    gallery.render({ items });
};

const renderBasket = () => {
    const itemsInCart = cartModel.getSelectedProducts();

    const basketItems = itemsInCart.map((product, index) => {
        const item = new CardBasket(
            cloneTemplate<HTMLLIElement>('#card-basket'),
            () => {
                cartModel.deleteProduct(product);
            }
        );

        return item.render({
            id: product.id,
            title: product.title,
            price: product.price,
            index: index + 1,
        });
    });

    basketView.render({
        items: basketItems,
        total: cartModel.calculateTotalPrice(),
        empty: itemsInCart.length === 0,
    });
};

const renderPreview = () => {
    const productId = catalogModel.getSelectedProductId();
    if (!productId) return;

    const product = catalogModel.getProductById(productId);
    if (!product) return;

    const inCart = cartModel.checkProductInCart(product.id);

    const cardElement = cardPreview.render({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category as keyof typeof import('./utils/constants').categoryMap,
        image: product.image,
        description: product.description,
        buttonText: inCart ? 'Убрать из корзины' : 'В корзину',
        buttonDisabled: product.price === null,
    });

    modal.open(cardElement);
};

const updateHeaderCounter = () => {
    header.render({
        counter: cartModel.calculateTotalProductAmount(),
    });
};

events.on('card:select', ({ id }: { id: string }) => {
    catalogModel.saveSelectedProductId(id);
});

events.on('preview:toggle-cart', () => {
    const productId = catalogModel.getSelectedProductId();
    if (!productId) return;

    const product = catalogModel.getProductById(productId);
    if (!product) return;

    if (cartModel.checkProductInCart(product.id)) {
        cartModel.deleteProduct(product);
    } else {
        cartModel.addProduct(product);
    }

    modal.close();
});

events.on('catalog:change', () => {
    renderCatalog();
});

events.on('catalog:selected-change', () => {
    renderPreview();
});

events.on('cart:change', () => {
    renderBasket();
    updateHeaderCounter();
});

events.on('customer:change', () => {
    const data = customerModel.getData();
    const errors = customerModel.validateData();

    orderFormView.render({
        valid: !errors.payment && !errors.address,
        errors: errors.payment || errors.address || '',
        payment: data.payment,
        address: data.address,
    });

    contactsFormView.render({
        valid: !errors.phone && !errors.email,
        errors: errors.phone || errors.email || '',
        email: data.email,
        phone: data.phone,
    });
});

events.on('basket:open', () => {
    modal.open(basketView.render());
});

events.on('basket:order', () => {
    modal.open(orderFormView.render());
});

events.on('order:payment-change', ({ payment }: { payment: 'card' | 'cash' }) => {
    customerModel.updateData('payment', payment);
});

events.on('order:address-change', ({ address }: { address: string }) => {
    customerModel.updateData('address', address);
});

events.on('order:submit', () => {
    modal.open(contactsFormView.render());
});

events.on('contacts:email-change', ({ email }: { email: string }) => {
    customerModel.updateData('email', email);
});

events.on('contacts:phone-change', ({ phone }: { phone: string }) => {
    customerModel.updateData('phone', phone);
});

events.on('contacts:submit', async () => {
    const data = customerModel.getData();

    if (!data.payment) return;

    const order: OrderRequest = {
        payment: data.payment,
        email: data.email,
        phone: data.phone,
        address: data.address,
        total: cartModel.calculateTotalPrice(),
        items: cartModel.getSelectedProducts().map(p => p.id),
    };

    try {
        const response = await loader.sendData(order);

        successView.render({
            total: response.total,
        });

        modal.open(successView.render());

        cartModel.clearCart();
        customerModel.clearData();
    } catch (error) {
        console.error(
            'Ошибка при отправке заказа',
            error
        );
    }
});

events.on('success:close', () => {
    modal.close();
});

const runApp = async () => {
    header.render({ counter: 0 });

    try {
        const data: ProductListResponse = await loader.fetchProductList();
        catalogModel.saveProducts(data.items);
    } catch (error) {
        console.error('Не удалось загрузить каталог', error);
    }
};

runApp();