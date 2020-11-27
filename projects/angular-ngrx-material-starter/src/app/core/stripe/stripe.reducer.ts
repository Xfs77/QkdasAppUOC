import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { StripeState } from './stripe.models';
import { stripeGetCheckoutSuccess } from './stripe.actions';

export const initialState: StripeState = {
  checkout: null
};

const reducer = createReducer(
  initialState,
  on(stripeGetCheckoutSuccess, produce((draft, action) => {
    draft.checkout = action.payload.order.checkout;
  }, initialState))
);

export function stripeReducer(
  state: StripeState | undefined,
  action: Action
): StripeState {
  return reducer(state, action);
}
