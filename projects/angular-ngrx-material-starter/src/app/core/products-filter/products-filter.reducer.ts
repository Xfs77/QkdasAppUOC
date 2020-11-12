import { ProductsFilterInterface } from './products-filter.models';
import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import {
  productsFilterIsEnded,
  productsFilterIsLoading,
  productsFilterSetAgrupation,
  productsFilterSetBatch, productsFilterSetIsActive, productsFilterSetIsStock,
  productsFilterSetOffset, productsFilterSetSort
} from './products-filter.action';
import { UserState } from '../user/user.reducer';

export interface  ProductsFilterState {
  filter: ProductsFilterInterface;
  isLoading: boolean;
  isEnded: boolean;
}

export const initialProductsFilterState: ProductsFilterState = {
  filter: {
    agrupation: null,
    batch: 0,
    offset: null,
    sort: null,
  } as ProductsFilterInterface,
  isLoading: false,
  isEnded: false
};

const reducer = createReducer(
  initialProductsFilterState,
  on(productsFilterSetAgrupation, produce((draft, action) => {
    draft.filter.agrupation = action.payload.agrupation;
    draft.filter.offset = null;
    draft.isEnded = false;
  })),
  on(productsFilterSetOffset, produce((draft, action) => {
    draft.filter.offset = action.payload.offset;
  })),
  on(productsFilterSetBatch, produce((draft, action) => {
    draft.filter.batch = action.payload.batch;
  })),
  on(productsFilterSetSort, produce((draft, action) => {
    draft.filter.sort = action.payload.sort;
  })),
  on(productsFilterSetIsActive, produce((draft, action) => {
    draft.filter.isActive = action.payload.isActive;
  })),
  on(productsFilterSetIsStock, produce((draft, action) => {
    draft.filter.isStock = action.payload.isStock;
  })),
  on(productsFilterIsLoading, produce((draft, action) => {
    draft.isLoading = action.payload.isLoading;
  })),
  on(productsFilterIsEnded, produce((draft, action) => {
    draft.isEnded = action.payload.isEnded;
  })),
);

export function productsFilterReducer(
  state: ProductsFilterState | undefined,
  action: Action
): ProductsFilterState {
  return reducer(state, action);
}

