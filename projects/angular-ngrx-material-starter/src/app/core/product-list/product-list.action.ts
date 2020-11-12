import { createAction, props } from '@ngrx/store';
import { ImageData, Product } from '../product-form/product.models';
import { Update } from '@ngrx/entity';
import { ProductsFilterInterface } from '../products-filter/products-filter.models';

export const productListAdd = createAction(
  '[Product List] Add',
  props<{payload: {product: Product}}>()
);
export const productListUpdate = createAction(
  '[Product List] Update',
  props<{payload: {product: Update<Product>}}>()
);
export const productListRemove = createAction(
  '[Product List] Remove',
  props<{payload: {product: Product}}>()
);
export const productListEmpty = createAction(
  '[Product List] Empty',
);
export const productListReset = createAction(
  '[Product List] Reset',
);
export const productListGet = createAction(
  '[Product List] Get',
  props<{payload: {filter: ProductsFilterInterface}}>()
);
export const productListGetSuccess = createAction(
  '[Product List] Get Success',
  props<{payload: {products: Product[]}}>()
);
export const productListGetFailure = createAction(
  '[Product List] Get Failure',
  props<{payload: {message: string}}>()
);
export const productListRemoveMainImage = createAction(
  '[Product List] Remove Main Image',
  props<{payload: {product: Update<Product>}}>()
);
export const productListGetImages = createAction(
  '[Product List] Get Images',
  props<{payload: {product: Product}}>()
);
export const productListGetImagesSuccess = createAction(
  '[Product List] Get Images Success',
  props<{payload: {product: Update<Product>}}>()
);
export const productListGetImagesFailure = createAction(
  '[Product List] Get Images Failure',
  props<{payload: {message: string}}>()
);
export const productListFavorite = createAction(
  '[Product List] Favorite',
  props<{payload: {
      product: Product
    }}>()
);
export const productListFavoriteSuccess = createAction(
  '[Product List] Favorite Success',
  props<{payload: {
      product: Product
    }}>()
);
export const productListFavoriteFailure = createAction(
  '[Product List] Favorite Failure',
  props<{payload: {message: string}}>()
);
