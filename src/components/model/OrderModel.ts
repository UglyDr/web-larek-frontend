import { IEvents } from "../base/events";
import { IOrderData, formOfContacts,formOfPayment, errorStatus, formErrors } from "../../types";

export class OrderModel implements IOrderData {
    protected _paymentInfo: formOfPayment;
	protected _contactInfo: formOfContacts;

    formErrors: formErrors = {};

    constructor(protected events:IEvents) {
        this.clearOrder();
        this.clearUserContacts();
    }

    clearOrder() {
        this._paymentInfo = {
            address: '',
            methodOfPayment: null
        };
    }

    clearUserContacts() {
        this._contactInfo = {
            email: '',
            phone: ''
        }
    }

    checkValidation(): boolean {
        const errors: typeof this.formErrors = {};
        
        if (!this._paymentInfo.methodOfPayment) {
            errors.methodOfPayment = errorStatus.EmptyPayment
        }
        if (!this._paymentInfo.address) {
			errors.address = errorStatus.EmptyAddress;
		}
		if (!this._contactInfo.email) {
			errors.email = errorStatus.EmptyEmail;
		}
		if (!this._contactInfo.phone) {
			errors.phone = errorStatus.EmptyPhone;
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
    }

    set paymentInfo(info: formOfPayment) {
        this._paymentInfo.methodOfPayment = info.methodOfPayment;
        this._paymentInfo.address = info.address;

        if (this.checkValidation()) {
            this.events.emit(`order:ready`, this.paymentInfo);
        }
    }

    get paymentInfo() {
        return this._paymentInfo;
    }

    set contactInfo(info: formOfContacts) {
        this._contactInfo.email = info.email;
        this._contactInfo.phone = info.phone;

        if (this.checkValidation()) {
            this.events.emit('contacts:ready', this.contactInfo);
        }
    
    }

    get contactInfo() {
        return this._contactInfo;
    }
}