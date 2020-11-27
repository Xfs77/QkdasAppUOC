import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { Order } from '../../../../core/order/order.models';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'anms-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderItemComponent implements OnInit {

  @Input() order: Order;
  @Output() expedtionEvent: EventEmitter<{order: Order, date: Date}> = new EventEmitter();
  @Output() removeEvent: EventEmitter<{order: Order}> = new EventEmitter();

  total = 0;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    for (const line of this.order.orderLines) {
      this.total = this.total + line.quantity * line.price;
    }
  }

  expedition() {
    if (this.order.expedition) {
      this.expedtionEvent.emit({order: this.order, date: null});
    } else {
      this.expedtionEvent.emit({order: this.order, date: new Date()});
    }
  }

  detail() {
    this.router.navigate([`${this.order.id}`], {relativeTo: this.route})
  }

  remove() {
    this.removeEvent.emit({order: this.order});
  }
}
