# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

### Типы данных

#### Product
```typescript
type Product = {
    id: string;          // Уникальный идентификатор товара
    description: string; // Описание товара
    image: string;       // Путь к изображению
    title: string;       // Название товара
    category: string;    // Категория товара
    price: number | null;// Цена (null означает "Бесценно")
}

#### Класс Cart
Класс для хранения добавленных в корзину товаров.

Поля класса:  
`private selectedProducts: Product[]` - хранит массив товаров, добавленных в корзину.

Методы класса:  
`getSelectedProducts(): Product[]` - возвращает текущий список товаров в корзине.  
`addProduct(product: Product): void` - добавляет товар в корзину.  
`deleteProduct(product: Product): boolean` - удаляет товар из корзины по `id`. Возвращает `true`, если товар был удален, иначе `false`.  
`clearCart(): void` - очищает корзину.  
`calculateTotalPrice(): number` - возвращает суммарную стоимость товаров в корзине.  
`calculateTotalProductAmount(): number` - возвращает количество товаров в корзине.  
`checkProductInCart(id: string): boolean` - проверяет наличие товара в корзине по `id` и возвращает `true/false`.

#### Класс Catalog
Класс для хранения товаров в приложении.

Поля класса:  
`private productList: Product[]` - хранит массив всех товаров. Содержит объекты, соответствующие типу `Product`.  
`private selectedProductId: string | null` - хранит ID выбранного товара.

Методы класса:  
`saveProducts(products: Product[]): void` - сохраняет полученный список товаров.  
`getProducts(): Product[]` - возвращает список всех товаров.  
`getProductById(id: string): Product | null` - возвращает товар по его `id` или `null`, если товар не найден.  
`saveSelectedProductId(id: string): void` - сохраняет `id` выбранного товара.  
`getSelectedProductId(): string | null` - возвращает ID выбранного товара.

#### Класс Customer
Класс для хранения данных покупателя (телефон, адрес, способ оплаты).

Поля класса:  
`private payment: string | null` - выбранный способ оплаты.  
`private address: string | null` - адрес доставки.  
`private phone: string | null` - телефон покупателя.  
`private email: string | null` - email покупателя.

Методы класса:  
`updateData(key: CustomerDataKey, value: CustomerData[CustomerDataKey]): boolean` - обновляет значение поля покупателя по ключу. Возвращает `true`, если поле было обновлено, иначе `false`.  
`getData(): CustomerData` - возвращает объект с текущими данными покупателя.  
`clearData(): void` - сбрасывает все данные покупателя в null.  
`validateData(): ResultValidationType` - выполняется валидацию данных покупателя, которые хранятся в экземпляре класса (тип оплаты, адрес, телефон, электронная почта), и возвращает объект (`ResultValidationType`), где ключ — имя поля, значение — текст ошибки. Пустые или состоящие только из пробелов значения считаются ошибочными. Если ошибок нет — возвращается пустой объект.

### Слой коммуникации

#### Класс CatalogLoader
Класс для загрузки данных каталога и отправки данных заказа на сервер. Для выполнения запросов использует соответствующий интерфейсу `IApi` объект, передаваемый в конструктор.

Конструктор:  
`constructor(api: IApi)` - принимает объект `IApi` (экземпляр `Api` с `baseUrl` из `.env`).

Поля класса:  
`private api: IApi` - объект для выполнения запросов к серверу.

Методы класса:  
`fetchProductList(): Promise<ProductListResponse>` - GET запрос на эндпоинт `/product/` и возвращает список товаров.  
`sendData(data: OrderRequest, method: ApiPostMethods = 'POST'): Promise<OrderResponse>` - отправляет данные заказа на эндпоинт `/order/` и возвращает ответ сервера.

### Слой представления (View)

#### Класс Header
Представление шапки сайта, отображает логотип и кнопку корзины с текущим количеством товаров.

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)` - принимает брокер событий и корневой DOM‑элемент шапки.

Поля класса:  
`protected counterElement: HTMLElement` - элемент для отображения количества товаров в корзине.  
`protected basketButton: HTMLButtonElement` - кнопка открытия корзины.

Сеттеры и события:  
`set counter(value: number)` - обновляет текст счётчика корзины.  
При клике по кнопке корзины эмитит событие `basket:open` через брокер событий.

##### Абстрактный класс Card

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)` - принимает брокер событий и корневой DOM‑элемент карточки.

Поля класса:  
`protected _id: string` - идентификатор товара, связанный с карточкой.

Сеттеры и вспомогательные методы:  
`set id(value: string)` - сохраняет идентификатор товара и устанавливает `data-id` на DOM‑элементе.    
`protected formatPrice(value: number | null): string` - форматирует цену для отображения (`"Бесценно"` или `"<n> синапсов"`).  
`protected resolveImage(src: string): string` - формирует полный путь к изображению на основе `CDN_URL`.

##### Класс CardCatalog

Представление карточки товара в каталоге (шаблон `#card-catalog`).

Поля класса:  
`protected imageElement: HTMLImageElement` - изображение товара.  
`protected categoryElement: HTMLElement` - элемент категории.  
`protected titleElement: HTMLElement` - заголовок карточки.  
`protected priceElement: HTMLElement` - цена товара.

Сеттеры:  
`set title(value: string)` - устанавливает заголовок карточки.  
`set price(value: number | null)` - устанавливает текст цены, используя `formatPrice`.  
`set category(value: string)` - устанавливает текст категории и модификатор класса через `setCategory`.  
`set image(value: string)` - устанавливает изображение и `alt`‑текст через `setImage`.

События:  
При клике по карточке эмитит событие `card:select` с идентификатором товара.

##### Класс CardPreview

Представление карточки товара в модальном превью.

Поля класса:  
`protected imageElement: HTMLImageElement` - изображение товара.  
`protected categoryElement: HTMLElement` - элемент категории.  
`protected titleElement: HTMLElement` - заголовок товара.  
`protected descriptionElement: HTMLElement` - описание товара.  
`protected priceElement: HTMLElement` - цена товара.  
`protected buttonElement: HTMLButtonElement` - кнопка добавления/удаления из корзины.

Сеттеры:  
`set title(value: string)` - устанавливает заголовок.  
`set description(value: string)` - устанавливает описание.  
`set price(value: number | null)` - устанавливает текст цены.  
`set category(value: string)` - устанавливает категорию и её оформление.  
`set image(value: string)` - устанавливает изображение товара.  
`set inCart(value: boolean)` - обновляет текст кнопки в зависимости от того, находится ли товар в корзине.

События:  
При клике по кнопке эмитит событие `card:toggle-cart` с идентификатором товара.

##### Класс CardBasket

Представление строки товара в корзине.

Поля класса:  
`protected indexElement: HTMLElement` - порядковый номер товара в списке.  
`protected titleElement: HTMLElement` - название товара.  
`protected priceElement: HTMLElement` - цена товара.  
`protected deleteButton: HTMLButtonElement` - кнопка удаления товара из корзины.

Сеттеры:  
`set index(value: number)` - устанавливает порядковый номер позиции.  
`set title(value: string)` - устанавливает название товара.  
`set price(value: number | null)` - устанавливает текст цены.

События:  
При клике по кнопке удаления эмитит событие `basket:item-remove` с идентификатором товара.

#### Класс BasketView

Представление модального окна корзины.

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)` - принимает брокер событий и DOM‑элемент корзины.

Поля класса:  
`protected listElement: HTMLElement` - список товаров в корзине.  
`protected totalElement: HTMLElement` - элемент для отображения итоговой суммы.  
`protected submitButton: HTMLButtonElement` - кнопка перехода к оформлению.

Сеттеры:  
`set items(value: HTMLElement[])` - заменяет содержимое списка корзины.  
`set total(value: number)` - обновляет отображение итоговой суммы.  
`set empty(value: boolean)` - включает/выключает кнопку оформления в зависимости от того, пуста ли корзина.

События:  
При клике по кнопке оформления эмитит событие `basket:order`.

#### Класс Modal

Представление модального окна.

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)` - принимает брокер событий и корневой DOM‑элемент модалки.

Поля класса:  
`protected contentContainer: HTMLElement` - контейнер для содержимого модального окна.  
`protected closeButton: HTMLButtonElement` - кнопка закрытия модалки.

Сеттеры и методы:  
`set content(value: HTMLElement | null)` - заменяет содержимое модального окна.  
`open(content: HTMLElement)` - устанавливает содержимое, добавляет модификатор `modal_active` и эмитит событие `modal:open`.  
`close()` - убирает модификатор `modal_active`, очищает содержимое и эмитит событие `modal:close`.


##### Абстрактный класс FormView

Конструктор:  
`constructor(events: IEvents, container: HTMLFormElement)` - принимает брокер событий и DOM‑элемент формы.

Поля класса:  
`protected formElement: HTMLFormElement` - сама форма.  
`protected submitButton: HTMLButtonElement` - кнопка отправки формы.  
`protected errorsElement: HTMLElement` - контейнер для текстов ошибок.

Сеттеры:  
`set valid(value: boolean)` - включает или выключает кнопку отправки (делает форму доступной/недоступной).  
`set errors(value: string)` - обновляет текст ошибок под формой.

Методы:  
`protected abstract onSubmit(): void` - абстрактный метод, вызываемый при отправке формы. Конкретные формы реализуют его и генерируют соответствующие события через брокер.

##### Класс OrderFormView

Представление формы выбора способа оплаты и адреса доставки (шаблон `#order`).

Поля класса:  
`protected buttonCard: HTMLButtonElement` - кнопка выбора оплаты картой.  
`protected buttonCash: HTMLButtonElement` - кнопка выбора оплаты наличными.  
`protected addressInput: HTMLInputElement` - поле ввода адреса.

Сеттеры:  
`set payment(value: string | null)` - визуально отмечает выбранный способ оплаты (управляет модификатором `button_alt-active`).  
`set address(value: string)` - заполняет поле адреса.

События:  
При нажатии на кнопки оплаты вызывает внутренний метод и эмитит событие `order:payment-change`.  
При вводе адреса эмитит событие `order:address-change`.  
При отправке формы эмитит событие `order:submit`.

##### Класс ContactsFormView

Представление формы с контактными данными.

Поля класса:  
`protected emailInput: HTMLInputElement` - поле ввода email.  
`protected phoneInput: HTMLInputElement` - поле ввода телефона.

Сеттеры:  
`set email(value: string)` - заполняет поле email.  
`set phone(value: string)` - заполняет поле телефона.

События:  
При вводе email эмитит событие `contacts:email-change`.  
При вводе телефона эмитит событие `contacts:phone-change`.  
При отправке формы эмитит событие `contacts:submit`.

#### Класс SuccessView

Представление содержимого модального окна успешного оформления заказа (шаблон `#success`).

Поля класса:  
`protected descriptionElement: HTMLElement` - текст с суммой списанных «синапсов`.  
`protected closeButton: HTMLButtonElement` - кнопка закрытия окна.

Сеттеры:  
`set total(value: number)` - устанавливает текст `"Списано N синапсов"` в зависимости от суммы заказа.

События:  
При клике по кнопке закрытия эмитит событие `success:close`.

#### Класс GalleryView

Представление галереи карточек товаров.

Сеттеры:  
`set items(value: HTMLElement[])` - заменяет содержимое галереи переданным массивом карточек, полностью перерисовывая список товаров.