import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsContainerComponent } from './settings/settings-container.component';

@NgModule({
  declarations: [SettingsContainerComponent],
  imports: [SharedModule, SettingsRoutingModule]
})
export class SettingsModule {}
