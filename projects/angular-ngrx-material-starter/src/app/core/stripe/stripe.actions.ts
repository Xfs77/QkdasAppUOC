import { createAction, props } from '@ngrx/store';

export const userGet = createAction(
  '[User] Get User',
  props<{payload: {id: string}}>(),
);
