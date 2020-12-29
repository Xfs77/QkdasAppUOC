import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginWrapperComponent } from './login-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: LoginWrapperComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginWrapperRoutingModule {}
