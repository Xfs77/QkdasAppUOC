import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../../shared/shared.module';
import { LoginWrapperRoutingModule } from './login-wrapper-routing.module';
import { LoginWrapperComponent } from './login-wrapper.component';



@NgModule({
  declarations: [LoginComponent, LoginWrapperComponent],
  imports: [
    SharedModule,
    LoginWrapperRoutingModule
  ]
})
export class LoginWrapperModule { }
