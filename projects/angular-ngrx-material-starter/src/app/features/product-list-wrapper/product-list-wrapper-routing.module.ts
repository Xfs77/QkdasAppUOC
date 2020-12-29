import { ProductFormWrapperComponent } from './product-form-wrapper/product-form-wrapper.component';
import { ProductListWrapperComponent } from './product-list-wrapper.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: ProductListWrapperComponent,
    pathMatch: 'full',
    data:  {title: 'anms.menu.products'},
  },
  {
    path: 'add',
    component: ProductFormWrapperComponent,
    data:  {title: 'anms.menu.products_add'},
  },
  {
    path: 'edit/:reference',
    component: ProductFormWrapperComponent,
    data:  {title: 'anms.menu.products_edit'},
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductListWrapperRoutingModule {}
