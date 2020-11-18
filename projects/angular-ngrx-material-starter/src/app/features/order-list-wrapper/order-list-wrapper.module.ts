import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { OrderListWrapperComponent } from './order-list-wrapper.component';
import { OrderListWrapperRoutingModule } from './order-list-wrapper.routing.module';
import { OrderListComponent } from './order-list/order-list.component';



@NgModule({
  declarations: [OrderListWrapperComponent, OrderListComponent],
  imports: [
    SharedModule,
    OrderListWrapperRoutingModule
  ]
})
export class OrderListWrapperModule { }

