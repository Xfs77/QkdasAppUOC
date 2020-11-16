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
import { catchError, map, take } from 'rxjs/operators';
import { NotificationService } from '../../core/notifications/notification.service';
import { AddressWrapperComponent } from './address-wrapper/address-wrapper.component';
import { CartComponent } from './cart/cart.component';
import { selectUserId } from '../../core/user/user.selectors';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { loadingEnd, loadingStart } from '../../core/general/general.action';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'anms-cart-wrapper',
  templateUrl: './cart-wrapper.component.html',
  styleUrls: ['./cart-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartWrapperComponent implements OnInit {

  cart$: Observable<CartLine[]>;
  total$: Observable<number>;
  userId: string
  dialogRef: MatDialogRef<AddressWrapperComponent, any>;

  @ViewChild(CartComponent) cartComponent: CartComponent;

  constructor(
    private store$: Store,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.cart$ = this.store$.select(selectCartListState);
    this.total$ = this.store$.select(selectTotalCartListState);
    this.store$.select(selectUserId).pipe(take(1)).subscribe(res => {
      this.userId = res;
    })
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

    this.dialogRef = this.dialog.open(AddressWrapperComponent, dialogConfig );
    this.dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (res && res.next) {
        this.cartComponent.next();
      } else {
        this.cartComponent.back();
      }
    });
  }

  pay() {
    this.store$.dispatch(loadingStart());
    const header = new HttpHeaders({'Content-Type':  'application/json'});
    this.http.post<any>('https://us-central1-qkdasartuoc.cloudfunctions.net/checkout', {userId: this.userId}, { headers: header}).pipe(
      map( session => {
        return Stripe(environment.pkStripeTest).redirectToCheckout({ sessionId: session.id });
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
}
