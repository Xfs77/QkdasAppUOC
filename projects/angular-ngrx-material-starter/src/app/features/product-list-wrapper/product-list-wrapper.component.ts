import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Product } from '../../core/product-form/product.models';
import { ProductsFilterInterface } from '../../core/products-filter/products-filter.models';
import { Store } from '@ngrx/store';
import {
  selectProductsFilter,
  selectProductsFilterIsEnded,
  selectProductsFilterIsLoading
} from '../../core/products-filter/products-filter.selector';
import { take, takeUntil } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import {
  productFormAdd,
  productFormEdit,
  productFormRemove
} from '../../core/product-form/product-form.action';

@Component({
  selector: 'anms-product-list-wrapper',
  templateUrl: './product-list-wrapper.component.html',
  styleUrls: ['./product-list-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListWrapperComponent implements OnInit, OnDestroy {

  private batchSource = new BehaviorSubject(null);
  batch$ = this.batchSource.asObservable();

  private isLoadingSource = new BehaviorSubject(false);
  isLoading$ = this.isLoadingSource.asObservable();

  private isEndedSource = new BehaviorSubject(false);
  isEnded$ = this.isEndedSource.asObservable();

  products$: Observable<Product[]>;
  filter: ProductsFilterInterface;
  private onDestroy = new Subject();

  nextBatchId: string;

  constructor(
    private store$: Store,
  ) {
  }

  ngOnInit() {
    this.isLoading$ = this.store$.select(selectProductsFilterIsLoading);
    this.isEnded$ = this.store$.select(selectProductsFilterIsEnded);
    this.store$.select(selectProductsFilter).pipe(
      take(1),
      takeUntil(this.onDestroy)).subscribe(res => {
      if (res) {
        this.filter = res;
      }
     this.filter = {
        ...this.filter,
        isActive: false,
        isStock: false}
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

  onNew() {
    this.store$.dispatch(productFormAdd());
  }

  onEdit($event) {
    this.store$.dispatch(productFormEdit({payload: {product: $event.product, index: $event.index}}));
  }

  onRemove($event: Product) {
    this.store$.dispatch(productFormRemove({payload: {product: $event}}));
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}

