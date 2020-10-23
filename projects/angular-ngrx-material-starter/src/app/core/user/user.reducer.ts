import { createReducer, on, Action } from '@ngrx/store';
import { Address, User } from './user.models';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  userAddressDefaultSuccess,
  userAddressGetSuccess, userAddressRemoveSuccess,
  userAddressUpdateSuccess,
  userGetSuccess,
  userUpdateSuccess
} from './user.actions';
import produce from 'immer';
import { authLogoutSuccess } from '../auth/auth.actions';

export interface  UserState extends EntityState<Address> {
  user: User;
}
export const adapterUser: EntityAdapter<Address> =
  createEntityAdapter<Address>({
    selectId: address => address.id
  });
export const initialState: UserState = adapterUser.getInitialState({
  user: {} as User
});
export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapterUser.getSelectors();


const reducer = createReducer(
  initialState,
  on(userUpdateSuccess, produce((draft, action) =>  {
    draft.user = action.payload.user;
    return draft;
  })),
  on(userGetSuccess, produce((draft, action) =>  {
    draft.user = action.payload.user;
    return draft;
  })),
  on(userAddressGetSuccess, produce((draft, action) =>  {
    return adapterUser.addMany(action.payload.addresses, draft);
  })),
  on(userAddressUpdateSuccess, produce((draft, action) =>  {
    return adapterUser.upsertOne(action.payload.address, draft);
  })),
  on(userAddressRemoveSuccess, produce((draft, action) =>  {
    return adapterUser.removeOne(action.payload.address.id, draft);
  })),
  on(userAddressDefaultSuccess, produce((draft, action) =>  {
    return adapterUser.upsertMany(action.payload.addresses, draft);
  })),
  on(authLogoutSuccess, produce((draft, action) =>  {
    return initialState;
  })),
);

export function userReducer(
  state: UserState | undefined,
  action: Action
): UserState {
  return reducer(state, action);
}
