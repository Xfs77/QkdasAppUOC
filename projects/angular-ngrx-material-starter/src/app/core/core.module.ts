import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
  StoreRouterConnectingModule,
  RouterStateSerializer
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  FaIconLibrary,
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { environment } from '../../environments/environment';

import {
  AppState,
  reducers,
 // metaReducers,
  selectRouterState
} from './core.state';
import { AuthEffects } from './auth/auth.effects';
import { selectIsAuthenticated, selectAuth } from './auth/auth.selectors';
import { authLogin, authLogout } from './auth/auth.actions';
import { AuthGuardService } from './auth/auth-guard.service';
import { TitleService } from './title/title.service';
import {
  ROUTE_ANIMATIONS_ELEMENTS,
  routeAnimations
} from './animations/route.animations';
import { AnimationsService } from './animations/animations.service';
import { CustomSerializer } from './router/custom-serializer';
import { LocalStorageService } from './local-storage/local-storage.service';
import { GoogleAnalyticsEffects } from './google-analytics/google-analytics.effects';
import { NotificationService } from './notifications/notification.service';
import { SettingsEffects } from './settings/settings.effects';
import {
  selectSettingsLanguage,
  selectEffectiveTheme,
  selectSettingsStickyHeader
} from './settings/settings.selectors';
import { MatButtonModule } from '@angular/material/button';
import {
  faCog,
  faBars,
  faRocket,
  faPowerOff,
  faUserCircle,
  faPlayCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faMediumM,
  faTwitter,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import { AngularFireModule } from '@angular/fire';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';
import { UserEffects } from './user/user.effects';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { AgrupationEffects } from './agrupation/agrupation.effects';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProductFormEffects } from './product-form/product-form.effects';
import { ProductListEffects } from './product-list/product-list.effects';
import { ProductsFilterEffects } from './products-filter/products-filter.effects';
import { CartEffects } from './cart/cart.effects';

export {
  TitleService,
  selectAuth,
  authLogin,
  authLogout,
  routeAnimations,
  AppState,
  LocalStorageService,
  selectIsAuthenticated,
  ROUTE_ANIMATIONS_ELEMENTS,
  AnimationsService,
  AuthGuardService,
  selectRouterState,
  NotificationService,
  selectEffectiveTheme,
  selectSettingsLanguage,
  selectSettingsStickyHeader
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}

@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    BrowserModule,

    // material
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,
    MatProgressBarModule,

    // ngrx
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: false,
      },
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([
      AgrupationEffects,
      AuthEffects,
      UserEffects,
      ProductFormEffects,
      ProductListEffects,
      ProductsFilterEffects,
      CartEffects,
      SettingsEffects,
      GoogleAnalyticsEffects
    ]),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
          name: 'Angular NgRx Material Starter'
        }),

    // Firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),

    // 3rd party
    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [],
  providers: [
   /* { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: AppErrorHandler },*/
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ],
  exports: [
    // angular
    FormsModule,

    // material
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,
    MatProgressBarModule,

    // 3rd party
    FontAwesomeModule,
    TranslateModule
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    faIconLibrary: FaIconLibrary
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
    faIconLibrary.addIcons(
      faCog,
      faUser,
      faSignInAlt,
      faSignOutAlt,
      faBars,
      faRocket,
      faPowerOff,
      faUserCircle,
      faPlayCircle,
      faGithub,
      faMediumM,
      faTwitter,
      faFacebook,
      faInstagram,
      faYoutube
    );
  }
}
