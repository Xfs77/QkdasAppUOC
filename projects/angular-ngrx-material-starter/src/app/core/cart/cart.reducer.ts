import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { CartLine } from './cart.models';
import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import {
  cartCheckStock, cartCheckStockSuccess,
  cartListAdd,
  cartListRemove,
  cartListReset, cartListResetSuccess,
  cartListUpdate, cartSetAddress
} from './cart.action';
import { Address } from '../user/user.models';

export interface CartState extends EntityState<CartLine> {
  address: Address;
}

export const adapterCart: EntityAdapter<CartLine> =
  createEntityAdapter<CartLine>({
    selectId: cartLine => cartLine.id
  });

export const initialCartState: EntityState<CartLine> = adapterCart.getInitialState({
  address: null
});

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal

} = adapterCart.getSelectors();

const reducer = createReducer(
  initialCartState,
  on(cartListAdd, produce((draft, action) => {
    return adapterCart.addOne(action.payload.cart, draft);
  })),
  on(cartListUpdate, produce((draft, action) => {
    return adapterCart.updateOne(action.payload.cart, draft);
  })),
  on(cartListRemove, produce((draft, action) => {
    return adapterCart.removeOne(action.payload.cart.id, draft);
  })),
  on(cartListReset, produce((draft, action) => {
    return adapterCart.removeAll(draft);
  })),
  on(cartCheckStock, produce((draft, action) => {
    return adapterCart.updateOne({id: action.payload.cart.id, changes: {isStock: null}}, draft);
  })),
  on(cartCheckStockSuccess, produce((draft, action) => {
    return adapterCart.updateOne({id: action.payload.cart.id, changes: {isStock: action.payload.isStock}}, draft);
  })),
  on(cartSetAddress, produce((draft, action) => {
    draft.address  = action.payload.address;
  })),
);

export function cartReducer(
  state: CartState | undefined,
  action: Action
): CartState {
  return reducer(state, action);
}

