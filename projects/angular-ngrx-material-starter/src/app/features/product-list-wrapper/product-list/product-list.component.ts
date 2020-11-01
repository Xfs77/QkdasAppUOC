import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  Input,
  Output,
  EventEmitter, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../../core/product-form/product.models';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { Store } from '@ngrx/store';
import { filter, withLatestFrom } from 'rxjs/operators';
import {
  productFormAdd,
  productFormEdit,
  productFormRemove
} from '../../../core/product-form/product-form.action';

@Component({
  selector: 'anms-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit, AfterViewInit {
  @Input() products$: Observable<Product[]>; // product list
  @Input() isLoading$; // indicates if it's loading data and we have to wait to do next call
  @Input() isEnded$; // indicates if we have gotten all product list data
  @Output() batchEvent = new EventEmitter<number>(); // calculates batch number depending of the viewer
  @Output() nextBatchEvent = new EventEmitter<boolean>(); // indicates that needs more data
  @Output() newEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter<Product>();
  @Output() removeEvent = new EventEmitter<Product>();

  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport; // viewport where we are displaying items

  constructor(
    private store$: Store,
    private scrollDispatcher: ScrollDispatcher,
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.batchEvent.emit(Math.round(this.availableViewerHeight() / 100) + 1 );

    const scroll$ = this.scrollDispatcher.scrolled().pipe(
      filter(event => {
          return this.viewport.getRenderedRange().end === this.viewport.getDataLength();
        }
      ));

    scroll$.pipe(withLatestFrom(this.isLoading$, this.isEnded$)).subscribe(res => {
      if (!res[1] && !res[2]) {
        this.nextBatchEvent.emit(true);
      }
    });
  }

  trackByIdx(index, item) {
    return item;
  }

  newProduct() {
    this.newEvent.emit();
  }

  editProduct(product: Product) {
    this.editEvent.emit(product);
  }

  removeProduct(product: Product) {
    this.removeEvent.emit(product);
  }

  availableViewerHeight() {
    if (window.innerWidth < 600) {
      return (window.innerHeight - 56 - 105);
    } else {
      return (window.innerHeight - 64 - 105);
    }
  }
}
