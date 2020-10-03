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

export const selectUserProfile = createSelector(
  selectUserState,
  state => state.user
);
