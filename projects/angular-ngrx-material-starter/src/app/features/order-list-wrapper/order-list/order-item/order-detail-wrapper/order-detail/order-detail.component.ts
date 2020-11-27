import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../../../../../core/order/order.models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'anms-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailComponent implements OnInit {

  @Input() order$: Observable<Order>;

  total$ : Observable<number>;

  ngOnInit(): void {
    this.total$ = this.order$.pipe(map(order => {
      let total = 0;
      for (const line of order.orderLines) {
        total = total + line.quantity * line.price;
      }
      return total;
    }));

  }

}
