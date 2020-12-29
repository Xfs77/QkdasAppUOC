import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectOrderById, selectOrders } from '../../../../../core/order/order.selectors';
import { Order } from '../../../../../core/order/order.models';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'anms-order-detail-wrapper',
  templateUrl: './order-detail-wrapper.component.html',
  styleUrls: ['./order-detail-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailWrapperComponent implements OnInit, OnDestroy {

  order$: Observable<Order>;
  private onDestroy = new Subject();

  constructor(
    private store$: Store,
    private router: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.router.params.pipe(takeUntil(this.onDestroy)).subscribe(res => {
      if (res.orderId) {
        this.order$ = this.store$.select(selectOrderById, { orderId: res.orderId });
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

}

