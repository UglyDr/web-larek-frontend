export interface Product{
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price?: number;
}


export interface IProductModel {
    productsCards: Product[];
    getCard(id: string): Product | undefined;
}

export interface IBasketData {
    basketCard: Product[];

	addProductInBasket(product: Product): void;
	removeBasketItem(id: string): void;
	clearBasket(): void;
	basketTotal(): number;
	isInBasket(productId: string): boolean;
	getProductsInBasket(): Product[];
	getProductIdsInBasket(): string[];
}

export interface IBasketView {
	list: HTMLElement[] | null;
	total: number;
}

export type TPayment = 'card' | 'cash';

export interface IOrder {
	methodOfPayment: TPayment;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;
}

export type formOfContacts = Pick<IOrder, 'email' | 'phone'>;

export type formOfPayment = Pick<IOrder, 'methodOfPayment' | 'address' | null>;

export interface IOrderData {
 paymentInfo: formOfPayment;
	contactInfo: formOfContacts;
	clearOrder(): void;
	clearUserContacts(): void;
	checkValidation(): boolean;
}

export type formErrors = Partial<Record<keyof IOrder, string>>;

export enum errorStatus {
	EmptyEmail = 'Укажите почту',
	EmptyPhone = 'Укажите телефон',
	EmptyAddress = 'Укажите адрес',
	EmptyPayment = 'Выберите способ оплаты',
}

export interface ICard {
    id: string;
	index: number;
	description: string;
	image: string;
	inBasket: boolean;
	title: string;
	category: string;
	price: number | null;
}

export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}

export interface IPage {
    catalog: HTMLElement[];
	counter: number;
	locked: boolean;
}

export interface IForm {
	valid: boolean;
	errors: string;
}

export type TForm = { valid: boolean };

export interface IFormOfPayment {
	payment: TPayment | null;
	address: string;
}

export type TModalFormOfPayment = Pick<IOrder, 'methodOfPayment' | 'address' | null>;

export interface IFormOfContact {
	email: string;
	phone: string;
}

export type TModalFormOfContacts = Pick<IOrder, 'email' | 'phone'>;

export interface ISuccessView {
	total: string;
}

export type TSuccessData = { id: string; total: string };

export interface IAppApi {
	getProducts(): Promise<Product[]>;
	getProductById(id: string): Promise<Product>;
	postOrder(order: IOrder): Promise<TSuccessData>;
}

export type TModalSuccess = Pick<IBasket, 'getQuantity'>;

export interface IBasket {
	purchases: ICard[];
	// total: number;
	addPurchase(value: ICard): void;
	deletePurchase(id: string): void;
	clearBasket(): void;
	getQuantity(): number;
	getTotal(): number;
	getIdList(): string[];
}