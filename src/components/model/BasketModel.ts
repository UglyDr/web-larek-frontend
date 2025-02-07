import { Model } from './Model';
import { IEvents } from '../base/events';
import { IBasketData, Product } from '../../types';

/*export class BasketModel extends Model implements IBasketData {
    protected _basketCard: Product[];
    protected _total: number;

    constructor (protected events: IEvents) {
        super(events);
        this.clearBasket;
    }

    basketTotal() {
        return this._basketCard.reduce((res, current) => {
            return res + current.price;
        },0)
    }

    getProductIdsInBasket() {
        return this.basketCard
        .filter((card) => card.price > 0)
        .map((card) => card.id)
    }

    getProductsInBasket() {
        return this.basketCard.filter((item) => this.isInBasket(item.id))
    }

    addProductInBasket(product: Product) {
        if (!this.isInBasket(product.id)) {
            this.basketCard = [...this.basketCard, product];
        }
    }

    isInBasket(productId: string) {
		const cardId = this._basketCard.find(
			(product) => product.id === productId
		);
		return cardId !== undefined;
	}


    removeBasketItem(id: string) {
        this.basketCard = this.basketCard.filter((cards) => cards.id !== id);
    }

    clearBasket() {
        this.basketCard = [];
        this._total = 0;
    }

    get basketCard() {
		return this._basketCard;
	}

    get total() {
		return this.basketCard.reduce((res, current) => {
			return res + current.price;
		}, 0);
	}

    protected set basketCard(basketCard: Product[]) {
		this._basketCard = basketCard;
		this.events.emit('basket:changed', this.basketCard)
    }


}
*/

export class BasketModel extends Model implements IBasketData {
	protected _basketCard: Product[];
	protected _total: number;

	constructor(protected events: IEvents) {
		super(events);
		this.clearBasket();
	}

	basketTotal() {
		return this.basketCard.reduce((res, current) => {
			return res + current.price;
		}, 0);
	}

	getProductIdsInBasket(): string[] {
		return this.basketCard
			.filter((card) => card.price > 0)
			.map((card) => card.id);
	}

	get total() {
		return this.basketCard.reduce((res, current) => {
			return res + current.price;
		}, 0);
	}
	// сеттер total???

	isInBasket(productId: string) {
		const cardId = this.basketCard.find((product) => product.id === productId);
		return cardId !== undefined;
	}

	getProductsInBasket(): Product[] {
		return this.basketCard.filter((item) => this.isInBasket(item.id));
	}

	addProductInBasket(product: Product) {
		if (!this.isInBasket(product.id)) {
			this.basketCard = [...this.basketCard, product];
		}
	}

	removeBasketItem(id: string) {
		this.basketCard = this.basketCard.filter((cards) => cards.id !== id);
	}

	clearBasket() {
		this.basketCard = [];
		this._total = 0;
	}

	get basketCard() {
		return this._basketCard;
	}

	protected set basketCard(basketCard: Product[]) {
		this._basketCard = basketCard;
		this.events.emit('basket:changed', this.basketCard);
	}
}
