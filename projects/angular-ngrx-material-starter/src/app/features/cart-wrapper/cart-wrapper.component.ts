import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CartLine } from '../../core/cart/cart.models';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {
  selectCartlineById,
  selectCartListState, selectCartStockChecked,
  selectTotalCartListState
} from '../../core/cart/cart.selectors';
import {
  cartCheckStock,
  cartRemove,
  cartStockChecked,
  cartUpdate
} from '../../core/cart/cart.action';
import { take } from 'rxjs/operators';
import { NotificationService } from '../../core/notifications/notification.service';
import { AddressWrapperComponent } from './address-wrapper/address-wrapper.component';
import { CartComponent } from './cart/cart.component';
import { selectUserProfile } from '../../core/user/user.selectors';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Order, OrderLine, OrderStatus } from '../../core/order/order.models';
import { stripeGetCheckout } from '../../core/stripe/stripe.actions';
import { orderCreate } from '../../core/order/order.action';

@Component({
  selector: 'anms-cart-wrapper',
  templateUrl: './cart-wrapper.component.html',
  styleUrls: ['./cart-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartWrapperComponent implements OnInit {

  cart$: Observable<CartLine[]>;
  stockChecked$: Observable<boolean>;
  order = {} as Order;
  total$: Observable<number>;
  userId: string;
  dialogRef: MatDialogRef<AddressWrapperComponent, any>;

  @ViewChild(CartComponent) cartComponent: CartComponent;

  constructor(
    private store$: Store,
    private dialog: MatDialog,
    private http: HttpClient,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {

    this.cart$ = this.store$.select(selectCartListState);
    this.stockChecked$ = this.store$.select(selectCartStockChecked);
    this.total$ = this.store$.select(selectTotalCartListState);
    this.store$.select(selectUserProfile).subscribe(res => {
      this.order.user = res;
      this.order.status = OrderStatus.Pending;
    });
  }

  removeCart($event: CartLine) {
    this.store$.dispatch(cartRemove({payload: {cart: $event}}));
  }

  updateCart($event: { quantity: number; cartLine: CartLine }) {
    this.store$.dispatch(cartCheckStock({payload: {cart: $event.cartLine, quantity: $event.quantity}}));
    this.store$.select(selectCartlineById, {id: $event.cartLine.id}).pipe(take(2)).subscribe(res => {
      if (res.isStock !== null ) {
        if (res.isStock) {
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
    });
  }

  shippingAddress() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '90vw';
    dialogConfig.maxWidth = '600px';
    dialogConfig.disableClose = true;

    this.dialogRef = this.dialog.open(AddressWrapperComponent, dialogConfig );
    this.dialogRef.afterClosed().subscribe(res => {
      if (res && res.next) {
        this.cartComponent.next();
        this.order.shippingAddress = res.address;
        this.order.date = new Date();
      } else {
          this.cartComponent.back();
      }
    });
  }

  pay() {
    this.createOrderContent();
    this.store$.dispatch(stripeGetCheckout({payload: {order: this.order}}));

  }

  private createOrderContent() {
    this.order.orderLines = [];
    this.cart$.pipe(take(1)).subscribe(async res => {
      for (const line of res) {
        const orderLine = {} as OrderLine;
        orderLine.id = line.id;
        orderLine.product = line.product;
        orderLine.quantity = line.quantity;
        orderLine.price = line.price;
        this.order.orderLines.push(orderLine);


      }
    })
  }

  createOrder() {
    this.createOrderContent();
    this.store$.dispatch(orderCreate({payload: {order: this.order}}));
  }

  stockChecked($event: boolean) {
    this.store$.dispatch(cartStockChecked({payload: {stockChecked: $event}}));
  }
}
