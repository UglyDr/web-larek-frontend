import { IFormOfPayment, TModalFormOfPayment, TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../base/events";

export class OrderPaymentForm extends Form<TModalFormOfPayment> implements IFormOfPayment
{
	protected containerButtons: HTMLDivElement;
	protected buttonCard: HTMLButtonElement;
	protected buttonCash: HTMLButtonElement;
	protected inputAddress: HTMLInputElement;
	protected orderButtonElement: HTMLButtonElement;
	protected _payment: TPayment | null;

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.containerButtons = ensureElement<HTMLDivElement>(
			'.order__buttons',
			container
		);
		this.inputAddress = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;
		this.buttonCard = this.container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this.buttonCash = this.container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;
		this.orderButtonElement = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.container
		);

		this.orderButtonElement.addEventListener('click', (evt) => {
			evt.preventDefault();
			events.emit('order:submit', {
				address: this.inputAddress.value,
				payment: this.payment,
			});
		});

		this.buttonCard.addEventListener(
			'click',
			this.handlePaymentButtonClick.bind(this)
		);
		this.buttonCash.addEventListener(
			'click',
			this.handlePaymentButtonClick.bind(this)
		);
	}

	private handlePaymentButtonClick(event: MouseEvent) {
		const button = event.target as HTMLButtonElement;
		this.payment = button.name as TPayment;
		this.events.emit(`${this.container.name}:valid`);
	}


	set address(value: string) {
		this.inputAddress.value = value;
	}

	get address(): string {
		return this.inputAddress.value;
	}



	protected set payment(value: TPayment | null) {
		this._payment = value;

		if (this.payment === 'card') {
      this.toggleClass(this.buttonCard, 'button_alt-active', true);
      this.toggleClass(this.buttonCash, 'button_alt-active', false);
		} else if (this.payment === 'cash') {
      this.toggleClass(this.buttonCard, 'button_alt-active', false);
      this.toggleClass(this.buttonCash, 'button_alt-active', true);
		} else {
      this.toggleClass(this.buttonCash, 'button_alt-active', false);
      this.toggleClass(this.buttonCard, 'button_alt-active', false);
		}
	}

  get payment() {
		return this._payment;
	}

}