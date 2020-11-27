import { createSelector } from '@ngrx/store';
import { selectStripeState } from '../core.state';
import { AuthState } from '../auth/auth.models';
import { StripeState } from './stripe.models';

export const selectStripe = createSelector(
  selectStripeState,
  (state: StripeState) => state
);
