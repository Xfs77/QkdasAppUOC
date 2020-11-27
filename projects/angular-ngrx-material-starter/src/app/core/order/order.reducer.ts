
import produce from 'immer';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Order } from './order.models';
import {
  orderCreate,
  orderCreateSuccess,
  orderListAdd,
  orderListRemove, orderListReset,
  orderListUpdate, orderRemoveSuccess, orderUpdateSuccess
} from './order.action';
import { Action, createReducer, on } from '@ngrx/store';
import { cartListAdd, cartListRemove, cartListReset, cartListUpdate } from '../cart/cart.action';
import { adapterCart } from '../cart/cart.reducer';


export interface OrderState extends EntityState<Order> {

}

export const adapterOrder: EntityAdapter<Order> =
  createEntityAdapter<Order>({
    selectId: order => order.id
  });

export const initialOrderState: OrderState = adapterOrder.getInitialState({
});

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal

} = adapterOrder.getSelectors();


const reducer = createReducer(
  initialOrderState,
  on(orderListAdd, produce((draft, action) => {
    return adapterOrder.addOne(action.payload.order, draft);
  })),
  on(orderListUpdate, produce((draft, action) => {
    return adapterOrder.updateOne(action.payload.order, draft);
  })),
  on(orderListRemove, produce((draft, action) => {
    return adapterOrder.removeOne(action.payload.order.id, draft);
  })),
  on(orderListReset, produce((draft, action) => {
    return adapterOrder.removeAll(draft);
  })),
  on(orderUpdateSuccess, produce((draft, action) => {
    return adapterOrder.updateOne(action.payload.order, draft);
  })),
  on(orderRemoveSuccess, produce((draft, action) => {
    return adapterOrder.removeOne(action.payload.order.id, draft);
  })),

)

export function orderReducer(
  state: OrderState | undefined,
  action: Action
): OrderState {
  return reducer(state, action);
}

