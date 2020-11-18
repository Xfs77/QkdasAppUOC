import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../core/order/order.models';
import { Store } from '@ngrx/store';
import { selectOrders } from '../../core/order/order.selectors';
import { orderListGet } from '../../core/order/order.action';

@Component({
  selector: 'anms-order-list-wrapper',
  templateUrl: './order-list-wrapper.component.html',
  styleUrls: ['./order-list-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListWrapperComponent implements OnInit {

  order$: Observable<Order[]>;

  constructor(
    private store$: Store,
  ) { }

  ngOnInit(): void {
    this.store$.dispatch(orderListGet())
    this.order$ = this.store$.select(selectOrders);
    this.order$.subscribe(res => console.log(res))

  }

}
