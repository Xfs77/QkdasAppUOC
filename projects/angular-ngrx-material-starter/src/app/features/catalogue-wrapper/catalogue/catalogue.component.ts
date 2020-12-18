import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  Inject,
  AfterViewInit,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../../core/product-form/product.models';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { map, takeWhile } from 'rxjs/operators';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { IPageInfo } from 'ngx-virtual-scroller';
import { CartLine } from '../../../core/cart/cart.models';

@Component({
  selector: 'anms-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogueComponent implements OnInit, AfterViewInit {

  @Input() products$: Observable<Product[]>; // product list
  @Input() isLoading$; // indicates if it's loading data and we have to wait to do next call
  @Input() isEnded$; // indicates if we have gotten all product list data
  @Output() batchEvent = new EventEmitter<number>(); // calculates batch number depending of the viewer
  @Output() nextBatchEvent = new EventEmitter<boolean>(); // indicates that needs more data
  @Output() productImagesEvent = new EventEmitter<Product>();
  @Output() addCartEvent = new EventEmitter<{cart: CartLine}>();
  @Output() favoriteEvent = new EventEmitter<{product: Product}>();

  private productsLength: number;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data
  ) {}

  ngOnInit() {
    this.products$.subscribe(res => {
      this.productsLength = res.length;
    });
  }

  ngAfterViewInit() {
    if (window.innerWidth < 600) {
      const pictureHeight = (window.innerWidth - 32 - 24 - 32 ) * 1600 / 1200 + 16 * 2 + 12 * 2 +  100 ;
      this.batchEvent.emit(Math.ceil((window.innerHeight - 56) / pictureHeight ) + 2);
    } else if (window.innerWidth >= 600 && window.innerWidth < 960) {
      const pictureHeight = (window.innerWidth - 32 - 32 * 4 - 24 * 4) / 4 * 1600 / 1200 + 16 * 2 + 12 * 2 +  100;
      this.batchEvent.emit(Math.ceil((window.innerHeight - 64 - 105) / pictureHeight ) * 4 + 4);
    } else if (window.innerWidth >= 960 && window.innerWidth < 1280) {
      const pictureHeight = ((window.innerWidth - 32 ) * 0.7 - 16 - 32 * 4 - 24 * 4) / 4 * 1600 / 1200 + 16 * 2 + 12 * 2 +  100;
      this.batchEvent.emit(Math.ceil((window.innerHeight - 64 - 105) / pictureHeight ) *  4 + 4);
    } else if (window.innerWidth >= 1280) {
      const pictureHeight = ((window.innerWidth - 32 ) * 0.7 - 16 - 32 * 6 - 24 * 6) / 6 * 1600 / 1200 + 16 * 2 + 12 * 2 +  100;
      this.batchEvent.emit(Math.ceil((window.innerHeight - 64 - 105) / pictureHeight ) * 6 + 6);
    }
  }

  fetchMore(event: IPageInfo) {
    if (this.productsLength === 0 || event.endIndex !== this.productsLength - 1) { return; }
    this.nextBatchEvent.emit(true);
  }


  availableViewerHeight() {
    if (window.innerWidth < 600) {
      return (window.innerHeight - 56 - 20);
    } else {
      return (window.innerHeight - 64 - 105);
    }
  }

  availableVieweWidth() {
    return window.innerWidth - 24;
  }

  openImageViewer(product: Product) {
    if (!product.images) {
      this.productImagesEvent.emit(product);
    }
    this.products$.pipe(
      map(items => items.filter(item => item.reference === product.reference)),
      takeWhile(filtered => {
        if (filtered.length > 0 && filtered[0].images) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = {
            images: filtered[0].images,
            description: product.descr,
            reference: product.reference
          };
          dialogConfig.closeOnNavigation = true;
          dialogConfig.position = {
            top: '70px'
          };
          dialogConfig.width =  `calc(100vw - 24px)`;
          dialogConfig.maxWidth =  `calc(100vw)`;
          dialogConfig.maxHeight = `${this.availableViewerHeight()}px`;
          dialogConfig.height = `${this.availableViewerHeight() - 12}px`;
          dialogConfig.panelClass = 'image_viewer-container';
          this.dialog.open(ImageViewerComponent, dialogConfig);
          return false;
        }
        return true;
      })).subscribe();
  }

  addToCart($event: {cart: CartLine}) {
    this.addCartEvent.emit($event);
  }

  favorite($event: { product: Product }) {
      this.favoriteEvent.emit($event);
  }

  trackBy(index: number, product: Product): string {
    return product.reference;
  }
}
