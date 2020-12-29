import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter, OnDestroy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Address } from '../../../../core/user/user.models';
import { MatRadioChange } from '@angular/material/radio';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'anms-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressComponent implements OnInit, OnDestroy {

  @Input() currentAddress$: Observable<Address>;
  @Input() address$: Observable<Address[]>
  @Output() selectedAddressEvent: EventEmitter<Address> = new EventEmitter<Address>() ;
  @Output() confirmEvent: EventEmitter<Address> = new EventEmitter<Address>() ;
  @Output() cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>() ;

  private onDestroy = new Subject();
  currentSelectedAddress: Address;
  confirmedAddress: Address;
  showAddresses = false;

  constructor() { }

  ngOnInit(): void {
    this.currentAddress$.pipe(take(1)).pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.confirmedAddress = res;
    })
  }

  updateSelectedAddress($event: MatRadioChange) {
    this.currentSelectedAddress = $event.value;
  }

  selectAddress() {
    this.showAddresses = false;
    if (this.currentSelectedAddress) {
      this.confirmedAddress = this.currentSelectedAddress;
    }
    this.selectedAddressEvent.emit(this.confirmedAddress);
  }

  changeAddress() {
    this.showAddresses = true;
  }

  cancelSelectAddress() {
    this.showAddresses = false;
  }

  cancel() {
    this.cancelEvent.emit(true);
  }

  confirm() {
    this.confirmEvent.emit(this.confirmedAddress);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
