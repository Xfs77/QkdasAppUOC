import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { GeneralState } from './general.models';
import { loadingEnd, loadingStart } from './general.action';

export const initialGeneralState: GeneralState = {
  loading: false,
};

const reducer = createReducer(
  initialGeneralState,
  on(loadingStart, produce((draft, action) =>  {
    draft.loading = true;
  })),
  on(loadingEnd, produce((draft, action) =>  {
    draft.loading = false;
  }))
);

export function generalReducer(
  state: GeneralState | undefined,
  action: Action
): GeneralState {
  return reducer(state, action);
}
