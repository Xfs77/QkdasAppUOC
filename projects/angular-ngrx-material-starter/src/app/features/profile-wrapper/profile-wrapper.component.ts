import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Address, User } from '../../core/user/user.models';
import { Store } from '@ngrx/store';
import { selectAddressProfile, selectUserProfile } from '../../core/user/user.selectors';
import { take } from 'rxjs/operators';
import { MatRadioChange } from '@angular/material/radio';
import { userAddressDefault, userAddressRemove } from '../../core/user/user.actions';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { PasswordFormWrapperComponent } from './password-form-wrapper/password-form-wrapper.component';

@Component({
  selector: 'anms-profile-wrapper',
  templateUrl: './profile-wrapper.component.html',
  styleUrls: ['./profile-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileWrapperComponent implements OnInit {

  user$: Observable<User>;
  address$: Observable<Address[]>;
  dialogRef: MatDialogRef<PasswordFormWrapperComponent, any>;

  constructor(
    private store$: Store,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.user$ = this.store$.select(selectUserProfile);
    this.address$ = this.store$.select(selectAddressProfile);
  }

  removeAddress(address: Address) {
    if (!address.default) {
      this.store$.select(selectUserProfile).pipe(take(1)).subscribe(res => {
        this.store$.dispatch(userAddressRemove({payload: {user: res, address}}));
      });
    }
  }

  updateDefaultAddress($event: MatRadioChange) {
    this.store$.select(selectUserProfile).pipe(take(1)).subscribe(res => {
      this.store$.dispatch(userAddressDefault({payload: {user: res, default: $event.value}}));
    });
  }

  onChangePassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '90vw';
    dialogConfig.maxWidth = '350px';

    this.dialogRef = this.dialog.open(PasswordFormWrapperComponent, dialogConfig );

  }
}
