import { NgModule } from '@angular/core';
import { AgrupationsWrapperRoutingModule } from './agrupations-wrapper-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AgrupationsWrapperComponent } from './agrupations-wrapper.component';
import { AgrupationsComponent } from './agrupations/agrupations.component';



@NgModule({
  declarations: [AgrupationsWrapperComponent, AgrupationsComponent],
  exports: [
    AgrupationsComponent
  ],
  imports: [
    SharedModule,
    AgrupationsWrapperRoutingModule
  ]
})
export class AgrupationsWrapperModule { }
