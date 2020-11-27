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
import { orderCreate } from '../order/order.action';

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
        tap(_ => this.store$.dispatch(loadingStart())),
        switchMap(res =>
          from(this.stripeService.getCheckOut(res.payload.order.user.id)).pipe(
            map((checkout) => {
              const order = { ...res.payload.order, checkout: checkout.id };
              return stripeGetCheckoutSuccess({
                payload: {
                  order: order
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
          orderCreate({payload: {order: res.payload.order}}),
          ]
        ))
  );

  stripeGetCheckoutFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stripeGetCheckoutFailure),
        tap(_ => this.notificationService.error('No se ha podido iniciar la sesión.')),
        map(action => loadingEnd())
      ));

  stripeForm = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stripeToForm),
        tap(_ => this.store$.dispatch(loadingStart())),
        switchMap(res =>
          from(Stripe(environment.pkStripeTest).redirectToCheckout({ sessionId: res.payload.checkout })).pipe(
            map(_ => stripeToFormSuccess(res)),
            catchError((error: HttpErrorResponse) => {
              return of(stripeToFormFailure({ payload: { message: error.message } }));
            })
          ))),
    {dispatch: false});

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
