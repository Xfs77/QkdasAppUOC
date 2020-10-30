import { createAction, props } from '@ngrx/store';
import { Address, User } from './user.models';

export const userGet = createAction(
  '[User] Get User',
  props<{payload: {id: string}}>(),
);
export const userGetSuccess = createAction(
  '[User] Get User Success',
  props<{payload: {user: User}}>(),
);
export const userGetFailure = createAction(
  '[User] Get User Failure',
  props<{payload: {message: string}}>(),
);
export const userCheckEmail = createAction(
  '[User] Check Email',
  props<{payload: {email: string}}>(),
);
export const userCheckEmailSuccess = createAction(
  '[User] Check Email Success',
  props<{payload: {exist: boolean }}>(),
);
export const userCheckEmailFailure = createAction(
  '[User] Check Email Failure',
  props<{payload: {message: string}}>(),
);
export const userUpdate = createAction(
  '[User] Update User',
  props<{payload: {user: User}}>(),
);
export const userUpdateSuccess = createAction(
  '[User] Update User Success',
  props<{payload: {user: User}}>(),
);
export const userUpdateFailure = createAction(
  '[User] Update User Failure',
  props<{payload: {message: string}}>(),
);
export const userChangePassword = createAction(
  '[User] Change Password User',
  props<{payload: {password: string}}>(),
);
export const userChangePasswordSuccess = createAction(
  '[User] Change Password User Success',
  props<{payload: {password: string}}>(),
);
export const userChangePasswordFailure = createAction(
  '[User] Change Password User Failure',
  props<{payload: {message: string}}>(),
);
export const userAddressGet = createAction(
  '[User] Get User Address',
  props<{payload: {user: User}}>(),
);
export const userAddressGetSuccess = createAction(
  '[User] Get User Address Success',
  props<{payload: {user: User, addresses: Address[]}}>(),
);
export const userAddressGetFailure = createAction(
  '[User] Get User Address Failure',
  props<{payload: {message: string}}>(),
);
export const userAddressUpdate = createAction(
  '[User] Update User Address',
  props<{payload: {user: User, address: Address, edit: boolean}}>(),
);
export const userAddressUpdateSuccess = createAction(
  '[User] Update User Address Success',
  props<{payload: {user: User, address: Address, edit: boolean}}>(),
);
export const userAddressUpdateFailure = createAction(
  '[User] Update User Address Failure',
  props<{payload: {message: string}}>(),
);
export const userAddressRemove = createAction(
  '[User] Remove User Address',
  props<{payload: {user: User, address: Address}}>(),
);
export const userAddressRemoveSuccess = createAction(
  '[User] Remove User Address Success',
  props<{payload: {user: User, address: Address}}>(),
);
export const userAddressRemoveFailure = createAction(
  '[User] Remove User Address Failure',
  props<{payload: {message: string}}>(),
);

export const userAddressDefault = createAction(
  '[User] Set Default Address',
  props<{payload: {user: User, default: Address}}>(),
);
export const userAddressDefaultSuccess = createAction(
  '[User] Set Default Address Success',
  props<{payload: {user: User,  addresses: Address[]}}>(),
);
export const userAddressDefaultFailure = createAction(
  '[User] Set Default Address Failure',
  props<{payload: {message: string}}>(),
);
