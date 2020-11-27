import { createAction, props } from '@ngrx/store';
import { Order } from '../order/order.models';

export const stripeGetCheckout = createAction(
  '[Stripe] Get Checkout',
  props<{payload: {order: Order}}>(),
);
export const stripeGetCheckoutSuccess = createAction(
  '[Stripe] Get Checkout Success',
  props<{payload: {order: Order}}>(),
);
export const stripeGetCheckoutFailure = createAction(
  '[Stripe] Get Checkout Failure',
  props<{payload: {message: string}}>(),
);
export const stripeToForm = createAction(
  '[Stripe] Form',
  props<{payload: {checkout: string}}>(),
);
export const stripeToFormSuccess = createAction(
  '[Stripe] Form Success',
  props<{payload: {checkout: string}}>(),
);
export const stripeToFormFailure = createAction(
  '[Stripe] Form Failure',
  props<{payload: {message: string}}>(),
);
