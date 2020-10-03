import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  Input,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {v1 as uuidv1} from 'uuid';
import { Address } from '../../../../core/user/user.models';

@Component({
  selector: 'anms-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressFormComponent implements OnInit {

  @Input() addressEntity: Address;
  @Output() saveAddressEvent: EventEmitter<{address: Address, edit: boolean}> = new EventEmitter();
  @Output() cancelAddressEvent: EventEmitter<boolean> = new EventEmitter();

  addressForm: FormGroup;
  private edit = true;

  validationMessages = {
    name: [
      { type: 'required', message: 'El nombre debe informarse' }
    ],
    surname: [
      { type: 'required', message: 'Los apellidos deben informarse' }
    ],
    phone: [
      { type: 'required', message: 'La dirección debe informarse' }
    ],
    address: [
      { type: 'required', message: 'La dirección debe informarse' }
    ],
    city: [
      { type: 'required', message: 'La población debe informarse' }
    ],
    CP: [
      { type: 'required', message: 'El código postal debe informarse' }
    ],
    country: [
      { type: 'required', message: 'El país debe informarse' }
    ],
  };

  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.addressForm = this.fb.group({
      name: [this.addressEntity.name, [Validators.required]],
      surname: [this.addressEntity.surname, [Validators.required]],
      phone: [this.addressEntity.phone1, [Validators.required]],
      address: [this.addressEntity.address, [Validators.required]],
      city: [this.addressEntity.city, [Validators.required]],
      CP: [this.addressEntity.CP, [Validators.required]],
      country: ['España', [Validators.required]],
    });
  }

  get name() {
    return this.addressForm.get('name') ;
  }

  get surname() {
    return this.addressForm.get('surname') ;
  }

  get phone() {
    return this.addressForm.get('phone') ;
  }

  get address() {
    return this.addressForm.get('address') ;
  }

  get city() {
    return this.addressForm.get('city') ;
  }

  get CP() {
    return this.addressForm.get('CP') ;
  }

  get country() {
    return this.addressForm.get('country') ;
  }

  onSave() {
    this.saveAddressEvent.emit({address: this.getFormData(), edit: this.edit});
  }

  onCancel() {
    this.cancelAddressEvent.emit(true);
  }

  getFormData() {
    if (!this.addressEntity.id) {
      this.edit = false;
      this.addressEntity.id = uuidv1();
    }
    const address = {
      ...this.addressEntity,
      name: this.name.value,
      surname: this.surname.value,
      phone: this.phone.value,
      address: this.address.value,
      city: this.city.value,
      CP: this.CP.value,
      country: this.country.value};
    return address;
  }

}
