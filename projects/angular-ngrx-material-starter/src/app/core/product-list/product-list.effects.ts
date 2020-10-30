import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import {
  selectProductsFilter,
  selectProductsFilterIsLoading
} from '../products-filter/products-filter.selector';
import {
  productListAdd,
  productListEmpty,
  productListGet,
  productListGetImages,
  productListGetImagesFailure,
  productListGetImagesSuccess,
  productListRemove,
  productListUpdate
} from './product-list.action';
import { Update } from '@ngrx/entity';
import { ImageData, Product } from '../product-form/product.models';
import { productsFilterIsLoading } from '../products-filter/products-filter.action';
import { ProductFormService } from '../product-form/product-form.service';
import { of } from 'rxjs';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { ProductListService } from './product-list.service';

@Injectable()
export class ProductListEffects {

  constructor(
    private actions$: Actions,
    private store$: Store,
    private productsService: ProductListService,
    private productFormService: ProductFormService
  ) {
  }

  productsGet = createEffect(
    () => {
    return  this.actions$.pipe(
      ofType(productListGet),
      withLatestFrom(this.store$.select(selectProductsFilter)),
      mergeMap( ([action, filter]) => {
        return this.productsService.getProducts(filter).stateChanges().pipe(
          map((res: DocumentChangeAction<Product>[]) => {
            const actions = [];
            if (!res || res.length === 0 ) {
              actions.push(productListEmpty());
            }
            for (const actionData of res) {
              switch (actionData.payload.type) {
                case 'added':
                  actions.push(productListAdd({payload: {product: actionData.payload.doc.data()}}));
                  break;
                case 'modified':
                  const product: Update<Product> = {id: actionData.payload.doc.data().reference, changes: actionData.payload.doc.data()};
                  actions.push(productListUpdate ( {payload: {product}}));
                  break;
                case 'removed':
                  actions.push(productListRemove({payload: {product: actionData.payload.doc.data()}}));
                  break;
              }
            }
            return actions;
          }),
          withLatestFrom(this.store$.select(selectProductsFilterIsLoading)),
          mergeMap(([res, isLoading]) => {
            if (isLoading) {
              res.push(productsFilterIsLoading({payload: {isLoading: false}}));
            }
            return (res);
          }));
      }));
    });

  productImagesGet = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(productListGetImages),
        mergeMap(action =>
          this.productFormService.getProductImages(action.payload.product).get().pipe(
            map(imagesDocArray => imagesDocArray.docs.map(doc =>
              doc.data() as ImageData
            )),
            map((images: ImageData[]) => {
              const product = {
                ...action.payload.product,
                images
              };
              return productListGetImagesSuccess({payload: {product: {id: product.reference, changes: {images: product.images} }}
              });
            }),
            catchError(error => of(productListGetImagesFailure({payload: {message: error.message}})))
          )));
    })



}
