import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgrupationsWrapperComponent } from './agrupations-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: AgrupationsWrapperComponent,
    data:  {title: 'anms.menu.agrupations'},
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgrupationsWrapperRoutingModule {}
