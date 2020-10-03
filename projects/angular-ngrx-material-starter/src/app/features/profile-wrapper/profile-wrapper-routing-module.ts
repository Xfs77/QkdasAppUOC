import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileWrapperComponent } from './profile-wrapper.component';
import { UserFormWrapperComponent } from './user-form-wrapper/user-form-wrapper.component';
import { AddressFormWrapperComponent } from './address-form-wrapper/address-form-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileWrapperComponent,
    data:  {title: 'anms.menu.profile'},
    pathMatch: 'full'
  },
  {
    path: 'edit',
    component: UserFormWrapperComponent
  },
  {
    path: 'address/edit',
    data: {title: 'Formulario Usuario'},
    component: AddressFormWrapperComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileWrapperRoutingModule {}
