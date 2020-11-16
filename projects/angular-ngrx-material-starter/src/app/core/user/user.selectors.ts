import { createSelector } from '@ngrx/store';
import { selectUserState } from '../core.state';
import * as fromUser from '../user/user.reducer';


export const selectAddressProfile = createSelector(
  selectUserState,
  fromUser.selectAll,
);

export const selectAddressProfileById = createSelector(
  selectUserState,
  (state, props) => state.entities[props.id]
);

export const selectDefaultAddress = createSelector(
  selectUserState,
  state => Object.values(state.entities).filter(item => item.default === true)[0]
);

export const selectUserProfile = createSelector(
  selectUserState,
  state => state.user
);

export const selectUserId = createSelector(
  selectUserState,
  state => state.user.id
);
