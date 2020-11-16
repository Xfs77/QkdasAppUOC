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

export const  selectCartlineById = createSelector(
  selectCartListState,
  (cart, props) => {
    return cart.filter(item => item.id === props.id)[0];
  }
);

export const  selectCartAddress = createSelector(
  selectCartState,
  state => {
    return state.address;
  }
)
