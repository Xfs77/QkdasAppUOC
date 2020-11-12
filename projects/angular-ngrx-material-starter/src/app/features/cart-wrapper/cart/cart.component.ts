import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CartLine } from '../../../core/cart/cart.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'anms-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit {

  @Input() cart$: Observable<CartLine[]>;
  @Input() totalImport: Observable<number>;
  @Output() removeEvent = new EventEmitter<CartLine>();
  @Output() updateEvent: EventEmitter<{quantity: number, cartLine: CartLine}> = new EventEmitter();
  @Output() paymentEvent: EventEmitter<{totalAmount: number}> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onRemoveCart($event) {
    this.removeEvent.emit($event);
  }

  arrayOne(n: number): any[] {
    const tmp = [];
    for (let i = 1; i < 11; i++) {
      tmp.push(i);
    }
    return tmp;
  }

  updateCart($event, item: CartLine) {
    this.updateEvent.emit({quantity: $event, cartLine: item});
  }

}
