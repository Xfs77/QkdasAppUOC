import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ImageData, Product } from './product.models';
import { Action, createReducer, on } from '@ngrx/store';
import {
  productFormAdd,
  productFormEdit,
  productFormSaveSuccess,
  productImageAddSuccess,
  productImageRemoveSuccess,
  productImagesGetSuccess,
  productImageUpdateMain,
  productImageUpdateSuccess
} from './product-form.action';
import produce from 'immer';

export interface ProductFormState extends EntityState<ImageData> {
  product: Product;
  existMain: boolean;
}

export const adapterImagesData: EntityAdapter<ImageData> =
  createEntityAdapter<ImageData>();

export const initialProductFormState: ProductFormState = adapterImagesData.getInitialState({
  product: null,
  existMain: false
});

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapterImagesData.getSelectors();

const reducer = createReducer(
  initialProductFormState,
  on(productFormEdit, produce((draft, action) => {
    draft = initialProductFormState;
    draft.product = action.payload.product;
    return adapterImagesData.removeAll(draft);
  })),
  on(productFormAdd, produce((draft, action) => {
    draft = initialProductFormState;
    return adapterImagesData.removeAll(draft);
  })),
  on(productFormSaveSuccess, produce((draft, action) => {
    draft.product = action.payload.product;
  })),
  on(productImageUpdateMain, produce((draft, action) =>  {
    draft.existMain = action.payload.existMain;
  })),
  on(productImagesGetSuccess, produce((draft, action) =>  {
    return adapterImagesData.addMany(action.payload.images, draft);
  })),
  on(productImageAddSuccess, produce((draft, action) =>  {
    return adapterImagesData.addOne(action.payload.image, draft);
  })),
  on(productImageUpdateSuccess, produce((draft, action) =>  {
    return adapterImagesData.updateOne(action.payload.image, draft);
  })),
  on(productImageRemoveSuccess, produce((draft, action) =>  {
    return adapterImagesData.removeOne(action.payload.imageKey, draft);
  })),
  );

export function productFormReducer(
  state: ProductFormState | undefined,
  action: Action
): ProductFormState {
  return reducer(state, action);
}
