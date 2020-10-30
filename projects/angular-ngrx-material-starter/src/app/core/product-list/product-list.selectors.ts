import { createSelector } from '@ngrx/store';
import { selectProductListState } from '../core.state';
import * as fromProductList from './product-list.reducer'

export const selectProductsProductList = createSelector(
  selectProductListState,
  fromProductList.selectAll
);

export const selectEmptyProductList = createSelector(
  selectProductListState,
  state => state.isEmptyResult
);

