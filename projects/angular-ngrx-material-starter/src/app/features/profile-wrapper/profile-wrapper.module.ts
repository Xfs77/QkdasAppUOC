import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProfileWrapperRoutingModule } from './profile-wrapper-routing.module';
import { UserFormWrapperComponent } from './user-form-wrapper/user-form-wrapper.component';
import { UserFormComponent } from './user-form-wrapper/user-form/user-form.component';
import { AddressFormWrapperComponent } from './address-form-wrapper/address-form-wrapper.component';
import { AddressFormComponent } from './address-form-wrapper/address-form/address-form.component';



@NgModule({
  declarations: [UserFormWrapperComponent, UserFormComponent, AddressFormWrapperComponent, AddressFormComponent],
  imports: [
    SharedModule,
    ProfileWrapperRoutingModule
  ]
})
export class ProfileWrapperModule { }
