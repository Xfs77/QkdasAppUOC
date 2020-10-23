import { createAction, props } from '@ngrx/store';

export const loadingStart = createAction(
  '[General] Loading Start'
);
export const loadingEnd = createAction(
  '[General] Loading End'
);
