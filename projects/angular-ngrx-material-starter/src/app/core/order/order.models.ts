import { Product } from '../product-form/product.models';
import { Address, User } from '../user/user.models';

export interface Order {
  id: string;
  user: User;
  shippingAddress: Address;
  date: Date;
  expedition: Date;
  checkout: string;
  status: OrderStatus;
  orderLines: OrderLine[];
}

export interface OrderLine {
  id: string;
  product: Product;
  quantity: number;
  price: number;

}

export interface OrdersFilterInterface {
  userId: string;
}

export enum OrderStatus {
  Pending = 'Pendiente',
  Confirmed = 'Realizado'
}
