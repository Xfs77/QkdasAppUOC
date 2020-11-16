import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import {
  selectProductsFilter,
  selectProductsFilterIsLoading
} from '../products-filter/products-filter.selector';
import {
  productListAdd,
  productListEmpty, productListFavorite, productListFavoriteFailure, productListFavoriteSuccess,
  productListGet, productListGetImages, productListGetImagesFailure, productListGetImagesSuccess,
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
import { loadingEnd, loadingStart } from '../general/general.action';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class ProductListEffects {

  constructor(
    private actions$: Actions,
    private store$: Store,
    private productsService: ProductListService,
    private productFormService: ProductFormService,
    private notificationService: NotificationService,
  ) {
  }

  productsGet = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(productListGet),
        withLatestFrom(this.store$.select(selectProductsFilter)),
        mergeMap(([action, filter]) => {
          return this.productsService.getProducts(filter).stateChanges().pipe(
            map(res => {
              if (filter.isActive === true && filter.isStock === true) {
                return res.filter(item => item.payload.doc.data().active && item.payload.doc.data().quantity > 0)
              } else {
                return res;
              }
            }),
            map((res: DocumentChangeAction<Product>[]) => {
              const actions = [];
              if (!res || res.length === 0) {
                actions.push(productListEmpty());
              }
              for (const actionData of res) {
                switch (actionData.payload.type) {
                  case 'added':
                    actions.push(productListAdd({ payload: { product: actionData.payload.doc.data() } }));
                    break;
                  case 'modified':
                    const product: Update<Product> = {
                      id: actionData.payload.doc.data().reference,
                      changes: actionData.payload.doc.data()
                    };
                    actions.push(productListUpdate({ payload: { product } }));
                    break;
                  case 'removed':
                    actions.push(productListRemove({ payload: { product: actionData.payload.doc.data() } }));
                    break;
                }
              }
              return actions;
            }),
            withLatestFrom(this.store$.select(selectProductsFilterIsLoading)),
            mergeMap(([res, isLoading]) => {
              if (isLoading) {
                res.push(productsFilterIsLoading({ payload: { isLoading: false } }));
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
              return productListGetImagesSuccess({
                payload: { product: { id: product.reference, changes: { images: product.images } } }
              });
            }),
            catchError(error => of(productListGetImagesFailure({ payload: { message: error.message } })))
          )));
    });


  productListFavorite = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(productListFavorite),
        tap(_ => this.store$.dispatch(loadingStart())),
        mergeMap(action => {
          const tmp = {...action.payload.product};
          tmp.likes = tmp.likes ? tmp.likes + 1 : 1;
          return of(this.productFormService.addProduct(tmp, null, true)).pipe(
            map(_ => productListFavoriteSuccess({
              payload: {
                product: action.payload.product
              }
            })),
            catchError(error => {
              return of(productListFavoriteFailure({ payload: { message: error.message } }));
            })
          );
        }));
    }
  );

  productListFavoriteSuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(productListFavoriteSuccess),
        map(action =>
          loadingEnd()
        )
      );
    });

  productListFavoriteFailure = this.actions$.pipe(
    ofType(productListFavoriteFailure),
    tap(_ => this.notificationService.error('Se ha producido un error al marcar como favorito')),
    map(action => loadingEnd())
  );

}
