import { createSelector } from '@ngrx/store';
import { selectProductFormState } from '../core.state';
import * as fromProductForm from '../product-form/product-form.reducer';


export const selectProductProductForm = createSelector(
  selectProductFormState,
  state => {
    return state.product;
  }
);

export const selectProductExistMain = createSelector(
  selectProductFormState,
  state => {
    return state.existMain;
  });

export const selectProductImages = createSelector(
  selectProductFormState,
  fromProductForm.selectAll
);
