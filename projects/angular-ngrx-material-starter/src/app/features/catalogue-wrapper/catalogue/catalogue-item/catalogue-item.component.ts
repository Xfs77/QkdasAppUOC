import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  SimpleChanges, OnChanges
} from '@angular/core';
import { Product } from '../../../../core/product-form/product.models';
import { CartLine } from '../../../../core/cart/cart.models';
import { BehaviorSubject } from 'rxjs';
import { imagesMap } from '../../../../app/app.settings';
import { v1 as uuidv1 } from 'uuid';


@Component({
  selector: 'anms-catalogue-item',
  templateUrl: './catalogue-item.component.html',
  styleUrls: ['./catalogue-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogueItemComponent implements OnInit, OnChanges {

  @Input() product: Product;
  @Output() imagesViewerEvent = new EventEmitter<Product>();
  @Output() addCartEvent = new EventEmitter<{ cart: CartLine }>();
  @Output() favoriteEvent = new EventEmitter<{ product: Product }>();

  image$: BehaviorSubject<string> = new BehaviorSubject(``);
  srcSet = ``;
  sizes = ``;
  favoriteClick = false;
  sendedSrcSet = false;

  constructor() {
  }

  ngOnInit() {
    if (this.isImages(this.product)) {
      this.generateSizes();
      this.generateSrcSet();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if (this.isImages(changes.product.currentValue)) {
      this.generateSizes();
      this.generateSrcSet();
    }
  }

  generateSizes() {

    let sizes = ``;

    sizes = sizes.concat(`(min-width: 1280px) ${((window.innerWidth - 32) * 0.7 - 16 - 32 * 6 - 24 * 6) / 6}px, `);
    sizes = sizes.concat(`(min-width: 960px)  ${((window.innerWidth - 32) * 0.7 - 16 - 32 * 4 - 24 * 4) / 4}px, `);
    sizes = sizes.concat(`(min-width: 600px) ${window.innerWidth - 32 - 32 * 4 - 24 * 4}px, `);
    sizes = sizes.concat(`(min-width: 0px) ${window.innerWidth - 32 - 32 - 24}px, `);

    this.sizes = sizes;
  }

  generateSrcSet() {
    const keys = Object.keys(this.product.mainImage.urls);
    keys.forEach(item => {
      this.srcSet = this.srcSet.concat(`${this.product.mainImage.urls[item]} ${imagesMap[item]},`);
    });
    this.image$.next(this.srcSet);
    this.sendedSrcSet = true;
  }

  isImages(product: Product): boolean {
    return this.product.mainImage &&
      this.product.mainImage.urls &&
      this.product.mainImage.urls.imgSM !== null &&
      this.product.mainImage.urls.imgM !== null &&
      this.product.mainImage.urls.imgL !== null &&
      this.product.mainImage.urls.imgXL !== null &&
      !this.sendedSrcSet;
  }

  openImageViewer() {
    this.imagesViewerEvent.emit(this.product);
  }

  addToCart() {
    const cartLine: CartLine = {} as CartLine;
    cartLine.product = this.product;
    cartLine.quantity = 1;
    cartLine.id = uuidv1();
    this.addCartEvent.emit({ cart: cartLine });
  }

  favorite($event: Product) {
    this.favoriteClick = true;
      this.favoriteEvent.emit({product: $event});
  }
}
