import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProfileWrapperRoutingModule } from './profile-wrapper-routing.module';
import { UserFormWrapperComponent } from './user-form-wrapper/user-form-wrapper.component';
import { UserFormComponent } from './user-form-wrapper/user-form/user-form.component';
import { AddressFormWrapperComponent } from './address-form-wrapper/address-form-wrapper.component';
import { AddressFormComponent } from './address-form-wrapper/address-form/address-form.component';
import { PasswordFormWrapperComponent } from './password-form-wrapper/password-form-wrapper.component';
import { PasswordFormComponent } from './password-form-wrapper/password-form/password-form.component';
import { ProfileWrapperComponent } from './profile-wrapper.component';



@NgModule({
  declarations: [ProfileWrapperComponent, UserFormWrapperComponent, UserFormComponent, AddressFormWrapperComponent, AddressFormComponent, PasswordFormWrapperComponent, PasswordFormComponent],
  imports: [
    SharedModule,
    ProfileWrapperRoutingModule
  ]
})
export class ProfileWrapperModule { }
