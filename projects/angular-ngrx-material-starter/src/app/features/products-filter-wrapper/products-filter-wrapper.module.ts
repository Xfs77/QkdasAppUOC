import { NgModule } from '@angular/core';
import { ProductsFilterComponent } from './products-filter/products-filter.component';
import { ProductsFilterWrapperComponent } from './products-filter-wrapper.component';
import { SharedModule } from '../../shared/shared.module';
import { ProductsFilterWrapperRoutingModule } from './products-filter-wrapper-routing.module';
import { AgrupationsWrapperModule } from '../agrupations-wrapper/agrupations-wrapper.module';



@NgModule({
  declarations: [
    ProductsFilterWrapperComponent,
    ProductsFilterComponent
  ],
  imports: [
    SharedModule,
    AgrupationsWrapperModule,
    ProductsFilterWrapperRoutingModule
  ],
  exports: [
    ProductsFilterComponent,
    ProductsFilterWrapperComponent,
  ]
})
export class ProductsFilterWrapperModule { }
