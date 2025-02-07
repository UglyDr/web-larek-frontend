import './scss/styles.scss';
import { Modal } from './components/view/Modal';
import { SuccessModal } from './components/view/SuccessModal';
import { OrderContactsForm } from './components/view/OrderContactsForm';
import { OrderPaymentForm } from './components/view/OrderPaymentForm';
import { OrderModel } from './components/model/OrderModel';
import { Basket } from './components/view/Basket';
import { BasketModel } from './components/model/BasketModel';
import { Card } from './components/view/Card';
import { Product, ICard, IOrder } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ApiClient } from './components/model/ApiClient';
import { EventEmitter } from './components/base/events';
import { ProductModel } from './components/model/ProductData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardsContainer } from './components/view/CardsContainer';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const templateCardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const templateCardBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const templateBasket = ensureElement<HTMLTemplateElement>('#basket');
const templatePayment = ensureElement<HTMLTemplateElement>('#order');
const templateContacts = ensureElement<HTMLTemplateElement>('#contacts');
const templateSuccess = ensureElement<HTMLTemplateElement>('#success');

const containerPage = ensureElement<HTMLElement>('.page');
const containerModal = ensureElement<HTMLDivElement>('#modal-container');

const events = new EventEmitter();
const api = new ApiClient(CDN_URL, API_URL);

const productModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

const cardsContainer = new CardsContainer(containerPage, events);
const modal = new Modal(containerModal, events);
const basket = new Basket(templateBasket, events);
const orderPaymentForm = new OrderPaymentForm(
	cloneTemplate(templatePayment),
	events
);
const orderContactsForm = new OrderContactsForm(
	cloneTemplate(templateContacts),
	events
);
const successModal = new SuccessModal(templateSuccess, events);

events.onAll((event) => {
	console.log('event: ', event);
});

events.on('modal:open', () => {
	cardsContainer.locked = true;
});

events.on('modal:close', () => {
	cardsContainer.locked = false;
});

api
	.getProducts()
	.then((data) => {
		productModel.productsCards = data;
	})
	.catch(console.error);

events.on('cards:changed', (cards: Product[]) => {
	cardsContainer.catalog = cards.map((product) =>
		new Card(cardCatalogTemplate, events, {
			onClick: () => events.emit('preview:selected', product),
		}).render({
			...product,
		})
	);
});

events.on('preview:selected', (product: ICard) => {
	modal.render(
		new Card(templateCardPreview, events, {
			onClick: () => events.emit('preview:submit', product),
		}).render({
			...product,
			inBasket: basketModel.isInBasket(product.id),
		})
	);
	modal.open();
});

events.on('preview:submit', (product: ICard) => {
	if (basketModel.isInBasket(product.id)) {
		basketModel.removeBasketItem(product.id);
		modal.render(
			new Card(templateCardPreview, events, {
				onClick: () => events.emit('preview:submit', product),
			}).render({
				...product,
				inBasket: basketModel.isInBasket(product.id),
			})
		);
	} else {
		basketModel.addProductInBasket(product);
		modal.render(
			new Card(templateCardPreview, events, {
				onClick: () => events.emit('preview:submit', product),
			}).render({
				...product,
				inBasket: basketModel.isInBasket(product.id),
			})
		);
	}
});

events.on('basket:changed', () => {
	cardsContainer.counter = basketModel.basketCard.length;
});

events.on('basket:delete', (data: Product) => {
	basketModel.removeBasketItem(data.id);
	modal.render(
		basket.render({
			total: basketModel.basketTotal(),
			list: basketModel.basketCard.map((product: Product, index: number) => {
				const card = new Card(templateCardBasket, events, {
					onClick: () => events.emit('basket:delete', product),
				});
				return card.render({
					title: product.title,
					id: product.id,
					price: product.price,
					index: ++index,
				});
			}),
		})
	);
});

events.on('basket:open', () => {
	modal.render(
		basket.render({
			total: basketModel.basketTotal(),
			list: basketModel.basketCard.map((product: Product, index: number) => {
				const card = new Card(templateCardBasket, events, {
					onClick: () => events.emit('basket:delete', product),
				});
				return card.render({
					title: product.title,
					id: product.id,
					price: product.price,
					index: ++index,
				});
			}),
		})
	);
	modal.open();
});

events.on('basket:submit', () => {
	orderModel.clearOrder();
	modal.render(
		orderPaymentForm.render({ valid: false, ...orderModel.paymentInfo })
	);
});

events.on('order:valid', () => {
	orderModel.paymentInfo = {
		methodOfPayment: orderPaymentForm.payment,
		address: orderPaymentForm.address,
	};
});

events.on('contacts:valid', () => {
	orderModel.contactInfo = {
		email: orderContactsForm.email,
		phone: orderContactsForm.phone,
	};
});

events.on('order:submit', () => {
	orderModel.clearUserContacts();
	modal.render(
		orderContactsForm.render({ valid: false, ...orderModel.contactInfo })
	);
});

events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { methodOfPayment, address, email, phone } = errors;
	orderPaymentForm.valid = !methodOfPayment && !address;
	orderContactsForm.valid = !email && !phone;
	orderPaymentForm.errors = Object.values({ methodOfPayment, address })
		.filter((i) => !!i)
		.join(';  ');
	orderContactsForm.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join(';  ');
});

events.on('contacts:submit', () => {
	const order: IOrder = {
		methodOfPayment: orderModel.paymentInfo.methodOfPayment,
		address: orderModel.paymentInfo.address,
		email: orderModel.contactInfo.email,
		phone: orderModel.contactInfo.phone,
		items: basketModel.getProductIdsInBasket(),
		total: basketModel.total,
	};

	const orderForServer = {
		...order,
		payment: order.methodOfPayment,
	};

	delete orderForServer.methodOfPayment;
	console.log(basketModel.getProductIdsInBasket());
	console.log(basketModel.total);

	api
		.postOrder(orderForServer)
		.then((result) => {
			orderModel.clearOrder();
			orderModel.clearUserContacts();
			basketModel.clearBasket();

			modal.render(successModal.render(result));
		})
		.catch((e) => console.error(e));
});

events.on('success:submit', () => {
	modal.close();
});
