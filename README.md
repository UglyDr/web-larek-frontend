# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
Приложение реализовано по MVP архитектуре и состоит из классы моделей и классов представления. В приложении используется событийно-ориентированный подход. 

 #### Класс Api +
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и объект с заголовками запросов.
Методы класса:
- `get` — выполняет GET-запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер;
- `post` — принимает объект с данными, которые будут переданы в JSON-формате в теле запроса, и отправляет эти данные на ендпоинт, переданный как параметр при вызове метода. По умолчанию выполняется POST-запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter +

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в Presenter для обработки событий и в слоях приложения для генерации событий.

- `on` — подписка на событие;
- `emit — инициализация события;
- `trigger` — возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

### Слой Model

#### Класс Model +

Класс отвечает за механизм уведомлений об изменениях с использованием брокера событий

Методы класса:

-`emitChanges(event: string, payload?: object)` — уведомляет всех подписчиков об изменениях в модели, отправляя событие с указанным именем и данными

#### Класс ApiClient 

Класс отвечает за управление запросами к серверу

Поля класса:

- `readonly cdm`: sting — базовый URL сервера для API.

Методы класса:

- `getProducts(): Promise<IProduct[]>` — получает список продуктов с API, добавляет URL изображений из CDN.
- `getProductById(id: string): Promise<IProduct>` — получает данные продукта по его ID, добавляет URL изображения из CDN.
- `postOrder(order: IOrder): Promise<TSuccessData>` — отправляет заказ на сервер и возвращает данные успешного ответа.

#### Класс ProductModel +

Класс отвеяает за работу с данными, полученными с сервера

Поля класса:

- `_productCards` : Product[] — хранит список карточек товаров

Методы класса:

- `get productCards()` — возвращает текущий массив товаров
- `set productCards(data: Product[])` — устанавливает новый массив товаров и уведомляет другие части приложения о том, что данные обновлены
- `getCard(productId: string)` : IProduct | undefined— возвращает карточку продукта по заданному идентификатору. Если продукт не найден, выбрасывает ошибку

#### Класс OrderModel +

Класс отвечает за управление информацией о заказах

Поля класса:

- `_paymentInfo`: formOfPayment — информация об оплате.
- `_contactInfo` : formOfContacts — контактная информация пользователя
- `formErrors` : formErrors — объект для хранения ошибок формы

Методы класса:

- `clearOrder()` - очищает информацию об оплате, устанавливая пустой адрес и null в методе оплаты.
- `clearUserContacts()` - очищает контактную информацию пользователя, устанавливая пустые строки для email и телефона.
- `checkValidation()` - проверяет валидность данных заказа, заполняет объект formErrors при наличии ошибок 
- `set paymentInfo(info: formOfPayment)` - устанавливает информацию об оплате и проверяет валидность данных.
- `get paymentInfo()` - возвращает текущую информацию об оплате.
- `set contactInfo(info: formOfContacts)` - устанавливает контактную информацию и проверяет валидность данных.
- `get contactInfo()` - возвращает текущую контактную информацию.



### Класс BasketModel  +
 Класс расширяет класс Model и отвечает за управление данными корзины продуктов

Поля класса:

- 'basketCard' : Product[] — Массив с карточками, добавленными в карзину.
- `total` : number — Общая стоимость продуктов в корзине

Методы класса:
- 'basketTotal()' — Метод для подсчета общего колличества товаров в карзине.
- `removeBasketItem()` — Удаляет товар из корзины по идентификатору.
- `getProductIdsInBasket()` — возвращает массив идентификаторов продуктов в корзине.
- `addProductInBasket(product: IProduct)` —  добавляет продукт в корзину, если его там еще нет
- `isInBasket` — Метод предназначен для проверки, находится ли товар с указанным id в корзине
- `clearBasket()` — Очищает корзину
- `get basketCard()` — возвращает текущий массив продуктов в корзине
- `set basketCard()` — устанавливает массив продуктов в корзине
- `getProductsInBasket()` — возвращает массив продуктов, находящихся в корзине

### Слой View

Классы отвечают за отображение данных в соответствующих элементах интерфейса

#### Класс Component +

Класс для всех компонентов, предоставляющий основные инструменты для работы с DOM.

Методы класса:
 
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` — Переключает наличие CSS-класса className у элемента element. force - если указано, принудительно добавляет (true) или удаляет (false) класс
- `setText(element: HTMLElement, value: unknown)` — Устанавливает текстовое содержимое элемента element значением value
- `setDisabled(element: HTMLElement, state: boolean)` — Устанавливает состояние блокировки элемента element.
- `setHidden(element: HTMLElement)` — Скрывает элемент element (устанавливает display: none)
- `setVisible(element: HTMLElement)` — Показывает элемент element (удаляет свойство display)
- `setImage(element: HTMLImageElement, src: string, alt?: string)` — Устанавливает источник изображения src и альтернативный текст alt для элемента element
- `render(data?: Partial<T>)` — Обновляет свойства компонента значениями из объекта data и возвращает корневой DOM-элемент

#### Класс Form +

Отвечает за общую функциональность для работы с HTML формами.

Поля класса:

- `inputAll` : HTMLInputElement[] — массив всех полей ввода формы
- `buttonSubmit` : HTMLButtonElement — кнопка отправки формы
- `formErrors` : HTMLElement — элемент для отображения ошибок формы.

Методы класса:

- `set valid()` — сеттер для управления состоянием кнопки отправки
- `set errors(value: string)` — устанавливает текст ошибок
- `render()` — возвращает корневой элемент формы для последующего рендера


#### Класс Card +

Отвечает за отображение карточки товара, включая название, изображение, цену и категорию. Класс используется для отображения товаров на странице сайта и для открытия модального окна с деталями товара при нажатии на карточку. Так же отвечает за создание экземпляра карточки из шаблона для показа карточки в корзине.

Поля класса:

- `_id` : string  — идентификатор товара
- `_title` : HTMLHeadingElement — элемент заголовка товара
- `_price` : HTMLSpanElement — элемент цены товара
- `_image` : HTMLImageElement — элемент изображения товара
- `_category` : HTMLSpanElement — элемент категории товара
- `_description` : HTMLParagraphElement — элемент опписания товара
- `button` : HTMLButtonElement — Кнопка взаимодействия
- `_index` : HTMLSpanElement — элемент индекса товара


Методы класса:
- `categoryClass(name: string)` — возвращает CSS-класс для категории товара в зависимости от названия категории.
- `set category(category: string)` — устанавливает категорию товара и обновляет соответствующий элемент в DOM.
- `set index(index: number)` — устанавливает индекс товара и обновляет соответствующий элемент в DOM
- `set id(id: string)` — устанавливает идентификатор товара
- `set title(title: string)` — устанавливает заголовок
- `set price(price: string)` — устанавливает цену товара
- `set description(description: string)` — устанавливает описание
- `set image(src: string)` — устанавливает изображение
- `set inBasket(state: boolean)` — обновляет текст кнопки 

#### Класс CardsContainer +

Отвечает за отображение блока с карточками товаров на главной странице. Класс управляет размещением карточек в указанном контейнере.

Поля класса:

- `catalog` : HTMLElement — элемент для отображения каталога товаров.
- `wrapper` : HTMLElement — элемент обертки страницы.
- `basket` : HTMLButtonElement — кнопка для открытия корзины.
- `counter` : HTMLSpanElement — элемент для отображения счетчика товаров в корзине.


Методы класса:

- `set locked(value: boolean)` — Устанавливает или снимает блокировку страницы
- `set catalog(cards: HTMLElement[])` — Обновляет содержимое каталога товаров
- `set counter(value: number)` — Обновляет значение счетчика товаров в корзине

#### Класс Modal +

Класс отвечает за управление модальным окном на странице.

Поля класса:

- `closeButton` : HTMLButtonElement — кнопка закрытия модального окна
- `content` : HTMLDivElement — контейнер для содержимого модального окна

Методы класса:

- `open()` — Метод для открытия модального окна. 
- `close()` — Метод для закрытия модального окна.
- `handleEsc()` — Обрабатывает нажатие клавиши Escape для закрытия модального окна
- `render(obj: HTMLElement)` : HTMLElement — Заменяет содержимое контейнера content элементом obj


#### Класс Basket +
 Отвечает за отображение и управление корзиной товаров.

Поля класса:

- `cartItems` : HTMLUListElement | null — элемент списка товаров, добавленных в корзину.
- `totalPrice` : HTMLSpanElement — Общая сумма заказа, рассчитанная на основе цен товаров в корзине.
- `button` : HTMLButtonElement — кнопка для оформления заказа.

Методы класса:
 
- `set list(cards: HTMLElement[])` — Устанавливает список товаров в корзине, заменяя содержимое элемента списка.

- `set total(total: number)` — Устанавливает общую стоимость товаров в корзине

#### Класс OrderPaymentForm +
 Отвечает за взаимодействие и управление формой выбора способа оплаты и добавления адреса доставки

Поля класса:

- `protected containerButtons` : HTMLDivElement — контейнер для кнопок выбора способа оплаты.
- `protected buttonCard` : HTMLButtonElement — кнопка выбора оплаты картой.
- `protected buttonCash` : HTMLButtonElement — кнопка выбора оплаты наличными.
- `protected inputAddress` : HTMLInputElement — поле ввода адреса.
- `protected orderButtonElement` : HTMLButtonElement — кнопка отправки заказа.
- `protected _payment` : TPayment | null — выбранный способ оплаты.

Методы класса:

- `set address(value: string)` — устанавливает значение адреса в поле ввода.
- `get address(): string` — возвращает текущее значение адреса из поля ввода.
- `get payment()` — возвращает текущий выбранный способ оплаты.
- `protected set payment(value: TPayment | null)` — устанавливает выбранный способ оплаты и обновляет стили кнопок.

- `private handlePaymentButtonClick(event: MouseEvent)` — обработчик нажатия на кнопки выбора способа оплаты. Устанавливает выбранный способ оплаты и вызывает событие валидации формы.


#### Класс OrderContactsForm +

Отвечает за взаимодействие и управление формой контактов. Позволяет ввести почту и телефон покупателя.

Поля класса:

- `protected inputEmail` : HTMLInputElement — поле ввода электронной почты.
- `protected inputPhone` : HTMLInputElement — поле ввода номера телефона.

Методы класса:

- `set phone(value: string)` — устанавливает значение номера телефона в поле ввода.
- `get phone(): string` — возвращает текущее значение номера телефона из поля ввода.
- `set email(value: string)` — устанавливает значение электронной почты в поле ввода.
- `get email(): string` — возвращает текущее значение электронной почты из поля ввода.


#### Класс SuccessModal
Отвечает за отображение и управление модальным окном успешного завершения заказа. Отображает итоговую сумму заказа.

Поля класса:

- `protected _total` : HTMLParagraphElement — элемент для отображения общей суммы, списанной за заказ.
- `protected buttonOrderSuccess` : HTMLButtonElement — кнопка для закрытия модального окна успешного завершения заказа.

Методы класса:

- `set total(value: string)` — устанавливает текстовое значение общей суммы, списанной за заказ.

- `private setText(element: HTMLElement, text: string)` — устанавливает текстовое содержание элемента.


