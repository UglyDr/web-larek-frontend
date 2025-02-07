import { IEvents } from "../base/events";
import { cloneTemplate,ensureElement } from "../../utils/utils";
import { Component } from "./Component";
import { IBasketView } from "../../types";

export class Basket extends Component<IBasketView> {
    protected cartItems: HTMLUListElement | null;
    protected totalPrice: HTMLSpanElement;
	protected button: HTMLButtonElement;

	constructor(
		protected template: HTMLTemplateElement,
		protected events: IEvents
	) {
		super(cloneTemplate(template), events);

		this.cartItems = ensureElement<HTMLUListElement>(
			'.basket__list',
			this.container
		);
		this.totalPrice = ensureElement<HTMLSpanElement>(
			'.basket__price',
			this.container
		);
		this.button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.button.addEventListener('click', () =>
			this.events.emit('basket:submit')
		);
	}

	set list(cards: HTMLElement[]) {
		this.cartItems.replaceChildren(...cards);
	}

	set total(total: number) {
		this.setText(this.totalPrice, String(total) + ' синапсов');
    this.setDisabled(this.button, total <= 0);
	}


}

