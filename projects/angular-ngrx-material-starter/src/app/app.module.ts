import { LOCALE_ID, NgModule } from '@angular/core';
import { AuthGuardService, CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { SharedModule } from './shared/shared.module';
import { AdminGuardService } from './core/auth/admin-guard.service';
import localeEs from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
registerLocaleData(localeEs, 'es');

@NgModule({
  imports: [
    // core
    CoreModule,
    // shared
    SharedModule,
    // app
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  declarations: [AppComponent ],
  bootstrap: [AppComponent],
  providers: [
    AuthGuardService,
    AdminGuardService,
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class AppModule {}
