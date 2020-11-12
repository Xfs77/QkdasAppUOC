import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Product } from '../product-form/product.models';
import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import {
  productListAdd, productListEmpty, productListFavorite, productListGetImagesSuccess,
  productListRemove, productListRemoveMainImage,
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
    return adapterProductList.updateOne(action.payload.product, draft);
  })),
  on(productListRemove, produce((draft, action) => {
    return adapterProductList.removeOne(action.payload.product.reference, draft);
  })),
  on(productListRemoveMainImage, produce((draft, action) => {
    return adapterProductList.updateOne(action.payload.product, draft);
  })),
  on(productListReset, produce((draft, action) => {
    return adapterProductList.removeAll({...draft, isEmptyResult: false});
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

