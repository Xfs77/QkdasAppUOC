import { createAction, props } from '@ngrx/store';
import { Order, OrdersFilterInterface } from './order.models';
import { Update } from '@ngrx/entity';

export const orderCreate = createAction(
  '[Order] Create',
  props<{payload: {order: Order }}>(),
);
export const orderCreateSuccess = createAction(
  '[Order] Create Success',
  props<{payload: {order: Order }}>(),
);
export const orderCreateFailure = createAction(
  '[Order] Create Failure',
  props<{payload: {message: string }}>(),
);
export const orderListAdd = createAction(
  '[Order List] Add',
  props<{payload: {order: Order}}>()
);
export const orderListUpdate = createAction(
  '[Order List] Update',
  props<{payload: {order: Update<Order>}}>()
);
export const orderListRemove = createAction(
  '[Order List] Remove',
  props<{payload: {order: Order}}>()
);
export const orderListEmpty = createAction(
  '[Order List] Empty',
);
export const orderListReset = createAction(
  '[Order List] Reset',
);
export const orderListGet = createAction(
  '[Order List] Get',
);
export const orderListGetSuccess = createAction(
  '[Order List] Get Success',
  props<{payload: {order: Order[]}}>()
);
export const orderListGetFailure = createAction(
  '[Order List] Get Failure',
  props<{payload: {message: string}}>()
);
