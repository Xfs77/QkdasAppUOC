import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Product } from '../product-form/product.models';
import { Action, createReducer, on } from '@ngrx/store';
import {
  adapterImagesData,
  initialProductFormState,
  ProductFormState
} from '../product-form/product-form.reducer';
import { productFormEdit } from '../product-form/product-form.action';
import produce from 'immer';
import {
  productListAdd, productListEmpty, productListGetImagesSuccess,
  productListRemove,
  productListReset,
  productListUpdate
} from './product-list.action';

export interface ProductListState extends EntityState<Product> {
  isEmptyResult: boolean;
}

export const adapterProductList: EntityAdapter<Product> =
  createEntityAdapter<Product>({
    selectId: product => product.reference
  });

export const initialProductListState: ProductListState = adapterProductList.getInitialState({
  isEmptyResult: false
});

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal

} = adapterProductList.getSelectors();


const reducer = createReducer(
  initialProductListState,
  on(productListAdd, produce((draft, action) => {
    return adapterProductList.addOne(action.payload.product, draft);
  })),
  on(productListUpdate, produce((draft, action) => {
    console.log('pp')
    return adapterProductList.updateOne(action.payload.product, draft);
  })),
  on(productListRemove, produce((draft, action) => {
    return adapterProductList.removeOne(action.payload.product.reference, draft);
  })),
  on(productListReset, produce((draft, action) => {
    return adapterProductList.removeAll(draft);
  })),
  on(productListGetImagesSuccess, produce((draft, action) => {
    return adapterProductList.updateOne(action.payload.product, draft);
  })),
  on(productListEmpty, produce((draft, action) => {
    draft.isEmptyResult = true;
  })),
)

export function productListReducer(
  state: ProductListState | undefined,
  action: Action
): ProductListState {
  return reducer(state, action);
}

