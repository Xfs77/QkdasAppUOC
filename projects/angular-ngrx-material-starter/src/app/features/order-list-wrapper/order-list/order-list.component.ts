import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../../core/order/order.models';

@Component({
  selector: 'anms-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListComponent implements OnInit {

  @Input() order$: Observable<Order[]>;

  constructor() { }

  ngOnInit(): void {
  }

}
