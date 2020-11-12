import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CartService } from './cart.service';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { loadingEnd, loadingStart } from '../general/general.action';
import {
  cartAdd,
  cartAddFailure,
  cartAddSuccess,
  cartListAdd,
  cartListGet,
  cartListGetFailure,
  cartListGetSuccess,
  cartListRemove,
  cartListUpdate, cartRemove,
  cartRemoveFailure,
  cartRemoveSuccess,
  cartUpdate,
  cartUpdateFailure,
  cartUpdateSuccess
} from './cart.action';
import { selectAuthState } from '../core.state';
import { Update } from '@ngrx/entity';
import { CartLine } from './cart.models';
import { from, of } from 'rxjs';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class CartEffects {

  constructor(
    private actions$: Actions,
    private store$: Store,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {
  }

  cartGet = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(cartListGet),
        tap(_ => this.store$.dispatch(loadingStart())),
        withLatestFrom(this.store$.select(selectAuthState)),
        mergeMap(([action, user]) =>
          this.cartService.getCart(user.id).stateChanges().pipe(
            map(res => {
              const actions = [];
              if (res && res.length > 0) {
                for (const actionData of res) {
                  switch (actionData.payload.type) {
                    case 'added':
                      actions.push(cartListAdd({ payload: { cart: actionData.payload.doc.data() } }));
                      break;
                    case 'modified':
                      const cart: Update<CartLine> = {
                        id: actionData.payload.doc.data().id,
                        changes: actionData.payload.doc.data()
                      };
                      actions.push(cartListUpdate({ payload: { cart } }));
                      break;
                    case 'removed':
                      actions.push(cartListRemove({ payload: { cart: actionData.payload.doc.data() } }));
                      break;
                  }
                }
              }
              return actions;
            }),
            mergeMap(res => {
              if (res.length > 1 || (res.length === 1 && res[0].type === '[Cart List] Add')) {
                res.push(cartListGetSuccess());
              }
              return res;
            }))),
        catchError(error => {
          return of(cartListGetFailure({ payload: { message: error.message } }));
        }));
    });

  cartListGetSuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(cartListGetSuccess),
        map(action =>
          loadingEnd()
        )
      );
    });

  cartListGetFailure = this.actions$.pipe(
    ofType(cartListGetFailure),
    tap(_ => this.notificationService.error('Se ha producido un error al obtener la cesta')),
    map(action => loadingEnd())
  );

  cartAdd = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(cartAdd),
        tap(_ => {
          return this.store$.dispatch(loadingStart());
        }),
        withLatestFrom(this.store$.select(selectAuthState)),
        mergeMap(([action, user]) => {
          return from(this.cartService.addCart(user.id, action.payload.cart)).pipe(
            map(res => cartAddSuccess({ payload: action.payload })),
            catchError(error => {
              return of(cartAddFailure(error.message));
            }));
        }));
    });

  cartAddSuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(cartAddSuccess),
        map(action =>
          loadingEnd()
        )
      );
    });

  cartAddFailure = this.actions$.pipe(
    ofType(cartAddFailure),
    tap(_ => this.notificationService.error('Se ha producido un error al añadir el producto a la cesta')),
    map(action => loadingEnd())
  );

  cartUpdate = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(cartUpdate),
        tap(_ => {
          return this.store$.dispatch(loadingStart());
        }),
        withLatestFrom(this.store$.select(selectAuthState)),
        mergeMap(([action, user]) => {
          return from(this.cartService.updateCart(user.id, action.payload.cart)).pipe(
            map(res => cartUpdateSuccess({ payload: action.payload })),
            catchError(error => {
              return of(cartUpdateFailure(error.message));
            }));
        }));
    });

  cartUpdateSuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(cartUpdateSuccess),
        map(action =>
          loadingEnd()
        )
      );
    });

  cartUpdateFailure = this.actions$.pipe(
    ofType(cartUpdateFailure),
    tap(_ => this.notificationService.error('Se ha producido un error al modificar el producto a la cesta')),
    map(action => loadingEnd())
  );

  cartRemove = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(cartRemove),
        tap(_ => {
          return this.store$.dispatch(loadingStart());
        }),
        withLatestFrom(this.store$.select(selectAuthState)),
        mergeMap(([action, user]) =>
          from(this.cartService.removeCart(user.id, action.payload.cart)).pipe(
            map(res => cartRemoveSuccess({payload: action.payload})),
            catchError(error => {
              return of(cartRemoveFailure(error.message));
            })
          )
        )
      );
    });

  cartRemoveSuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(cartRemoveSuccess),
        map(action =>
          loadingEnd()
        )
      );
    });

  cartRemoveFailure = this.actions$.pipe(
    ofType(cartRemoveFailure),
    tap(_ => this.notificationService.error('Se ha producido un error al eliminar el producto a la cesta')),
    map(action => loadingEnd())
  );

}
