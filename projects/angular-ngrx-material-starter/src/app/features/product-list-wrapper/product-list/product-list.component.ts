import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  Input,
  Output,
  EventEmitter, ViewChild, OnChanges, SimpleChanges
} from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Product } from '../../../core/product-form/product.models';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { take } from 'rxjs/operators';


@Component({
  selector: 'anms-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ProductListComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() products$: Observable<Product[]>; // product list
  @Input() isLoading$; // indicates if it's loading data and we have to wait to do next call
  @Input() isEnded$; // indicates if we have gotten all product list data
  @Output() batchEvent = new EventEmitter<number>(); // calculates batch number depending of the viewer
  @Output() nextBatchEvent = new EventEmitter<boolean>(); // indicates that needs more data
  @Output() newEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter<Product>();
  @Output() removeEvent = new EventEmitter<Product>();

  @ViewChild('viewer') viewport: CdkVirtualScrollViewport; // viewport where we are displaying items

  constructor() {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.batchEvent.emit(Math.round(this.availableViewerHeight() / 100) + 3 );
  }

  checkBatch() {

    if (this.viewport.getRenderedRange().end === this.viewport.getDataLength()) {
      combineLatest([this.isLoading$, this.isEnded$]).pipe(take(1)).subscribe(res => {
        if (!res[0] && !res[1]) {
          this.nextBatchEvent.emit(true);
        }
      });
    }
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
      return (window.innerHeight - 56 - 90 - 105);
    } else {
      return (window.innerHeight - 64 - 90 - 105);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
