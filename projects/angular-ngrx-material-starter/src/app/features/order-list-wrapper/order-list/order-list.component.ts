import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
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
  @Output() expedtionEvent: EventEmitter<{order: Order, date: Date}> = new EventEmitter();
  @Output() removeEvent: EventEmitter<{order: Order}> = new EventEmitter();

  size = 150;

  constructor() { }

  ngOnInit(): void {
    if (window.innerWidth > 959) {
      this.size = 90;
    }
  }

  expedition($event: { order: Order; date: Date }) {
    this.expedtionEvent.emit($event);
  }

  remove($event: { order: Order }) {
    this.removeEvent.emit($event);
  }
}
