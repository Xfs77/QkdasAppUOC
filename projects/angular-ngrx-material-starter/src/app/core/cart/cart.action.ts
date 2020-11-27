import { createAction, props } from '@ngrx/store';
import { CartLine } from './cart.models';
import { Update } from '@ngrx/entity';
import { Address, User } from '../user/user.models';


export const cartListGet = createAction(
  '[Cart List] Get'
);
export const cartListGetSuccess = createAction(
  '[Cart List] Get Success',
);
export const cartListGetFailure = createAction(
  '[Cart List] Get Failure',
  props<{payload: {message: string}}>()
);
export const cartListAdd = createAction(
  '[Cart List] Add',
  props<{payload: {cart: CartLine}}>()
);
export const cartListUpdate = createAction(
  '[Cart List] Update',
  props<{payload: {cart: Update<CartLine>}}>()
);
export const cartListRemove = createAction(
  '[Cart List] Remove',
  props<{payload: {cart: CartLine}}>()
);
export const cartListReset = createAction(
  '[Cart List] Reset',
  props<{payload: {user: User}}>()
);
export const cartListResetSuccess = createAction(
  '[Cart List] Reset Success',
  props<{payload: {user: User}}>()
);
export const cartListResetFailure = createAction(
  '[Cart List] Reset Failure',
  props<{payload: {message: string}}>()
);
export const cartAdd = createAction(
  '[Cart] Add',
  props<{payload: {cart: CartLine}}>()
);
export const cartAddSuccess = createAction(
  '[Cart] Add Success',
  props<{payload: {cart: CartLine}}>()
);
export const cartAddFailure = createAction(
  '[Cart] Add Failure',
  props<{payload: {message: string}}>()
);
export const cartUpdate = createAction(
  '[Cart] Update',
  props<{payload: {cart: CartLine}}>()
);
export const cartUpdateSuccess = createAction(
  '[Cart] Update Success',
  props<{payload: {cart: CartLine}}>()
);
export const cartUpdateFailure = createAction(
  '[Cart] Update Failure',
  props<{payload: {cart: CartLine}}>()
);
export const cartRemove = createAction(
  '[Cart] Remove',
  props<{payload: {cart: CartLine}}>()
);
export const cartRemoveSuccess = createAction(
  '[Cart] Remove Success',
  props<{payload: {cart: CartLine}}>()
);
export const cartRemoveFailure = createAction(
  '[Cart] Remove Failure',
  props<{payload: {message: string}}>()
);
export const cartCheckStock = createAction(
  '[Cart] Check Stock',
  props<{payload: {cart: CartLine, quantity: number}}>()
);
export const cartCheckStockSuccess = createAction(
  '[Cart] Check Stock Success',
  props<{payload: {cart: CartLine, isStock: boolean}}>()
);
export const cartCheckStockFailure = createAction(
  '[Cart] Check Stock Failure',
  props<{payload: {message: string}}>()
);
export const cartSetAddress = createAction(
  '[Cart] Set Address',
  props<{payload: {address: Address}}>()
);
