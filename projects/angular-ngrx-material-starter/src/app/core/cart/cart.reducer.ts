import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { CartLine } from './cart.models';
import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { cartListAdd, cartListRemove, cartListReset, cartListUpdate } from './cart.action';

export interface CartState extends EntityState<CartLine> {
}

export const adapterCart: EntityAdapter<CartLine> =
  createEntityAdapter<CartLine>({
    selectId: cartLine => cartLine.id
  });

export const initialCartState: EntityState<CartLine> = adapterCart.getInitialState({
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
    console.log(draft.cart)
    return adapterCart.addOne(action.payload.cart, draft);
  })),
  on(cartListUpdate, produce((draft, action) => {
    return adapterCart.updateOne(action.payload.cart, draft);
  })),
  on(cartListRemove, produce((draft, action) => {
    return adapterCart.removeOne(action.payload.cart.id, draft);
  })),
  on(cartListReset, produce((draft, action) => {
    console.log('FDD')
    return adapterCart.removeAll(draft);
  })),
);

export function cartReducer(
  state: CartState | undefined,
  action: Action
): CartState {
  return reducer(state, action);
}

