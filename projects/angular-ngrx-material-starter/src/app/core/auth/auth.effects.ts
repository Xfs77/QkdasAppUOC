import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { LocalStorageService } from '../local-storage/local-storage.service';

import {
  authLogin, authLoginFailure,
  authLoginSuccess,
  authLogout, authLogoutFailure,
  authLogoutSuccess
} from './auth.actions';
import { from, of } from 'rxjs';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { userGet } from '../user/user.actions';
import { Store } from '@ngrx/store';
import { loadingEnd, loadingStart } from '../general/general.action';
import { NotificationService } from '../notifications/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

export const AUTH_KEY = 'AUTH';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private store$: Store,
    private notificationService: NotificationService
  ) {
  }

  login = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authLogin),
        tap(_ => this.store$.dispatch(loadingStart())),
        switchMap(res =>
          from(this.authService.login(res.payload.email, res.payload.password)).pipe(
            map((logged) => {
              return authLoginSuccess({ payload: { id: logged.user.uid, token: null } });
            }),
            catchError(error => of(authLoginFailure({ payload: { message: error.message } })))
          )));
    });

  authLoginSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLoginSuccess),
        tap(res => {
          this.localStorageService.setItem(AUTH_KEY, {
            isAuthenticated: true
          });
          this.dialog.closeAll();
        }),
        switchMap(action => [
          loadingEnd(),
          userGet({ payload: { id: action.payload.id } })
        ])
      ));

  authLoginFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLoginFailure),
        tap(_ => this.notificationService.error('Alguno de los datos introducidos es incorrecto.')),
        map(action => loadingEnd())
      ));

  logout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLogout),
        tap(_ => this.store$.dispatch(loadingStart())),
        switchMap(res =>
          from(this.authService.logOut()).pipe(
            map((logout) => {
              return authLogoutSuccess();
            }),
            catchError((error: HttpErrorResponse) => of(authLogoutFailure({ payload: { message: error.message } }))))
        )
      ));

  logoutSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLogoutSuccess),
        map(_ => loadingEnd()),
        tap(() => {
          this.router.navigate(['']);
          this.localStorageService.removeItem(AUTH_KEY);
        })
      ));

  authLogoutFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLogoutFailure),
        tap(_ => this.notificationService.error('Error al cerrar la sesión')),
        map(action => loadingEnd())
      ));
}
