import { ProductFormWrapperComponent } from './product-form-wrapper/product-form-wrapper.component';
import { ProductListWrapperComponent } from './product-list-wrapper.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: ProductListWrapperComponent,
    pathMatch: 'full'
  },
  {
    path: 'add',
    component: ProductFormWrapperComponent,
  },
  {
    path: 'edit/:reference',
    component: ProductFormWrapperComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductListWrapperRoutingModule {}
