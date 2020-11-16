import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CartWrapperComponent } from './cart-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: CartWrapperComponent,
    data:  {title: 'Cesta'},
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartWrapperRoutingModule {}
