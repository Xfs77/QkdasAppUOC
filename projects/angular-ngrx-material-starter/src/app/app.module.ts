import { NgModule } from '@angular/core';
import { AuthGuardService, CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { SharedModule } from './shared/shared.module';
import { AdminGuardService } from './core/auth/admin-guard.service';

@NgModule({
  imports: [
    // core
    CoreModule,
    // shared
    SharedModule,
    // app
    AppRoutingModule,
  ],
  declarations: [AppComponent ],
  bootstrap: [AppComponent],
  providers: [AuthGuardService, AdminGuardService]
})
export class AppModule {}
