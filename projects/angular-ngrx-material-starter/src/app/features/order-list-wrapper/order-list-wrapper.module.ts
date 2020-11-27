import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { OrderListWrapperComponent } from './order-list-wrapper.component';
import { OrderListWrapperRoutingModule } from './order-list-wrapper.routing.module';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderItemComponent } from './order-list/order-item/order-item.component';
import { OrderDetailWrapperComponent } from './order-list/order-item/order-detail-wrapper/order-detail-wrapper.component';
import { OrderDetailComponent } from './order-list/order-item/order-detail-wrapper/order-detail/order-detail.component';



@NgModule({
  declarations: [OrderListWrapperComponent, OrderListComponent, OrderItemComponent, OrderDetailWrapperComponent, OrderDetailComponent],
  imports: [
    SharedModule,
    OrderListWrapperRoutingModule
  ]
})
export class OrderListWrapperModule { }

