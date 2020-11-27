import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrderListWrapperComponent } from './order-list-wrapper.component';
import { OrderDetailWrapperComponent } from './order-list/order-item/order-detail-wrapper/order-detail-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: OrderListWrapperComponent,
    data:  {title: 'Pedidos'},
    pathMatch: 'full'
  },

  {
    path: ':orderId',
    component: OrderDetailWrapperComponent,
    data:  {title: 'Pedidos'},
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderListWrapperRoutingModule {}
