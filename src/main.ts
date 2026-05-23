import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Customer } from './components/Models/Customer';
import { CatalogLoader } from './components/Services/CatalogLoader';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Header } from './components/Views/Header';
import { GalleryView } from './components/Views/Gallery';
import { Modal } from './components/Views/Modal';
import { BasketView } from './components/Views/BasketView';
import { OrderFormView, ContactsFormView } from './components/Views/Forms';
import { SuccessView } from './components/Views/Success';
import { CardBasket, CardCatalog, CardPreview } from './components/Views/Card';
import type { OrderRequest, Product, ProductListResponse } from './types';

const events = new EventEmitter();

const catalogModel = new Catalog(events);
const cartModel = new Cart(events);
const customerModel = new Customer(events);

const api = new Api(API_URL);
const loader = new CatalogLoader(api);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new GalleryView(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));
const basketView = new BasketView(events, cloneTemplate<HTMLDivElement>('#basket'));
const orderFormView = new OrderFormView(events, cloneTemplate<HTMLFormElement>('#order'));
const contactsFormView = new ContactsFormView(events, cloneTemplate<HTMLFormElement>('#contacts'));
const successView = new SuccessView(events, cloneTemplate<HTMLDivElement>('#success'));

const renderCatalog = () => {
    const products = catalogModel.getProducts();
    const items = products.map((product) => {
        const card = new CardCatalog(
            events,
            cloneTemplate<HTMLButtonElement>('#card-catalog'),
            {
                onClick: () => {
                    events.emit('card:select', { id: product.id });
                }
            }
        );

        return card.render({
            title: product.title,
            price: product.price,
            category: product.category,
            image: product.image,
            id: product.id,
        });
    });
    gallery.render({ items });
};

const renderBasket = () => {
    const itemsInCart = cartModel.getSelectedProducts();
    const basketItems = itemsInCart.map((product, index) => {
        const item = new CardBasket(
            events,
            cloneTemplate<HTMLLIElement>('#card-basket'),
            {
                onDelete: () => {
                    events.emit('basket:item-remove', { id: product.id });
                }
            }
        );

        return item.render({
            title: product.title,
            price: product.price,
            index: index + 1,
            id: product.id,
        });
    });

    const basketElement = basketView.render({
        items: basketItems,
        total: cartModel.calculateTotalPrice(),
        empty: itemsInCart.length === 0,
    });

    modal.open(basketElement);
};

const renderPreview = (product: Product) => {
    const inCart = cartModel.checkProductInCart(product.id);

    const card = new CardPreview(
        events,
        cloneTemplate<HTMLDivElement>('#card-preview'),
        {
            onToggleCart: () => {
                events.emit('card:toggle-cart', { id: product.id });
            }
        }
    );

    const cardElement = card.render({
        title: product.title,
        price: product.price,
        category: product.category,
        image: product.image,
        description: product.description,
        inCart,
        id: product.id,
    });

    modal.open(cardElement);
};

const updateHeaderCounter = () => {
    header.render({ counter: cartModel.calculateTotalProductAmount() });
};

events.on('cart:change', () => {
    updateHeaderCounter();
});

events.on<{ id: string }>('card:select', ({ id }) => {
    const product = catalogModel.getProductById(id);
    if (product) {
        renderPreview(product);
    }
});

events.on<{ id: string }>('card:toggle-cart', ({ id }) => {
    const product = catalogModel.getProductById(id);
    if (!product) return;

    if (cartModel.checkProductInCart(id)) {
        cartModel.deleteProduct(product);
    } else {
        cartModel.addProduct(product);
    }
    renderPreview(product);
});

events.on('basket:open', () => {
    renderBasket();
});

events.on<{ id: string }>('basket:item-remove', ({ id }) => {
    const product = catalogModel.getProductById(id);
    if (product) {
        cartModel.deleteProduct(product);
        renderBasket();
    }
});

events.on('basket:order', () => {
    const data = customerModel.getData();
    const orderElement = orderFormView.render({
        valid: false,
        errors: '',
        payment: data.payment,
        address: data.address ?? '',
    });
    modal.open(orderElement);
});

events.on<{ payment: string }>('order:payment-change', ({ payment }) => {
    customerModel.updateData('payment', payment);
    const errors = customerModel.validateData();
    orderFormView.render({
        valid: !errors.payment && !errors.address,
        errors: errors.payment || errors.address || '',
        payment,
        address: customerModel.getData().address ?? '',
    });
});

events.on<{ address: string }>('order:address-change', ({ address }) => {
    customerModel.updateData('address', address);
    const errors = customerModel.validateData();
    orderFormView.render({
        valid: !errors.payment && !errors.address,
        errors: errors.payment || errors.address || '',
        payment: customerModel.getData().payment,
        address,
    });
});

events.on('order:submit', () => {
    const errors = customerModel.validateData();
    if (errors.payment || errors.address) {
        orderFormView.render({
            valid: false,
            errors: errors.payment || errors.address || '',
            payment: customerModel.getData().payment,
            address: customerModel.getData().address ?? '',
        });
        return;
    }
    const data = customerModel.getData();
    const contactsElement = contactsFormView.render({
        valid: false,
        errors: '',
        email: data.email ?? '',
        phone: data.phone ?? '',
    });
    modal.open(contactsElement);
});

events.on<{ email: string }>('contacts:email-change', ({ email }) => {
    customerModel.updateData('email', email);
    const errors = customerModel.validateData();
    contactsFormView.render({
        valid: !errors.phone && !errors.email,
        errors: errors.phone || errors.email || '',
        email,
        phone: customerModel.getData().phone ?? '',
    });
});

events.on<{ phone: string }>('contacts:phone-change', ({ phone }) => {
    customerModel.updateData('phone', phone);
    const errors = customerModel.validateData();
    contactsFormView.render({
        valid: !errors.phone && !errors.email,
        errors: errors.phone || errors.email || '',
        email: customerModel.getData().email ?? '',
        phone,
    });
});

events.on('contacts:submit', async () => {
    const errors = customerModel.validateData();
    if (errors.phone || errors.email) {
        contactsFormView.render({
            valid: false,
            errors: errors.phone || errors.email || '',
            email: customerModel.getData().email ?? '',
            phone: customerModel.getData().phone ?? '',
        });
        return;
    }

    const products = cartModel.getSelectedProducts();
    const order: OrderRequest = {
        payment: customerModel.getData().payment ?? 'card',
        email: customerModel.getData().email ?? '',
        phone: customerModel.getData().phone ?? '',
        address: customerModel.getData().address ?? '',
        total: cartModel.calculateTotalPrice(),
        items: products.map((product) => product.id),
    };

    try {
        const response = await loader.sendData(order);
        const successElement = successView.render({ total: response.total });
        modal.open(successElement);
        cartModel.clearCart();
        customerModel.clearData();
    } catch (error) {
        console.error('Ошибка при отправке заказа', error);
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
        renderCatalog();
    } catch (error) {
        console.error('Не удалось загрузить каталог', error);
    }
};

runApp();