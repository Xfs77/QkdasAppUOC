import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter, SimpleChanges, OnChanges
} from '@angular/core';
import { Product } from '../../../../core/product-form/product.models';
import { BehaviorSubject } from 'rxjs';
import { imagesMap } from '../../../../app/app.settings';

@Component({
  selector: 'anms-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductItemComponent implements OnInit, OnChanges {

  @Input() product: Product;
  @Output() editEmitter: EventEmitter<Product> = new EventEmitter();
  @Output() removeEmitter: EventEmitter<Product> = new EventEmitter();

  image$: BehaviorSubject<string> = new BehaviorSubject(``);
  srcSet = ``;
  sendedSrcSet = false;

  constructor() { }

  ngOnInit() {
    if (this.isImages(this.product)) {
      this.generateSrcSet();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.image$.next('')
    if (this.isImages(changes.product.currentValue)) {
      this.generateSrcSet();
    }
  }

  editProduct(product: Product) {
    this.editEmitter.emit(product);
  }

  removeProduct(product: Product) {
    this.removeEmitter.emit(product);
  }

  generateSrcSet() {
    const keys = Object.keys(this.product.mainImage.urls);
    this.srcSet = '';
    for (const item of keys) {
      this.srcSet = this.srcSet.concat(`${this.product.mainImage.urls[item]} ${imagesMap[item]},`);
    }
    this.image$.next(this.srcSet);
    this.sendedSrcSet = true;
  }

  isImages(product: Product): boolean {
    return this.product.mainImage &&
      this.product.mainImage.urls &&
      this.product.mainImage.urls.imgSM !== null && this.product.mainImage.urls.imgSM.toString().indexOf(this.product.mainImage.id) !== -1 &&
      this.product.mainImage.urls.imgM !== null && this.product.mainImage.urls.imgM.toString().indexOf(this.product.mainImage.id) !== -1 &&
      this.product.mainImage.urls.imgL !== null && this.product.mainImage.urls.imgL.toString().indexOf(this.product.mainImage.id) !== -1 &&
      this.product.mainImage.urls.imgXL !== null && this.product.mainImage.urls.imgXL.toString().indexOf(this.product.mainImage.id) !== -1;
  }
}
