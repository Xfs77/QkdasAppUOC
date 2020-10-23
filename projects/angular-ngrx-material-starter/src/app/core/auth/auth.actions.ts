import { createAction, props } from '@ngrx/store';

export const authLogin = createAction(
  '[Auth] Login',
        props<{payload: {email: string; password: string; }}>(),
  );
export const authLoginSuccess = createAction(
  '[Auth] Login Success',
  props<{payload: {id: string; token: string; }}>(),
);
export const authLoginFailure = createAction(
  '[Auth] Login Failure',
  props<{payload: {message: string}}>(),
);
export const authLogout = createAction(
  '[Auth] Logout'
);
export const authLogoutSuccess = createAction(
  '[Auth] Logout Success'
);
