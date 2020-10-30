import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import { productsFilterApply, productsFilterIsLoading } from './products-filter.action';
import { selectProductsFilter } from './products-filter.selector';
import { productListGet, productListReset } from '../product-list/product-list.action';

@Injectable()
export class ProductsFilterEffects {
  constructor(
    private actions$: Actions,
    public store$: Store) {
  }


  productsFilterApply = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(productsFilterApply),
        withLatestFrom(this.store$.select(selectProductsFilter)),
        mergeMap(([action, filter]) => {
            if (!filter.offset) {
              return [
               productListReset(),
                productListGet({payload: {filter}}),
                productsFilterIsLoading({payload: {isLoading: true}})
              ];
            }
            return [
              productListGet({payload: {filter}}),
              productsFilterIsLoading({payload: {isLoading: true}})
            ];
          }
        ));
    }

  )





}
