import { AuthState } from './auth.models';
import { authLogin, authLoginSuccess, authLogout, authLogoutSuccess } from './auth.actions';
import { createReducer, on, Action } from '@ngrx/store';

export const initialState: AuthState = {
  isAuthenticated: false,
  id: null
};

const reducer = createReducer(
  initialState,
  on(authLoginSuccess, (state, {payload}) => ({ ...state, isAuthenticated: true, id: payload.id
  })),
  on(authLogoutSuccess, (state) => ({ ...state, isAuthenticated: false, id: null }))
);

export function authReducer(
  state: AuthState | undefined,
  action: Action
): AuthState {
  return reducer(state, action);
}
