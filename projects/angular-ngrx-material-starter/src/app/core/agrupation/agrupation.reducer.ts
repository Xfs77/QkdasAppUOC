import { AgrupationState } from './agrupation.models';
import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import {
  agrupationGetSuccess,
  agrupationRemoveSuccess,
  agrupationUpdateSuccess, currentSelectedAgrupation, resetCurrentSelectedAgrupation
} from './agrupation.action';
import { arrayToObject } from '../../shared/utils/functions';

export const initialAgrupationState: AgrupationState = {
  agrupations: {} ,
  children: {},
  currentSelectedAgrup: {},
};

const reducer = createReducer(
  initialAgrupationState,
  on(agrupationUpdateSuccess, produce((draft, action) =>  {
    draft.children[action.payload.parent.id][action.payload.agrupation.id] = action.payload.agrupation;
  })),
  on(agrupationGetSuccess, produce((draft, action) =>  {
    const tmp = {};
    for (const item of action.payload.children) {
      tmp[item.id] = {};
    }
    if (action.payload.children.length > 0) {
      draft.agrupations = {
        ...draft.agrupations,
        ...arrayToObject(action.payload.children)
      };
      draft.children = {
        ...draft.children,
        ...tmp,
        [action.payload.agrupation.id]: {...arrayToObject(action.payload.children)}
      };
    }
  })),
  on(agrupationRemoveSuccess, produce((draft, action) =>  {
    delete draft.agrupations[action.payload.agrupation.id] ;
 delete draft.children[action.payload.agrupation.id];
       delete draft.children[action.payload.parent.id][action.payload.agrupation.id];
  })),
  on(currentSelectedAgrupation, produce((draft, action) =>  {
    draft.currentSelectedAgrup = {};
    draft.currentSelectedAgrup[action.payload.agrupation.id] = action.payload.agrupation;
  })),
  on(resetCurrentSelectedAgrupation, produce((draft, action) =>  {
    draft.currentSelectedAgrup = {};
  }))
);

export function agrupationReducer(
  state: AgrupationState | undefined,
  action: Action
): AgrupationState {
  return reducer(state, action);
}
