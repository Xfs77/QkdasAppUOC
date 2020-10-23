import { createSelector } from '@ngrx/store';
import { selectGeneralState } from '../core.state';

export const selectLoading = createSelector(
  selectGeneralState,
  (state) => (state.loading)
);
