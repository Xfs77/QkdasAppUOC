import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrderListWrapperComponent } from './order-list-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: OrderListWrapperComponent,
    data:  {title: 'Pedidos'},
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderListWrapperRoutingModule {}
