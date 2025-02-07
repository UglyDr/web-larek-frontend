import { Product,IProductModel } from "../../types";
import { Model } from "./Model";
import { IEvents } from "../base/events";

export class ProductModel extends Model implements IProductModel {

    protected _productsCards: Product[];


    constructor(events: IEvents) {
        super(events);
        this._productsCards = [];
    }

    set productsCards(data: Product[]) {
        this._productsCards = data;
        this.events.emit(`cards:changed`, this._productsCards);
    }

    get productsCards() {
        return this._productsCards;
    }

    getCard(productId: string): Product | undefined {
        const product = this._productsCards.find((card) => card.id === productId);
        if(!product) throw Error (`Product with id ${productId} not found`)
        return product
    }

}