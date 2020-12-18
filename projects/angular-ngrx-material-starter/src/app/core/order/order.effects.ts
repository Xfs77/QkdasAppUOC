import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ProductFormService } from '../product-form/product-form.service';
import { NotificationService } from '../notifications/notification.service';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { loadingEnd, loadingStart } from '../general/general.action';
import {
  orderCreate,
  orderCreateFailure,
  orderCreateSuccess,
  orderListAdd,
  orderListGet,
  orderListGetFailure,
  orderListGetSuccess,
  orderListRemove,
  orderListUpdate, orderRemove, orderRemoveFailure, orderRemoveSuccess,
  orderUpdate, orderUpdateFailure, orderUpdateSuccess
} from './order.action';
import { from, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from './order.service';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { Update } from '@ngrx/entity';
import { selectUserProfile } from '../user/user.selectors';
import { Order } from './order.models';
import { stripeToForm } from '../stripe/stripe.actions';
import { selectProductsFilter } from '../products-filter/products-filter.selector';
import { cartStockChecked } from '../cart/cart.action';

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
        switchMap(action => [
            cartStockChecked({payload: {stockChecked: true}}),
            loadingEnd(),
            // stripeToForm({ payload: { checkout: action.payload.order.checkout } })
          ]
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
                  let expedition = null;
                  let date = null;
                  switch (actionData.payload.type) {
                    case 'added':
                      date = ((actionData.payload.doc.data().date as any).toDate());
                      if (actionData.payload.doc.data().expedition) {
                        expedition = ((actionData.payload.doc.data().expedition as any).toDate());
                      }
                      const orderObj = {
                        ...actionData.payload.doc.data(),
                        date: date,
                        expedition: expedition
                      };
                      actions.push(orderListAdd({ payload: { order: orderObj } }));
                      break;
                    case 'modified':
                      const order: Update<Order> = {
                        id: actionData.payload.doc.data().id,
                        changes: actionData.payload.doc.data()
                      };
                      if (order.changes.expedition) {
                        expedition = ((actionData.payload.doc.data().expedition as any).toDate());
                      }
                      order.changes.expedition = expedition;
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
              if (res.length === 0 || res.length > 1 || (res.length === 1 && res[0].type === '[Order List] Add')) {
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

  orderListUpdate = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(orderUpdate),
        tap(_ => this.store$.dispatch(loadingStart())),
        withLatestFrom(this.store$.select(selectUserProfile)),
        switchMap(([action, user]) =>
          from(this.orderService.updateOrder(action.payload.order.changes.user, action.payload.order).commit()).pipe(
            map(() => orderUpdateSuccess(action)),
            catchError((error: HttpErrorResponse) => {
              return of(orderUpdateFailure({ payload: { message: error.message } }));
            })))
      );
    });

  orderUpdateSuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(orderUpdateSuccess),
        map(action =>
          loadingEnd()
        )
      );
    });

  orderUpdateFailure = this.actions$.pipe(
    ofType(orderUpdateFailure),
    tap(_ => this.notificationService.error('Se ha producido un error al realizar la expedición')),
    map(action => loadingEnd())
  );

  orderRemove = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(orderRemove),
        tap(_ => this.store$.dispatch(loadingStart())),
        switchMap(action =>
          from(this.orderService.removeOrder(action.payload.order)).pipe(
            map(res => res.commit()),
            map(() => orderRemoveSuccess(action)),
            catchError((error: HttpErrorResponse) => {
              return of(orderRemoveFailure({ payload: { message: error.message } }));
            })))
      );
    });

  orderRemoveSuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(orderRemoveSuccess),
        map(action =>
          loadingEnd()
        )
      );
    });

  orderRemoveFailure = this.actions$.pipe(
    ofType(orderRemoveFailure),
    tap(_ => this.notificationService.error('No se ha podido eliminar el pedido')),
    map(action => loadingEnd())
  );
}
