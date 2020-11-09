import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../core/product-form/product.models';
import { ProductsFilterInterface } from '../../core/products-filter/products-filter.models';
import { Store } from '@ngrx/store';
import {
  selectProductsFilter,
  selectProductsFilterIsEnded,
  selectProductsFilterIsLoading
} from '../../core/products-filter/products-filter.selector';
import { take } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { productListGetImages } from '../../core/product-list/product-list.action';

@Component({
  selector: 'anms-catalogue-wrapper',
  templateUrl: './catalogue-wrapper.component.html',
  styleUrls: ['./catalogue-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogueWrapperComponent implements OnInit {

  private batchSource = new BehaviorSubject(null);
  batch$ = this.batchSource.asObservable();

  private isLoadingSource = new BehaviorSubject(false);
  isLoading$ = this.isLoadingSource.asObservable();

  private isEndedSource = new BehaviorSubject(false);
  isEnded$ = this.isEndedSource.asObservable();

  products$: Observable<Product[]>;
  filter: ProductsFilterInterface;

  nextBatchId: string;

  constructor(
    private store$: Store,
  ) {
  }

  ngOnInit() {
    this.isLoading$ = this.store$.select(selectProductsFilterIsLoading);
    this.isEnded$ = this.store$.select(selectProductsFilterIsEnded);
    this.store$.select(selectProductsFilter).pipe(take(1)).subscribe(res => {
      this.filter = res;
    });
  }

  onNextBatch() {
    this.nextBatchId = uuidv4();
  }

  onBatch($event) {
    this.batchSource.next($event);
  }

  onIsEnded($event: boolean) {
    this.isEndedSource.next($event);
  }

  setProductsObservable($event: Observable<Product[]>) {
    this.products$ = $event;
  }

  onIsLoading($event: boolean) {
    this.isLoadingSource.next($event);
  }

  getProductImages($event: Product) {
    this.store$.dispatch(productListGetImages({payload: {product: $event}}));
  }
}
