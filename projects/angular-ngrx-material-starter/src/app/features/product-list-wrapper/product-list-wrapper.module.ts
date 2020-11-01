import { NgModule } from '@angular/core';
import { ProductFormWrapperComponent } from './product-form-wrapper/product-form-wrapper.component';
import { ProductListWrapperComponent } from './product-list-wrapper.component';
import { SharedModule } from '../../shared/shared.module';
import { ProductListWrapperRoutingModule } from './product-list-wrapper-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form-wrapper/product-form/product-form.component';
import { ImageFormComponent } from './image-form/image-form.component';
import { AgrupationsWrapperModule } from '../agrupations-wrapper/agrupations-wrapper.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProductsFilterWrapperModule } from '../products-filter-wrapper/products-filter-wrapper.module';
import { ProductItemComponent } from './product-list/product-item/product-item.component';



@NgModule({
  declarations: [
    ProductListWrapperComponent,
    ProductFormWrapperComponent,
    ProductFormComponent,
    ProductListComponent,
    ImageFormComponent,
    ProductItemComponent],
  imports: [
    SharedModule,
    ProductListWrapperRoutingModule,
    ProductsFilterWrapperModule,
    AgrupationsWrapperModule,
  ],
  exports: [
    ProductListWrapperComponent
  ],
})
export class ProductListWrapperModule { }
