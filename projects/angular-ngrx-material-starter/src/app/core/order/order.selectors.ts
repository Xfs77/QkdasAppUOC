import { createSelector } from '@ngrx/store';
import { selectOrderState } from '../core.state';
import * as fromOrderList from '../order/order.reducer';

export const selectOrders = createSelector(
  selectOrderState,
  fromOrderList.selectAll
);
export const selectOrdersEntities = createSelector(
  selectOrderState,
  fromOrderList.selectEntities
);

export const selectOrderById = createSelector(
  selectOrdersEntities,
  (state, props) => {
    return state[props.orderId]
  }
);
