import browser from 'browser-detect';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import {
  authLogout,
  routeAnimations,
  LocalStorageService,
  selectIsAuthenticated,
  selectSettingsStickyHeader,
  selectSettingsLanguage,
  selectEffectiveTheme, authLogin
} from '../core/core.module';
import {
  actionSettingsChangeAnimationsPageDisabled, actionSettingsChangeLanguage
} from '../core/settings/settings.actions';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoginWrapperComponent } from '../features/login-wrapper/login-wrapper.component';
import { selectLoading } from '../core/general/general.selectors';
import { AgrupationsComponent } from '../features/agrupations-wrapper/agrupations/agrupations.component';
import { loadingEnd } from '../core/general/general.action';
import { currentSelectedAgrupation } from '../core/agrupation/agrupation.action';
import { selectCartListState } from '../core/cart/cart.selectors';
import { AUTH_KEY } from '../core/auth/auth.effects';
import { AppSettings } from './app.settings';

@Component({
  selector: 'anms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit {
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = require('../../assets/logo.png').default;
  logoBlack = require('../../assets/logo_black.png').default;
  navigation = [
    { link: 'about', label: 'anms.menu.about' },
  ];
  navigationSideMenu = [
    ...this.navigation,
    { link: 'agrupations', label: 'Agrupaciones' },
    { link: 'products', label: 'Productos' },
    { link: 'catalogue', label: 'Catálogo'},
    { link: 'orders', label: 'Pedidos' },
    { link: 'settings', label: 'anms.menu.settings' }
  ];

  dialogRefAgrup: MatDialogRef<AgrupationsComponent, any>;
  dialogRef: MatDialogRef<LoginWrapperComponent, any>;
  isAuthenticated$: Observable<boolean>;
  stickyHeader$: Observable<boolean>;
  language$: Observable<string>;
  theme$: Observable<string>;
  loading$: Observable<boolean>;

  cartSize;

  constructor(
    private store: Store,
    private storageService: LocalStorageService,
    private lss: LocalStorageService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }

  ngOnInit(): void {
    try {
      const tmp = this.lss.getItem(AppSettings.USER_KEY);
      this.store.dispatch(authLogin({payload: {email: tmp.email, password: tmp.password}}));
    } catch (e) {
    }
    this.store.dispatch(loadingEnd());
    this.store.dispatch(actionSettingsChangeLanguage({ language: 'es' }));
    this.cartSize = this.store.select(selectCartListState);

    this.storageService.testLocalStorage();
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.store.dispatch(
        actionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true
        })
      );
    }

    this.loading$ = this.store.select(selectLoading);
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    this.stickyHeader$ = this.store.pipe(select(selectSettingsStickyHeader));
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.theme$ = this.store.pipe(select(selectEffectiveTheme));
  }

  onLogin() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '90vw';
    dialogConfig.maxWidth = '500px';

    this.dialogRef = this.dialog.open(LoginWrapperComponent, dialogConfig );

  }

  onLogout() {
    this.store.dispatch(authLogout());
  }

  onAgrupations() {
    if (window.innerWidth < 960) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.closeOnNavigation = true;
      dialogConfig.width = '90vw';
      dialogConfig.maxWidth = '500px';
      dialogConfig.position = {top: '74px'}

      this.dialogRefAgrup = this.dialog.open(AgrupationsComponent, dialogConfig );
      this.dialogRefAgrup.afterClosed().subscribe(res => {
        this.store.dispatch(currentSelectedAgrupation({payload: {agrupation: res}}))
      });
    }

  }
}
