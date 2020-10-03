import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import {
  userAddressDefault, userAddressDefaultFailure, userAddressDefaultSuccess,
  userAddressGet,
  userAddressGetFailure,
  userAddressGetSuccess, userAddressRemove, userAddressRemoveFailure, userAddressRemoveSuccess,
  userAddressUpdate, userAddressUpdateFailure,
  userAddressUpdateSuccess,
  userGet,
  userGetFailure,
  userGetSuccess,
  userUpdate,
  userUpdateFailure,
  userUpdateSuccess
} from './user.actions';
import { Address, User } from './user.models';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }
  userUpdate = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdate),
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
        tap(() => this.router.navigate(['/profile'])
        )),
    {dispatch: false});

  userGet = createEffect(
    () =>
      this.actions$.pipe(
    ofType(userGet),
    switchMap(logged  =>
      this.userService.userGet(logged.payload.id).pipe(
        map((user) => {
          return userGetSuccess({payload: {user: user.data() as User}});
        }),
        catchError((error: HttpErrorResponse) => of(userGetFailure({payload: {message: error.message}}))))
    )));

  userGetSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userGetSuccess),
        tap(() => this.dialog.closeAll()),
        map(action => {
          return userAddressGet({payload: {user: action.payload.user}});
        })
      ));

 userGetAddress = createEffect(
   () =>
     this.actions$.pipe(
       ofType(userAddressGet),
       switchMap(action  =>
         this.userService.userAddressGet(action.payload.user).pipe(
           map(addressDocsArray => addressDocsArray.docs.map(doc => doc.data())),
           map( (addresses: Address[]) => userAddressGetSuccess({payload: {user: action.payload.user, addresses}})),
           catchError((error: HttpErrorResponse) => of(userAddressGetFailure({payload: {message: error.message}}))))
         )));

  userAddressUpdate = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressUpdate),
        switchMap(res  =>
          from(this.userService.userAddressUpdate(res.payload.user, res.payload.address, res.payload.edit)).pipe(
            map(() => userAddressUpdateSuccess({payload: {user: res.payload.user, address: res.payload.address, edit: res.payload.edit}})),
            catchError((error: HttpErrorResponse) => of(userAddressUpdateFailure({payload: {message: error.message}}))))
        ))
  );

  userAddressUpdateSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressUpdateSuccess),
        tap(() => this.router.navigate(['/profile'])
        )),
    {dispatch: false});

  userAddressRemove = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressRemove),
        switchMap(res  =>
          from(this.userService.userAddressRemove(res.payload.user, res.payload.address)).pipe(
            map(() => userAddressRemoveSuccess({payload: {user: res.payload.user, address: res.payload.address}})),
            catchError((error: HttpErrorResponse) => of(userAddressRemoveFailure({payload: {message: error.message}}))))
  )));

  userAddressDefault = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userAddressDefault),
        switchMap(res =>
          from(this.userService.userAddressDefault(res.payload.user, res.payload.default)).pipe(
            switchMap(_ => this.userService.userAddressGet(res.payload.user).pipe(
              map(addressDocsArray => addressDocsArray.docs.map(doc => doc.data())),
              map((addresses: Address[]) => userAddressDefaultSuccess({payload: {user: res.payload.user, addresses}})
              ))),
            catchError((error: HttpErrorResponse) => of(userAddressDefaultFailure({payload: {message: error.message}}))))
        )));
}
