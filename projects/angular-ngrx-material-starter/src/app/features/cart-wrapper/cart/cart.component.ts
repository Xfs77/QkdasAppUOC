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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../../core/cart/cart.service';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'anms-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit {

  @Input() cart$: Observable<CartLine[]>;
  @Input() stockChecked$: Observable<boolean>;
  @Input() totalImport: Observable<number>;
  @Input() userId: string;
  @Output() iniEvent = new EventEmitter<boolean>();
  @Output() removeEvent = new EventEmitter<CartLine>();
  @Output() updateEvent: EventEmitter<{quantity: number, cartLine: CartLine}> = new EventEmitter();
  @Output() shippingEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() payEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() stockCheckedEvent: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('stepper') stepper: MatStepper;

  validationMessages = [
      { type: 'stock', message: 'No  hay suficiente stock' },
      { type: 'min', message: 'La cantidad debe ser > 1' },

    {type: 'required', message: 'Debe informar una cantidad' }
    ];

  isCreateOrder = false;
  cartForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.createForm();
  }

  onRemoveCart($event) {
    this.removeEvent.emit($event);
  }

  updateCart(quantity: number, item: CartLine) {
    this.updateEvent.emit({quantity, cartLine: item});
  }

  iniOrder() {
    this.isCreateOrder = true;
  }

  next() {
    if (this.stepper._getFocusIndex() === 0) {
      this.iniEvent.emit(true);
    }

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
    if (this.stepper._getFocusIndex() === 0) {
    this.isCreateOrder = false;
  }
    this.stepper.previous();
  }

  onPay() {
    this.payEvent.emit(true);

  }

  private createForm() {
    this.cartForm = this.fb.group({});
    this.cart$.pipe(map((list: CartLine[]) => {
      list.forEach((item: CartLine) => {
        this.cartForm.addControl(item.product.reference, new FormControl(
        item.quantity, [Validators.required, Validators.min(1)], this.cartService.stockValidator(item.product.reference))
        );
          })
      })).subscribe();

  }

  onSubmit() {
    if (this.cartForm.valid) {
      this.cart$.pipe(take(1)).subscribe(res => {
        for (const line of res) {
          if (this.cartForm.get(line.product.reference).value !== line.quantity) {
            this.updateCart(this.cartForm.get(line.product.reference).value , line);
          }
        }
      })
      this.next();
    }
  }
}

