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
  selectEffectiveTheme
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
  navigation = [
    { link: 'about', label: 'anms.menu.about' },
  ];
  navigationSideMenu = [
    ...this.navigation,
    { link: 'agrupations', label: 'Agrupaciones' },
    { link: 'settings', label: 'anms.menu.settings' }
  ];
  dialogRef: MatDialogRef<LoginWrapperComponent, any>;
  isAuthenticated$: Observable<boolean>;
  stickyHeader$: Observable<boolean>;
  language$: Observable<string>;
  theme$: Observable<string>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store,
    private storageService: LocalStorageService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }

  ngOnInit(): void {
    this.store.dispatch(loadingEnd());
    this.store.dispatch(actionSettingsChangeLanguage({ language: 'es' }));
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
}
