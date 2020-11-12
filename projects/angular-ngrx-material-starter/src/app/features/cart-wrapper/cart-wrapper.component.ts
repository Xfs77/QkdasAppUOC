import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { CartLine } from '../../core/cart/cart.models';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { selectCartListState, selectTotalCartListState } from '../../core/cart/cart.selectors';
import { cartRemove, cartUpdate } from '../../core/cart/cart.action';

@Component({
  selector: 'anms-cart-wrapper',
  templateUrl: './cart-wrapper.component.html',
  styleUrls: ['./cart-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartWrapperComponent implements OnInit {

  cart$: Observable<CartLine[]>;
  total$: Observable<number>;

  constructor(
    private store$: Store,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.cart$ = this.store$.select(selectCartListState);
    this.cart$.subscribe(res => console.log(res))
    this.total$ = this.store$.select(selectTotalCartListState);
  }

  removeCart($event: CartLine) {
    this.store$.dispatch(cartRemove({payload: {cart: $event}}));
  }

  updateCart($event: { quantity: number; cartLine: CartLine }) {
    this.store$.dispatch(cartUpdate(
      {
    payload: {
      cart: {...$event.cartLine,
        quantity: $event.quantity
      }
    }
  }));
  }
}
