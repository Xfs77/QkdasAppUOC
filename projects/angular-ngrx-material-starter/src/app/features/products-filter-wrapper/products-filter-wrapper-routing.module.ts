import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductsFilterWrapperComponent } from './products-filter-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsFilterWrapperComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsFilterWrapperRoutingModule {}
