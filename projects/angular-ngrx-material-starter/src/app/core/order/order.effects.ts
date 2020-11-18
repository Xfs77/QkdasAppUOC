import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ProductListService } from '../product-list/product-list.service';
import { ProductFormService } from '../product-form/product-form.service';
import { NotificationService } from '../notifications/notification.service';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { loadingEnd, loadingStart } from '../general/general.action';
import {
  orderCreate,
  orderCreateFailure,
  orderCreateSuccess,
  orderListAdd,
  orderListGet, orderListGetFailure, orderListGetSuccess, orderListRemove, orderListUpdate
} from './order.action';
import { from, of } from 'rxjs';
import { userUpdateFailure, userUpdateSuccess } from '../user/user.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from './order.service';
import {
  productListAdd,
  productListEmpty,
  productListGet, productListRemove, productListUpdate
} from '../product-list/product-list.action';
import {
  selectProductsFilter,
  selectProductsFilterIsLoading
} from '../products-filter/products-filter.selector';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { Product } from '../product-form/product.models';
import { Update } from '@ngrx/entity';
import { productsFilterIsLoading } from '../products-filter/products-filter.action';
import { selectUserProfile } from '../user/user.selectors';
import { Order } from './order.models';
import { cartListGetFailure, cartListGetSuccess } from '../cart/cart.action';

@Injectable()
export class OrderEffects {

  constructor(
    private actions$: Actions,
    private store$: Store,
    private orderService: OrderService,
    private productFormService: ProductFormService,
    private notificationService: NotificationService
  ) {
  }

  orderCreate = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(orderCreate),
        tap(_ => {
          return this.store$.dispatch(loadingStart());
        }),
        tap(_ => this.store$.dispatch(loadingStart())),
        switchMap(res =>
          from(this.orderService.addOrder(res.payload.order)).pipe(
            map(() => orderCreateSuccess(res)),
            catchError((error: HttpErrorResponse) => {
              return of(orderCreateFailure({ payload: { message: error.message } }));
            })))
      );
    });

  orderCreateSuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(orderCreateSuccess),
        map(action =>
          loadingEnd()
        )
      );
    });

  orderCreateFailure = this.actions$.pipe(
    ofType(orderCreateFailure),
    tap(_ => this.notificationService.error('Se ha producido un error al crear el Pedido')),
    map(action => loadingEnd())
  );

  ordersGet = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(orderListGet),
        tap(_ => this.store$.dispatch(loadingStart())),
        withLatestFrom(this.store$.select(selectUserProfile)),
        mergeMap(([action, user]) =>
          this.orderService.ordersGet({ userId: user.admin ? null : user.id }).stateChanges().pipe(
            map((res: DocumentChangeAction<Order>[]) => {
              const actions = [];
              if (res && res.length > 0) {
                for (const actionData of res) {
                  switch (actionData.payload.type) {
                    case 'added':
                      actions.push(orderListAdd({ payload: { order: actionData.payload.doc.data() } }));
                      break;
                    case 'modified':
                      const order: Update<Order> = {
                        id: actionData.payload.doc.data().id,
                        changes: actionData.payload.doc.data()
                      };
                      actions.push(orderListUpdate({ payload: { order } }));
                      break;
                    case 'removed':
                      actions.push(orderListRemove({ payload: { order: actionData.payload.doc.data() } }));
                      break;
                  }
                }
              }
              return actions;
            }),
            mergeMap(res => {
              if (res.length > 1 || (res.length === 1 && res[0].type === '[Order List] Add')) {
                res.push(orderListGetSuccess({ payload: { order: res } }));
              }
              return res;
            }))),
        catchError(error => {
          return of(orderListGetFailure({ payload: { message: error.message } }));
        }));
    });

  orderListGetSuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(orderListGetSuccess),
        map(action =>
          loadingEnd()
        )
      );
    });

  orderListGetFailure = this.actions$.pipe(
    ofType(orderListGetFailure),
    tap(_ => this.notificationService.error('Se ha producido un error al obtener la cesta')),
    map(action => loadingEnd())
  );

}
