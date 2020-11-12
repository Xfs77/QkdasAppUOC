import OrderByDirection = firebase.firestore.OrderByDirection;
import { Agrupation } from '../agrupation/agrupation.models';

export interface ProductsFilterInterface {

  agrupation?: Agrupation;
  batch: number;
  offset: string;
  sort?: Sort;
  isActive: boolean;
  isStock: boolean;
}

export interface Sort {
  field: string;
  direction: OrderByDirection;
}
