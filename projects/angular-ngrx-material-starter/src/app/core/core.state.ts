import {
  ActionReducerMap,
  MetaReducer,
  createFeatureSelector
} from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { environment } from '../../environments/environment';

import { initStateFromLocalStorage } from './meta-reducers/init-state-from-local-storage.reducer';
import { debug } from './meta-reducers/debug.reducer';
import { AuthState } from './auth/auth.models';
import { authReducer } from './auth/auth.reducer';
import { RouterStateUrl } from './router/router.state';
import { settingsReducer } from './settings/settings.reducer';
import { SettingsState } from './settings/settings.model';
import { UserState } from './user/user.models';
import { userReducer } from './user/user.reducer';
import { AgrupationState } from './agrupation/agrupation.models';
import { agrupationReducer } from './agrupation/agrupation.reducer';
import { GeneralState } from './general/general.models';
import { generalReducer } from './general/general.reducer';

export const reducers: ActionReducerMap<AppState> = {
  general: generalReducer,
  auth: authReducer,
  settings: settingsReducer,
  router: routerReducer,
  profile: userReducer,
  agrupation: agrupationReducer
};

export const selectGeneralState = createFeatureSelector<AppState, GeneralState>(
  'general'
);
export const selectAuthState = createFeatureSelector<AppState, AuthState>(
  'auth'
);
export const selectUserState = createFeatureSelector<AppState, UserState>(
  'profile'
);
export const selectAgrupationState = createFeatureSelector<AppState, AgrupationState>(
  'agrupation'
);

export const selectSettingsState = createFeatureSelector<AppState, SettingsState>(
  'settings'
);

export const selectRouterState = createFeatureSelector<AppState, RouterReducerState<RouterStateUrl>>(
  'router'
);

export interface AppState {
  general: GeneralState;
  auth: AuthState;
  profile: UserState;
  agrupation: AgrupationState;
  settings: SettingsState;
  router: RouterReducerState<RouterStateUrl>;
}
