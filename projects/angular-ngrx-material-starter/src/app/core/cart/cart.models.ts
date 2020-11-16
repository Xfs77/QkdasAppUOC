import { Product } from '../product-form/product.models';

export interface Cart {
  cart: CartLine[];
}

export interface CartLine {
  id: string;
  product: Product;
  quantity: number;
  isStock: boolean;
}


