import { createSelector } from '@ngrx/store';
import { selectProductsFilterState } from '../core.state';

export const selectProductsFilter = createSelector(
  selectProductsFilterState,
  state => (state.filter)
);

export const selectProductsFilterIsLoading = createSelector(
  selectProductsFilterState,
  state => (state.isLoading)
);

export const selectProductsFilterIsEnded = createSelector(
  selectProductsFilterState,
  state => (state.isEnded)
);
