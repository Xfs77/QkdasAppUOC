import { createAction, props } from '@ngrx/store';
import { ImageData, Product } from './product.models';
import { Update } from '@ngrx/entity';

export const productFormAdd = createAction(
  '[Product Form] Add'
);
export const productFormEdit = createAction(
  '[Product Form] Edit',
  props<{payload: {product: Product}}>()
);
export const productFormRemove = createAction(
  '[Product Form] Remove',
  props<{payload: {product: Product}}>()
);
export const productFormRemoveSuccess = createAction(
  '[Product Form] Remove Success',
  props<{payload: {product: Product}}>()
);
export const productFormRemoveFailure = createAction(
  '[Product Form] Remove Failure',
  props<{payload: {message: string}}>()
);
export const productFormSave = createAction(
  '[Product Form] Save',
  props<{payload: {
                    product: Product
                    imagesToRemove: ImageData[]
                    imagesToUpload: ImageData[]
                    imageToUpdateIsMain: ImageData
                    edit: boolean
                  }}>()
);
export const productFormSaveSuccess = createAction(
  '[Product Form] Save Success',
  props<{payload: {
      product: Product
      imagesToRemove: ImageData[]
      imagesToUpload: ImageData[]
    }}>()
);
export const productFormSaveFailure = createAction(
  '[Product Form] Save Failure',
  props<{payload: {message: string}}>()
);

export const productImagesGet = createAction(
  '[Product Images] Get',
  props<{payload: {product: Product}}>()
);
export const productImagesGetSuccess = createAction(
  '[Product Images] Get Success',
  props<{payload: {images: ImageData[]}}>()
);
export const productImagesGetFailure = createAction(
  '[Product Images] Get Failure',
  props<{payload: {message: string}}>()
);
export const productImageAdd = createAction(
  '[Product Image] Add',
  props<{payload: {product: Product, image: ImageData}}>()
);
export const productImageAddSuccess = createAction(
  '[Product Image] Add Success',
  props<{payload: {product: Product, image: ImageData}}>()
);
export const productImageAddFailure = createAction(
  '[Product Image] Add Failure',
  props<{payload: {message: string}}>()
);
export const productImageUpdate = createAction(
  '[Product Image] Update',
  props<{payload: {image: Update<ImageData>}}>()
);
export const productImageUpdateSuccess = createAction(
  '[Product Image] Update Success',
  props<{payload: {image: Update<ImageData>}}>()
);
export const productImageUpdateFailure = createAction(
  '[Product Image] Update Failure',
  props<{payload: {message: string}}>()
);
export const productImageRemove = createAction(
  '[Product Image] Remove',
  props<{payload: {product: Product, imageKey: string}}>()
);
export const productImageRemoveSuccess = createAction(
  '[Product Image] Remove Success',
  props<{payload: {product: Product, imageKey: string}}>()
);
export const productImageRemoveFailure = createAction(
  '[Product Image] Remove Failure',
  props<{payload: {message: string}}>()
);
export const productImageUpdateMain = createAction(
  '[Product Image] Update Main',
  props<{payload: {existMain: boolean}}>()
);
3
export const storageImageRemove = createAction(
  '[Storage Image] Remove',
  props<{payload: {product: Product, image: ImageData}}>()
);
export const storageImageRemoveSuccess = createAction(
  '[Storage Image] Remove Success',
  props<{payload: {product: Product, image: ImageData}}>()
);
export const storageImageRemoveFailure = createAction(
  '[Storage Image] Remove Failure',
  props<{payload: {message: string}}>()
);
export const storageImageAdd = createAction(
  '[Storage Image] Add',
  props<{payload: {product: Product, image: ImageData}}>()
);
export const storageImageAddSuccess = createAction(
  '[Storage Image] Add Success',
  props<{payload: {product: Product, image: ImageData}}>()
);
export const storageImageAddFailure = createAction(
  '[Storage Image] Add Failure',
  props<{payload: {message: string}}>()
);
