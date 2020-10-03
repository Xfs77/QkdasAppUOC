import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { SharedModule } from './shared/shared.module';
import { ProfileWrapperComponent } from './features/profile-wrapper/profile-wrapper.component';

@NgModule({
  imports: [
    // core
    CoreModule,
    // shared
    SharedModule,
    // app
    AppRoutingModule
  ],
  declarations: [AppComponent, ProfileWrapperComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
