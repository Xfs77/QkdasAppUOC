import { AuthState } from './auth.models';
import { authLoginSuccess, authLogoutSuccess } from './auth.actions';
import { createReducer, on, Action } from '@ngrx/store';
import produce from 'immer';

export const initialState: AuthState = {
  isAuthenticated: false,
  id: null
};

const reducer = createReducer(
  initialState,
  on(authLoginSuccess, produce((draft, action) => {
    draft.isAuthenticated = true;
    draft.id = action.payload.id;
  }, initialState)),
  on(authLogoutSuccess, produce((draft, action) => {
    draft.isAuthenticated = false;
    draft.id = null;
  }, initialState))
);

export function authReducer(
  state: AuthState | undefined,
  action: Action
): AuthState {
  return reducer(state, action);
}
