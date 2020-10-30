import { createAction, props } from '@ngrx/store';
import { Product } from '../product-form/product.models';
import { Agrupation } from '../agrupation/agrupation.models';
import { Sort } from './products-filter.models';

export const productsFilterSetAgrupation = createAction(
  '[Products Filter] Set Agrupation',
  props<{payload: {agrupation: Agrupation}}>()
);
export const productsFilterSetBatch = createAction(
  '[Products Filter] Set Batch',
  props<{payload: {batch: number}}>()
);
export const productsFilterSetOffset = createAction(
  '[Products Filter] Set Offset',
  props<{payload: {offset: string}}>()
);
export const productsFilterSetSort = createAction(
  '[Products Filter] Set Sort',
  props<{payload: {sort: Sort}}>()
);
export const productsFilterIsLoading = createAction(
  '[Products Filter] Is Loading',
  props<{payload: {isLoading: boolean}}>()
);
export const productsFilterIsEnded = createAction(
  '[Products Filter] Is Ended',
  props<{payload: {isEnded: boolean}}>()
);
export const productsFilterApply = createAction(
  '[Products Filter] Apply'
);
