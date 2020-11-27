import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CartWrapperComponent } from './cart-wrapper.component';
import { AddressWrapperComponent } from './address-wrapper/address-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: CartWrapperComponent,
    data:  {title: 'Cesta'},
    pathMatch: 'full'
  },
  {
    path: 'address',
    component: AddressWrapperComponent,
    data:  {title: 'Cesta'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartWrapperRoutingModule {}
