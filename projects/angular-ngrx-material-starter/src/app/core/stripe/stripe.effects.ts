import {
  stripeGetCheckout,
  stripeGetCheckoutFailure,
  stripeGetCheckoutSuccess, stripeToForm, stripeToFormFailure, stripeToFormSuccess
} from './stripe.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { loadingEnd, loadingStart } from '../general/general.action';
import { from, of } from 'rxjs';
import { userUpdateFailure, userUpdateSuccess } from '../user/user.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { NotificationService } from '../notifications/notification.service';
import { StripeService } from './stripe.service';
import { environment } from '../../../environments/environment';
import { orderCreate, orderUpdate } from '../order/order.action';

@Injectable()
export class StripeEffects {
  constructor(
    private actions$: Actions,
    private stripeService: StripeService,
    private router: Router,
    private dialog: MatDialog,
    private store$: Store,
    private notificationService: NotificationService
  ) {
  }

  stripeGetCheckout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stripeGetCheckout),
        tap(_ => {
          console.log(_)
          this.store$.dispatch(loadingStart());
        }),
        switchMap(res =>
          from(this.stripeService.getCheckOut(res.payload.order.user.id, res.payload.order.id)).pipe(
            map((checkout) => {
              const order = { ...res.payload.order, checkout: checkout.id };
              return stripeGetCheckoutSuccess({
                payload: {
                  order: order,
                  checkout: checkout.id
                }
              });
            }),
            catchError((error: HttpErrorResponse) => {
              return of(stripeGetCheckoutFailure({ payload: { message: error.message } }));
            }))
        )));

  stripeGetCheckoutSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stripeGetCheckoutSuccess),
        switchMap((res) => [
          loadingEnd(),
          orderUpdate({payload: {order: {id: res.payload.order.id, changes: {...res.payload.order}}}}),
          stripeToForm({payload: {checkout: res.payload.checkout}})
          ]
        ))
  );

  stripeGetCheckoutFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stripeGetCheckoutFailure),
        // tap(_ => this.notificationService.error('No se ha podido iniciar la sesión.')),
        tap(res => console.log(res.payload.message)),
        map(action => loadingEnd())
      ));

  stripeForm = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stripeToForm),
        tap(_ => this.store$.dispatch(loadingStart())),
        tap(_ => console.log(_)),
        switchMap(res =>
        from(Stripe(environment.pkStripeTest).redirectToCheckout({ sessionId: res.payload.checkout})).pipe(
            map(_ => stripeToFormSuccess(res)),
            catchError((error: HttpErrorResponse) => {
              return of(stripeToFormFailure({ payload: { message: error.message } }));
            })
          )
        )));

  stripeFormSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stripeToFormSuccess),
        map(() => {
            return loadingEnd();
          }
        ))
  );

  stripeFormFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stripeToFormFailure),
        tap(_ => this.notificationService.error('No se ha podido realizar el pago.')),
        map(action => loadingEnd())
      ));

}
