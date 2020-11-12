import { createSelector } from '@ngrx/store';
import * as fromCart from './cart.reducer'
import { selectCartState } from '../core.state';

export const selectCartListState = createSelector(
  selectCartState,
  fromCart.selectAll
);

export const  selectTotalCartListState = createSelector(
  selectCartListState,
  (cart) => {
    let total = 0;
    for (const item of cart) {
      total = total + item.quantity * item.product.price;
    }
    return total;
  }
)

