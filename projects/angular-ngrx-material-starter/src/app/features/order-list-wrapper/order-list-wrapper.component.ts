import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../core/order/order.models';
import { Store } from '@ngrx/store';
import { selectOrders } from '../../core/order/order.selectors';
import { orderListGet, orderRemove, orderUpdate } from '../../core/order/order.action';
import { User } from '../../core/user/user.models';
import { selectUserProfile } from '../../core/user/user.selectors';

@Component({
  selector: 'anms-order-list-wrapper',
  templateUrl: './order-list-wrapper.component.html',
  styleUrls: ['./order-list-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListWrapperComponent implements OnInit {

  order$: Observable<Order[]>;
  user$: Observable<User>;

  constructor(
    private store$: Store,
  ) { }

  ngOnInit(): void {
    this.store$.dispatch(orderListGet());
    this.order$ = this.store$.select(selectOrders);
    this.user$ = this.store$.select(selectUserProfile);
  }

  expedition($event: { order: Order; date: Date }) {
    // this.store$.dispatch(orderUpdate({payload: {order: {id: $event.order.id, changes: {user: $event.order.user, expedition: $event.date}}}}))
  }

  remove($event: { order: Order }) {
    this.store$.dispatch(orderRemove({payload: $event}));
  }
}
