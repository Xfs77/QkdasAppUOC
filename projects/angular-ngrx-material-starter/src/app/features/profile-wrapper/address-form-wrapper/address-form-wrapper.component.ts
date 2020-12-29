import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Address, User } from '../../../core/user/user.models';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import {
  selectAddressProfile,
  selectAddressProfileById,
  selectUserProfile
} from '../../../core/user/user.selectors';
import { take, withLatestFrom } from 'rxjs/operators';
import { userAddressUpdate } from '../../../core/user/user.actions';

@Component({
  selector: 'anms-address-form-wrapper',
  templateUrl: './address-form-wrapper.component.html',
  styleUrls: ['./address-form-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressFormWrapperComponent implements OnInit, OnDestroy {

  @Input() user$: Observable<User>;
  address: Address;

  private address$: Observable<Address>;
  private onDestroy = new Subject();

  constructor(
    private store$: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.user$ = this.store$.select(selectUserProfile);
    this.route.params.subscribe(params => {
      const addressId = params.address;
      if (addressId) {
        this.address$ = this.store$.select(selectAddressProfileById, {id: addressId});
        this.address$.pipe(take(1)).subscribe(res => {
          this.address = res;
        });
      } else {
        this.address = {} as Address;
      }
    });
  }

  onSave(address: {address: Address, edit: boolean}) {
    this.user$.pipe(withLatestFrom(this.store$.select(selectAddressProfile))).subscribe(res => {
      const user = res[0];
      const addresses = res[1];
      let tmp = {...address,
        user};
      if (addresses.length === 0) {
        tmp = {...tmp,
          address: {...tmp.address,
            default: true}
        };
      }
      this.store$.dispatch(userAddressUpdate({payload: tmp}));
    });
  }

  onCancel() {
    this.router.navigate(['/profile']);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
