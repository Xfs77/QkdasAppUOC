import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
  OnDestroy,
  Input, Output, EventEmitter, SimpleChanges
} from '@angular/core';
import { ProductsFilterInterface, Sort } from '../../core/products-filter/products-filter.models';
import { Observable, Subscription } from 'rxjs';
import { emptyProduct, Product } from '../../core/product-form/product.models';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  productsFilterApply,
  productsFilterIsEnded, productsFilterSetAgrupation,
  productsFilterSetBatch, productsFilterSetOffset,
  productsFilterSetSort
} from '../../core/products-filter/products-filter.action';
import { selectProductsFilterIsLoading } from '../../core/products-filter/products-filter.selector';
import {
  selectEmptyProductList,
  selectProductsProductList
} from '../../core/product-list/product-list.selectors';
import { Agrupation } from '../../core/agrupation/agrupation.models';
import { selectAgrupationSelected } from '../../core/agrupation/agrupation.selectors';

@Component({
  selector: 'anms-products-filter-wrapper',
  templateUrl: './products-filter-wrapper.component.html',
  styleUrls: ['./products-filter-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsFilterWrapperComponent implements OnInit, OnChanges, OnDestroy {

  @Input() nextBatchId: number; // Every time we need to fetch data we send an unique id to activate change detection
  @Input() filter: ProductsFilterInterface; // Filter requeriments
  @Input() batch$: Observable<number>; // Batch size that can change during the session depending on the screen size
  @Output() isEndedEvent: EventEmitter<boolean> = new EventEmitter<boolean>(); // Indicates if we have loaded all data
  @Output() isLoadingEvent: EventEmitter<boolean> = new EventEmitter<boolean>(); // Indicates that filter is  loading data
  @Output() productsEvent: EventEmitter<Observable<Product[]>> = new EventEmitter<Observable<Product[]>>(); // List of products that we have loaded
  @Output() productsLengthEvent: EventEmitter<number> = new EventEmitter<number>();

  private lastLoadedProduct: Product = emptyProduct(); // Last loaded  product. Initial value is emptyProduct
  private isEnded = false;
  private batchSub: Subscription; // Subscription to batch size observable.
  private products$: Observable<Product[]>;

  private productsSub: Subscription;

  constructor(
    private store$: Store,
    private router: Router
  ) {
  }

  /***
   *  When we require fetch data, we check if we are subscribed to the batch size and if not subscribe
   *  and then call new data fetch
   ***/
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nextBatchId.currentValue) {
      this.nextBatch();
    }
  }

  ngOnInit() {

    // The data order by reference asc is set programatically and user can not change
    const sort = {} as Sort;
    sort.field = 'reference';
    sort.direction = 'asc';

    this.store$.select(selectAgrupationSelected).subscribe(res => {
      if (res) {
        this.onSelectAgrup(res);
      }
    })
    this.store$.dispatch(productsFilterSetSort({payload: {sort}}));

    this.batchSub = this.batch$.subscribe(res => {
      if (res) {
        this.store$.dispatch(productsFilterSetBatch({payload: {batch: res}}));
      }
    });

    this.store$.select(selectProductsFilterIsLoading).subscribe(res => {
      this.isLoadingEvent.emit(res);
    });
    // Products that filter is loading
    this.products$ = this.store$.select(selectProductsProductList);
    this.productsEvent.emit(this.products$);

    // We control last product loaded with var lastLoadedProduct
    this.productsSub = this.products$.subscribe(res => {
      if (res && res.length > 0) {
        this.lastLoadedProduct = res[res.length - 1];
        this.productsLengthEvent.emit(res.length);
      }
    });

    // We subscribe to emptyProductList to Know when there are no more products to load
    this.store$.select(selectEmptyProductList).subscribe(res => {
      if (res) {
        this.isEnded = res;
        this.isEndedEvent.emit(res);
        this.store$.dispatch(productsFilterIsEnded({payload: {isEnded: true}}));
      }
    });
  }

  /*** Before loading new data we check if exists more or not.
   *   If not we finish. If exists we fetch it.
   ***/
  nextBatch() {
    if (this.isEnded) {
      return;
    }
    this.isEndedEvent.emit(false);
    this.getBatch();
  }

  /*** To load new data first we set new offset to the filter and then apply current filter. ***/
  getBatch() {
    this.store$.dispatch(productsFilterSetOffset({payload: {offset: this.lastLoadedProduct.reference}}));
    this.store$.dispatch(productsFilterApply());

  }

  onSelectAgrup($event: Agrupation) {
    this.isEndedEvent.emit(false);
    this.store$.dispatch(productsFilterSetAgrupation({payload: {agrupation: $event}}));
  }

  ngOnDestroy(): void {
    if (this.router.routerState.snapshot.url.substr(0, 10) !== '/products/') {
      this.productsSub.unsubscribe();
    }
  }
}
