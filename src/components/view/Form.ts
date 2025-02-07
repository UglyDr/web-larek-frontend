import { IEvents } from "../base/events";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "./Component";
import { IForm, TForm } from "../../types";

export class Form<T> extends Component<TForm> implements IForm {
  protected inputAll: HTMLInputElement[];
	protected buttonSubmit: HTMLButtonElement;
	protected formErrors: HTMLSpanElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this.inputAll = ensureAllElements<HTMLInputElement>(
			'.form__input',
			container
		);
		this.buttonSubmit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			container
		);
		this.formErrors = ensureElement<HTMLSpanElement>(
			'.form__errors',
			container
		);

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});

		this.inputAll.forEach((input) => {
			input.addEventListener('input', () =>
				this.events.emit(`${this.container.name}:valid`)
			);
		});
	}

	set valid(value: boolean) {
    this.setDisabled(this.buttonSubmit, !value);
	}

	set errors(value: string) {
		this.setText(this.formErrors, value);
	}

	render(data: Partial<T> & TForm): HTMLElement {
		const { valid, ...other } = data;
		this.valid = valid;
		return super.render(other);
	}
}