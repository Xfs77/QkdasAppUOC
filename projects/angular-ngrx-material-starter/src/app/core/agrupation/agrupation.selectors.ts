import { selectAgrupationState } from '../core.state';
import { createSelector } from '@ngrx/store';

export const selectChildren = createSelector(
  selectAgrupationState,
  (state, parent) => (state.children[parent])
);

export const selectAgrupationSelected = createSelector(
  selectAgrupationState,
  state => Object.values(state.currentSelectedAgrup)[0]
);

