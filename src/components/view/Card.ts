import { IEvents } from '../base/events';
import { Component } from './Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { ICard, ICardAction } from '../../types';

export class Card extends Component<ICard> {
	protected _id: string;
	protected _title: HTMLHeadingElement;
	protected _price: HTMLSpanElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLSpanElement;
	protected _description: HTMLParagraphElement;
	protected button: HTMLButtonElement;
	protected _index: HTMLSpanElement;
	protected _colors = <Record<string, string>>{
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

	constructor(
		protected template: HTMLTemplateElement,
		protected events: IEvents,
		action?: ICardAction
	) {
		super(cloneTemplate(template), events);

		this._title = ensureElement<HTMLHeadingElement>(
			'.card__title',
			this.container
		);

		this._price = ensureElement<HTMLSpanElement>(
			'.card__price',
			this.container
		);

		this._category = this.container.querySelector(
			'.card__category'
		) as HTMLSpanElement;

		this._image = this.container.querySelector(
			'.card__image'
		) as HTMLImageElement;

		this._description = this.container.querySelector(
			'.card__text'
		) as HTMLParagraphElement;

		this._index = this.container.querySelector(
			'.basket__item-index'
		) as HTMLSpanElement;

		this.button = this.container.querySelector(
			'.card__button'
		) as HTMLButtonElement;

		if (action?.onClick) {
			if (this.button) {
				this.button.addEventListener('click', action.onClick);
			} else {
				this.container.addEventListener('click', action.onClick);
			}
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category card__category_${this._colors[value]}`;
	}

	set index(index: number) {
		this.setText(this._index, String(index));
	}

	set id(id: string) {
		this._id = id;
	}

	set title(title: string) {
		this.setText(this._title, title);
	}

	set price(price: string) {
		this.setText(this._price, price ? `${price} синапсов` : `Бесценно`);
	}

	set description(description: string) {
		this.setText(this._description, description);
	}

	set image(src: string) {
		this.setImage(this._image, src, this.title);
	}

	set inBasket(state: boolean) {
		if (this._price.textContent === `Бесценно`) {
			this.setText(this.button, 'Не для продажи');
		} else {
			this.setText(
				this.button,
				state ? 'Удалить из корзины' : 'Добавить в корзину'
			);
		}
	}
}
