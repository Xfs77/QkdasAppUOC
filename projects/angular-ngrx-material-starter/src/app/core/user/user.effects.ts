import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import {
  userAddressDefault,
  userAddressDefaultFailure,
  userAddressDefaultSuccess,
  userAddressGet,
  userAddressGetFailure,
  userAddressGetSuccess,
  userAddressRemove,
  userAddressRemoveFailure,
  userAddressRemoveSuccess,
  userAddressUpdate,
  userAddressUpdateFailure,
  userAddressUpdateSuccess,
  userChangePassword,
  userChangePasswordFailure,
  userChangePasswordSuccess, userCheckEmail, userCheckEmailFailure, userCheckEmailSuccess,
  userGet,
  userGetFailure,
  userGetSuccess,
  userUpdate,
  userUpdateFailure,
  userUpdateSuccess
} from './user.actions';
import { Address, User } from './user.models';
import { Store } from '@ngrx/store';
import { loadingEnd, loadingStart } from '../general/general.action';
import { NotificationService } from '../notifications/notification.service';
import { selectAuth } from '../auth/auth.selectors';
import { authLogin } from '../auth/auth.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private store$: Store,
    private notificationService: NotificationService
  ) {
  }

  userUpdate = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdate),
        tap(_ => this.store$.dispatch(loadingStart())),
        switchMap(res =>
          from(this.userService.userUpdate(res.payload.user)).pipe(
            map(() => userUpdateSuccess(res)),
            catchError((error: HttpErrorResponse) => {
              return of(userUpdateFailure({ payload: { message: error.message } }));
            }))
        )));

  userUpdateSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateSuccess),
        withLatestFrom(this.store$.select(selectAuth)),
        switchMap(([action, auth]) => {
          console.log(action.payload.user)
          if (!auth.isAuthenticated && action.payload.user.password !== '') {
            console.log('login')
            return of(authLogin({payload: {email: action.payload.user.email, password: action.payload.user.password}}));
          } else {
            return of(null);
          }
        }),
        tap(() => {
            this.store$.dispatch(loadingEnd());
            this.router.navigate(['/profile']);
          }
        )));

  userUpdateFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdateFailure),
        tap(_ => this.notificationService.error('Se ha producido un error en la actualización de los datos')),
        map(action => loadingEnd())
      ));

  userChangePassword = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userChangePassword),
        tap(_ => this.store$.dispatch(loadingStart())),
        switchMap(res =>
          from(this.userService.changePassword(res.payload.password)).pipe(
            map(() => userChangePasswordSuccess(res)),
            catchError((error: HttpErrorResponse) => {
              return of(userChangePasswordFailure({ payload: { message: error.message } }));
            }))
        )));

  userChangePasswordSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userChangePasswordSuccess),
        tap(() => {
            this.store$.dispatch(loadingEnd());
            this.dialog.closeAll();
          }
        )),
    { dispatch: false });

  userChangePasswordFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userChangePasswordFailure),
        tap(_ => this.notificationService.error('Se ha producido un error al cambiar la contraseña')),
        map(action => loadingEnd())
      ));

  userGet = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userGet),
        tap(_ => this.store$.dispatch(loadingStart())),
        switchMap(logged =>
          this.userService.userGet(logged.payload.id).pipe(
            map((user) => {
              return userGetSuccess({ payload: { user: user.data() as User } });
            }),
            catchError((error: HttpErrorResponse) => of(userGetFailure({ payload: { message: error.message } }))))
        )));

  userGetSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userGetSuccess),
        tap(() => this.dialog.closeAll()),
        switchMap(action => [
          loadingEnd(),
          userAddressGet({ payload: { user: action.payload.user } })
        ])
      ));

  userGetFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userGetFailure),
        tap(_ => this.notificationService.error('Error al cargar el perfil')),
        map(action => loadingEnd())
      ));

  userAddressGet = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressGet),
        tap(_ => this.store$.dispatch(loadingStart())),
        switchMap(action =>
          this.userService.userAddressGet(action.payload.user).pipe(
            map(addressDocsArray => addressDocsArray.docs.map(doc => doc.data())),
            map((addresses: Address[]) => userAddressGetSuccess({
              payload: {
                user: action.payload.user,
                addresses
              }
            })),
            catchError((error: HttpErrorResponse) => of(userAddressGetFailure({ payload: { message: error.message } }))))
        )));

  userAddressGetSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressGetSuccess),
        map(action => loadingEnd())
      ));

  userAddressGetFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressGetFailure),
        tap(_ => this.notificationService.error('Error al cargar el perfil')),
        map(action => loadingEnd())
      ));

  userCheckEmail = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userCheckEmail),
        switchMap(action =>
        this.userService.userCheckEmail(action.payload.email).pipe(
          map(result => userCheckEmailSuccess({payload: {exist: result}}),
          catchError((error: HttpErrorResponse) => of(userCheckEmailFailure({ payload: { message: error.message } }))))
        ))
      ));

  userAddressUpdate = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressUpdate),
        tap(_ => this.store$.dispatch(loadingStart())),
        switchMap(res =>
          from(this.userService.userAddressUpdate(res.payload.user, res.payload.address, res.payload.edit)).pipe(
            map(() => userAddressUpdateSuccess({
              payload: {
                user: res.payload.user,
                address: res.payload.address,
                edit: res.payload.edit
              }
            })),
            catchError((error: HttpErrorResponse) => of(userAddressUpdateFailure({ payload: { message: error.message } }))))
        )));

  userAddressUpdateSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressUpdateSuccess),
        map(_ => loadingEnd()),
        tap(() => this.router.navigate(['/profile'])
        )));

  userAddressUpdateFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressUpdateFailure),
        tap(_ => this.notificationService.error('Error al actualizar la dirección')),
        map(action => loadingEnd())
      ));

  userAddressRemove = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressRemove),
        tap(_ => this.store$.dispatch(loadingStart())),
        switchMap(res =>
          from(this.userService.userAddressRemove(res.payload.user, res.payload.address)).pipe(
            map(() => userAddressRemoveSuccess({
              payload: {
                user: res.payload.user,
                address: res.payload.address
              }
            })),
            catchError((error: HttpErrorResponse) => of(userAddressRemoveFailure({ payload: { message: error.message } }))))
        )));

  userAddressRemoveSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressRemoveSuccess),
        map(action => loadingEnd())
      ));

  userAddressRemoveFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressRemoveFailure),
        tap(_ => this.notificationService.error('Error al eliminar la dirección')),
        map(action => loadingEnd())
      ));

  userAddressDefault = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressDefault),
        tap(_ => this.store$.dispatch(loadingStart())),
        switchMap(res =>
          from(this.userService.userAddressDefault(res.payload.user, res.payload.default)).pipe(
            switchMap(_ => this.userService.userAddressGet(res.payload.user).pipe(
              map(addressDocsArray => addressDocsArray.docs.map(doc => doc.data())),
              map((addresses: Address[]) => userAddressDefaultSuccess({
                  payload: {
                    user: res.payload.user,
                    addresses
                  }
                })
              ))),
            catchError((error: HttpErrorResponse) => of(userAddressDefaultFailure({ payload: { message: error.message } }))))
        )));

  userAddressDefaultSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressDefaultSuccess),
        map(action => loadingEnd())
      ));

  userAddressDefaultFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressDefaultFailure),
        tap(_ => this.notificationService.error('Error al cambiar la dirección predeterminada')),
        map(action => loadingEnd())
      ));
}
