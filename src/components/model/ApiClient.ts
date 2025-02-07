import { ApiListResponse, Api } from  '../base/api'
import { IOrder, IAppApi, Product, TSuccessData } from '../../types';


export class ApiClient extends Api implements IAppApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProducts() {
		return this.get('/product').then((cards: ApiListResponse<Product>) => {
			return cards.items.map((item) => {
				return { ...item, image: this.cdn + item.image };
			});
		});
	}

	getProductById(id: string) {
		return this.get('/product/' + id).then((product: Product) => {
			return { ...product, image: this.cdn + product.image };
		});
	}

	postOrder(order: IOrder) {
		return this.post('/order', order).then((success: TSuccessData) => {
			return success;
		});
	}
}