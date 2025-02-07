import { TModalFormOfContacts, IFormOfContact } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "./Form";

export class OrderContactsForm extends Form<TModalFormOfContacts> implements IFormOfContact {
	protected inputEmail: HTMLInputElement;
	protected inputPhone: HTMLInputElement;

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.inputEmail = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
		this.inputPhone = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
	}

	set phone(value: string) {
		this.inputPhone.value = value;
	}

	get phone() {
		return this.inputPhone.value;
	}

	set email(value: string) {
		this.inputEmail.value = value;
	}

	get email() {
		return this.inputEmail.value;
	}
}