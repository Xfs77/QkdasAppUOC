import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductFormService } from './product-form.service';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import {
  productFormAdd,
  productFormEdit,
  productFormRemove,
  productFormRemoveFailure,
  productFormRemoveSuccess,
  productFormSave,
  productFormSaveFailure,
  productFormSaveSuccess,
  productImageAdd,
  productImageAddFailure,
  productImageAddSuccess,
  productImageRemove, productImageRemoveFailure,
  productImageRemoveSuccess,
  productImagesGet,
  productImagesGetFailure,
  productImagesGetSuccess,
  storageImageAdd,
  storageImageAddSuccess,
  storageImageRemove,
  storageImageRemoveFailure,
  storageImageRemoveSuccess
} from './product-form.action';
import { of } from 'rxjs';
import { ImageData } from './product.models';
import { productListRemoveMainImage } from '../product-list/product-list.action';
import { Store } from '@ngrx/store';
import { loadingEnd, loadingStart } from '../general/general.action';
import { authLoginFailure } from '../auth/auth.actions';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class ProductFormEffects {

  constructor(
    private actions$: Actions,
    private store$: Store,
    private productFormService: ProductFormService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }


  producFormAdd = createEffect(
    () =>
      this.actions$.pipe(
        ofType(productFormAdd),
        tap(action => this.router.navigate(['/products/add']))),
    { dispatch: false });

  producFormEdit = createEffect(
    () =>
      this.actions$.pipe(
        ofType(productFormEdit),
        tap(action => this.router.navigate([`/products/edit`, action.payload.product.reference], {queryParams: {position: action.payload.index}})),
        map(action => productImagesGet({ payload: { product: action.payload.product } }))));

  storageImageAdd = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(storageImageAdd),
        mergeMap(action => {
          return this.productFormService.addStorageImage(action.payload.product, action.payload.image).pipe(
            map((url: string) => {
              const image = {
                ...action.payload.image,
                urls: {
                  ...action.payload.image.urls,
                  imgXL: url
                }
              };

              return storageImageAddSuccess({
                payload:
                  {
                    product: action.payload.product,
                    image
                  }
              });
            }),
            catchError(error => {
              return of(productFormSaveFailure({ payload: { message: error.message } }));
            })
          );
        }));
    });

  storageImageAddSuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(storageImageAddSuccess),
        map(action =>
          productImageAdd({
            payload: {
              product: action.payload.product,
              image: action.payload.image
            }
          })
        )
      );
    });

  storageImageRemove = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(storageImageRemove),
        mergeMap(action => {
          return of(this.productFormService.removeStorageImage(action.payload.product, action.payload.image)).pipe(
            map(_ => storageImageRemoveSuccess({
              payload: {
                product: action.payload.product,
                image: action.payload.image
              }
            })));
        }),
        catchError(error => {
          return of(storageImageRemoveFailure({ payload: { message: error.message } }));
        })
      );
    });

  storageRemoveSuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(storageImageRemoveSuccess),
        mergeMap(action => {
            if (action.payload.image.isMain) {
              return [
                productListRemoveMainImage({
                  payload: {
                    product:
                      {
                        id: action.payload.product.reference,
                        changes: { mainImage: null }
                      }
                  }
                }),
                productImageRemove({
                  payload: {
                    product: action.payload.product,
                    imageKey: action.payload.image.id
                  }
                })];
            } else {
              return [productImageRemove({
                payload: {
                  product: action.payload.product,
                  imageKey: action.payload.image.id
                }
              })];
            }

          }
        )
      );
    });

  productImageAdd = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(productImageAdd),
        mergeMap(action =>
          of(this.productFormService.addProductImage(action.payload.product, action.payload.image)).pipe(
            map(r => {
              return productImageAddSuccess({
                payload: {
                  product: action.payload.product,
                  image: action.payload.image
                }
              });
            }),
            catchError(error => {
              return of(productImageAddFailure({ payload: { message: error.message } }));
            })
          )));
    });

  productSave = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(productFormSave),
        tap(_ => this.store$.dispatch(loadingStart())),
        mergeMap(action =>
          of(this.productFormService.addProduct(action.payload.product, action.payload.imageToUpdateIsMain, action.payload.edit, null)).pipe(
            map(_ => productFormSaveSuccess({
              payload: {
                product: action.payload.product,
                imagesToRemove: action.payload.imagesToRemove,
                imagesToUpload: action.payload.imagesToUpload
              }
            })),
            catchError(error => {
              return of(productFormSaveFailure({ payload: { message: error.message } }));
            })
          )));
    });

  productSaveSuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(productFormSaveSuccess),
        tap(_ => this.router.navigate(['products'], { relativeTo: this.route })),
        mergeMap(action => {
          const add = [];
          for (const image of action.payload.imagesToUpload) {
            const tmp = storageImageAdd({
              payload: {
                product: action.payload.product,
                image
              }
            });
            add.push(tmp);
          }

          const remove = [];
          for (const image of action.payload.imagesToRemove) {
            const tmp = storageImageRemove({
              payload: {
                product: action.payload.product,
                image
              }
            });
            remove.push(tmp);
          }
          const obs = add.concat(remove);
          return obs.concat(loadingEnd());
        }),
        catchError(error => {
          return of(productFormSaveFailure({ payload: { message: error.message } }));
        })
      );
    });

  productSaveFailure = this.actions$.pipe(
    ofType(productFormSaveFailure),
    tap(_ => this.notificationService.error('Se ha producido un error al guardar los datos')),
    map(action => loadingEnd())
  );

  productRemove = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(productFormRemove),
        mergeMap(action =>
          of(this.productFormService.removeProduct(action.payload.product)).pipe(
            map(_ => productFormRemoveSuccess({ payload: { product: action.payload.product } })),
            catchError(error => {
              return of(productFormRemoveFailure({ payload: { message: error.message } }));
            }))
        ));
    });

  productImagesGet = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(productImagesGet),
        mergeMap(action =>
          of(this.productFormService.getProductImages(action.payload.product)).pipe(
            mergeMap(imagesData => imagesData.get()),
            map(response => response.docs.map(item => item.data())),
            map((images: ImageData[]) => productImagesGetSuccess({ payload: { images: images } })
            ))),
        catchError(error => {
          return of(productImagesGetFailure({ payload: { message: error.message } }));
        }));
    });

  imageDataRemove = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(productImageRemove),
        mergeMap(action =>
          of(this.productFormService.removeProductImage(action.payload.product, action.payload.imageKey.toString())).pipe(
            map(result => productImageRemoveSuccess({
                payload: {
                  product: action.payload.product,
                  imageKey: action.payload.imageKey
                }
              })
            ),
            catchError(error => {
              return of(productImageRemoveFailure({ payload: { message: error.message } }));
            })
          )));
    });

}
