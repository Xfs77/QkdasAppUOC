import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartLine } from '../../core/cart/cart.models';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {
  selectCartlineById,
  selectCartListState,
  selectTotalCartListState
} from '../../core/cart/cart.selectors';
import { cartCheckStock, cartRemove, cartUpdate } from '../../core/cart/cart.action';
import { catchError, filter, map, take } from 'rxjs/operators';
import { NotificationService } from '../../core/notifications/notification.service';
import { AddressWrapperComponent } from './address-wrapper/address-wrapper.component';
import { CartComponent } from './cart/cart.component';
import { selectUserId, selectUserProfile } from '../../core/user/user.selectors';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { loadingEnd, loadingStart } from '../../core/general/general.action';
import { environment } from '../../../environments/environment';
import { CartService } from '../../core/cart/cart.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../core/user/user.models';
import { orderCreate } from '../../core/order/order.action';
import { Order, OrderLine } from '../../core/order/order.models';
import { selectProductListState } from '../../core/core.state';

@Component({
  selector: 'anms-cart-wrapper',
  templateUrl: './cart-wrapper.component.html',
  styleUrls: ['./cart-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartWrapperComponent implements OnInit {

  cart$: Observable<CartLine[]>;
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
    this.route.params.subscribe(res => {
      console.log(res.checkout);
    })

    this.cart$ = this.store$.select(selectCartListState);
    this.total$ = this.store$.select(selectTotalCartListState);
    this.store$.select(selectUserProfile).subscribe(res => {
      this.order.user = res;
    });
  }

  removeCart($event: CartLine) {
    this.store$.dispatch(cartRemove({payload: {cart: $event}}));
  }

  updateCart($event: { quantity: number; cartLine: CartLine }) {
    this.store$.dispatch(cartCheckStock({payload: {cart: $event.cartLine, quantity: $event.quantity}}));
    this.store$.select(selectCartlineById, {id: $event.cartLine.id}).pipe(take(2)).subscribe(res => {
      if (res.isStock !== null ) {
        if (!res.isStock) {
          this.notificationService.error(`No hay suficiente stock del producto ${$event.cartLine.product.reference}`)
        } else {
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
    dialogConfig.maxWidth = '500px';
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

    this.store$.dispatch(loadingStart());
        const header = new HttpHeaders({'Content-Type':  'application/json'});
        this.http.post<any>('https://us-central1-qkdasartuoc.cloudfunctions.net/checkout', {userId: this.order.user.id}, { headers: header}).pipe(
          map( session => {
            this.order.checkout = session.id;
            this.store$.dispatch(orderCreate({payload: {order: this.order}}));
          //  return Stripe(environment.pkStripeTest).redirectToCheckout({ sessionId: session.id });
          }),
          catchError(error => {
            this.store$.dispatch(loadingEnd());
            return of(error);
          } ))
          .subscribe(result => {
            this.store$.dispatch(loadingEnd());
            if (result.error) {
              this.notificationService.error('No se ha podido un error al efectuar el pago')
            }
          });
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
}
