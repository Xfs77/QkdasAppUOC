import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';

import { LocalStorageService } from '../local-storage/local-storage.service';

import { authLogin, authLoginSuccess, authLogout, authLogoutSuccess } from './auth.actions';
import { from } from 'rxjs';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { userGet } from '../user/user.actions';

export const AUTH_KEY = 'AUTH';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  login = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLogin),
        switchMap(res =>
        from(this.authService.login(res.payload.email, res.payload.password)).pipe(
          map((logged) =>  {
           return authLoginSuccess({payload: {id: logged.user.uid, token: null}})
          })
      ))
  ));
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
          userGet({payload: {id: action.payload.id}})
          ])
        )
  );
  logout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLogout),
        switchMap(res =>
          from(this.authService.logOut()).pipe(
            map((logout) =>  {
              return authLogoutSuccess()
            })
          ))
      ));
  logoutSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLogoutSuccess),
        tap(() => {
          this.router.navigate(['']);
          this.localStorageService.removeItem(AUTH_KEY);
        })
      ),
    { dispatch: false }
  );
}
