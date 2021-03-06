import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Optional,
  Inject,
  OnDestroy
} from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAddressProfile, selectDefaultAddress } from '../../../core/user/user.selectors';
import { Address } from '../../../core/user/user.models';
import { take, takeUntil } from 'rxjs/operators';
import { cartSetAddress } from '../../../core/cart/cart.action';
import { Observable, Subject } from 'rxjs';
import { selectCartAddress } from '../../../core/cart/cart.selectors';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'anms-address-wrapper',
  templateUrl: './address-wrapper.component.html',
  styleUrls: ['./address-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressWrapperComponent implements OnInit, OnDestroy {

  currentAddress$: Observable<Address>;
  address$: Observable<Address[]>;
  next = false;
  currentAddress: Address;
  private onDestroy = new Subject();

  constructor(
    private store$: Store,
    private dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<AddressWrapperComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data
  ) {
  }

  ngOnInit(): void {
    this.store$.select(selectDefaultAddress).pipe(take(1)).pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.store$.dispatch(cartSetAddress({ payload: { address: res } }))
    });

    this.currentAddress$ = this.store$.select(selectCartAddress);
    this.currentAddress$.pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.currentAddress = res;
    });
    this.address$ = this.store$.select(selectAddressProfile);
  }

  setAddress($event: Address) {
    this.store$.dispatch(cartSetAddress({payload: {address: $event}}));
    this.next = true;
    this.dialogRef.close({next: this.next, address: this.currentAddress});
  }

  cancel() {
    this.store$.dispatch(cartSetAddress({payload: {address: null}}));
    this.dialogRef.close({next: this.next});
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
