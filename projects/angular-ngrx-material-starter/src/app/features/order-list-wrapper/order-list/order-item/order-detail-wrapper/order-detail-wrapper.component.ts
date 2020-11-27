import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectOrderById, selectOrders } from '../../../../../core/order/order.selectors';
import { Order } from '../../../../../core/order/order.models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'anms-order-detail-wrapper',
  templateUrl: './order-detail-wrapper.component.html',
  styleUrls: ['./order-detail-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailWrapperComponent implements OnInit {

  order$: Observable<Order>;

  constructor(
    private store$: Store,
    private router: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.router.params.subscribe(res => {
      if (res.orderId) {
        this.order$ = this.store$.select(selectOrderById, { orderId: res.orderId });
      }
    });
  }

}

