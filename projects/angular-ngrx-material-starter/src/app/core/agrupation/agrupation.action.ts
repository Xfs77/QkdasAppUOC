import { createAction, props } from '@ngrx/store';
import { Agrupation } from './agrupation.models';

export const agrupationUpdate = createAction(
  '[Agrupation] Update Agrupation',
  props<{payload: {parent: Agrupation, agrupation: Agrupation, edit: boolean}}>()
);
export const agrupationUpdateSuccess = createAction(
  '[Agrupation] Update Agrupation Success',
  props<{payload: {parent: Agrupation, agrupation: Agrupation}}>()
);
export const agrupationUpdateFailure = createAction(
  '[Agrupation] Update Agrupation Failure',
  props<{payload: {message: string}}>()
);

export const agrupationRemove = createAction(
  '[Agrupation] Remove Agrupation',
  props<{payload: {parent: Agrupation, agrupation: Agrupation}}>()
);
export const agrupationRemoveSuccess = createAction(
  '[Agrupation] Remove Agrupation Success',
  props<{payload: {parent: Agrupation, agrupation: Agrupation}}>()
);
export const agrupationRemoveFailure = createAction(
  '[Agrupation] Remove Agrupation Failure',
  props<{payload: {message: string}}>()
);

export const agrupationGet = createAction(
  '[Agrupation] Get Agrupation',
  props<{payload: {agrupation: Agrupation}}>()
);
export const agrupationGetSuccess = createAction(
  '[Agrupation] Get Agrupation Success',
  props<{payload: {agrupation: Agrupation, children: Agrupation[]}}>()
);
export const agrupationGetFailure = createAction(
  '[Agrupation] Get Agrupation Failure',
  props<{payload: {message: string}}>()
);

export const currentSelectedAgrupation = createAction(
  '[Agrupation] Cuurrent Selected Agrupation',
  props<{payload: {agrupation: Agrupation}}>()
);
export const resetCurrentSelectedAgrupation = createAction(
  '[Agrupation] Reset Cuurrent Selected Agrupation',
);
