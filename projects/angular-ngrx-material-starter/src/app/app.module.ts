import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { SharedModule } from './shared/shared.module';
import { CatalogueWrapperComponent } from './features/catalogue-wrapper/catalogue-wrapper.component';

@NgModule({
  imports: [
    // core
    CoreModule,
    // shared
    SharedModule,
    // app
    AppRoutingModule
  ],
  declarations: [AppComponent, CatalogueWrapperComponent ],
  bootstrap: [AppComponent]
})
export class AppModule {}
