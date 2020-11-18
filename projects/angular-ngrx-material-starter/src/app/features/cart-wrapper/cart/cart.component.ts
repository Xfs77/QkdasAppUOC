import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild, ElementRef
} from '@angular/core';
import { CartLine } from '../../../core/cart/cart.models';
import { Observable, of } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'anms-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit {

  @Input() cart$: Observable<CartLine[]>;
  @Input() totalImport: Observable<number>;
  @Input() userId: string;
  @Output() removeEvent = new EventEmitter<CartLine>();
  @Output() updateEvent: EventEmitter<{quantity: number, cartLine: CartLine}> = new EventEmitter();
  @Output() shippingEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() payEvent: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('stepper') stepper: MatStepper;

  isCreateOrder = false;

  constructor() { }

  ngOnInit(): void {
  }

  onRemoveCart($event) {
    this.removeEvent.emit($event);
  }

  updateCart($event, item: CartLine) {
    this.updateEvent.emit({quantity: $event, cartLine: item});
  }

  iniOrder() {
    this.isCreateOrder = true;
  }

  createOrder() {
    this.shippingEvent.emit(true);
  }

  cancelOrder() {
   (this.stepper.reset());

    this.isCreateOrder = false;
  }

  next() {
    this.stepper.next();
    switch (this.stepper._getFocusIndex()) {
      case 1:
        this.shippingEvent.emit(true);
        break;
      case 2:
        this.onPay();
        break;
    }
  }

  back() {
    this.stepper.previous();
  }

  private onPay() {
    this.payEvent.emit(true);

  }
}
