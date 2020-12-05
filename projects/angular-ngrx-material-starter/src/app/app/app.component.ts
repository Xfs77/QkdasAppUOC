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
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoginWrapperComponent } from '../features/login-wrapper/login-wrapper.component';
import { selectLoading } from '../core/general/general.selectors';
import { AgrupationsComponent } from '../features/agrupations-wrapper/agrupations/agrupations.component';
import { loadingEnd } from '../core/general/general.action';
import { currentSelectedAgrupation } from '../core/agrupation/agrupation.action';
import { selectCartListState } from '../core/cart/cart.selectors';
import { AppSettings } from './app.settings';
import { User } from '../core/user/user.models';
import { selectUserProfile } from '../core/user/user.selectors';
import { filter } from 'rxjs/operators';

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
    { link: 'catalogue', label: 'Catálogo'  },
    { link: 'start', label: 'Inicio' },

  ];

  navigationSideMenuAdmin = [
    { link: 'agrupations', label: 'Agrupaciones' , icon: 'view_list'},
    { link: 'products', label: 'Productos', icon: 'reorder' }
  ];

  navigationSideMenuLogged = [
    { link: 'cart', label: 'Cesta' , icon: 'shopping_cart'},
    { link: 'orders', label: 'Pedidos', icon: 'receipt' },
    { link: 'profile', label: 'Perfil Usuario', icon: 'person' },
    { link: '', label: 'Desconectar', icon: 'logout', action: 'onLogout()' },

  ];

  navigationSideMenuVisitor = [
    { link: 'start', label: 'Inicio', icon: 'home' },
    { link: 'catalogue', label: 'Catálogo', icon: 'menu_book'},
    { link: 'profile', label: 'Entrar', icon: 'login', action: 'onLogin()' },
  ];

  navigationSideMenu = [];

  dialogRefAgrup: MatDialogRef<AgrupationsComponent, any>;
  dialogRef: MatDialogRef<LoginWrapperComponent, any>;
  isAuthenticated$: Observable<boolean>;
  userProfile$: Observable<User>;
  stickyHeader$: Observable<boolean>;
  language$: Observable<string>;
  theme$: Observable<string>;
  loading$: Observable<boolean>;

  cartSize;
  filter = false;

  constructor(
    private store: Store,
    private storageService: LocalStorageService,
    private lss: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }

  ngOnInit(): void {
    this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd )).subscribe(event => {
      if (window.innerWidth < 960 &&
        (event.url === '/catalogue' || event.url.startsWith( '/products' ))) {
        this.filter = true;
      } else {
        this.filter = false;
      }
    });

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
    this.userProfile$ = this.store.select(selectUserProfile);
    this.userProfile$.subscribe(user => {
      this.navigationSideMenu = [];
      if (user && user.admin) {
        this.navigationSideMenu = [
          ...this.navigationSideMenuAdmin
        ]
      }
      this.navigationSideMenu = [
          ...this.navigationSideMenu,
          ...this.navigationSideMenuVisitor
        ]
      if (user.id) {
        this.navigationSideMenu = [
          ...this.navigationSideMenu,
          ...this.navigationSideMenuLogged]
      }
    });
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
    const dialogConfig = new MatDialogConfig();

    if (window.innerWidth < 960) {
      dialogConfig.autoFocus = true;
      dialogConfig.closeOnNavigation = true;
      dialogConfig.width = '90vw';
      dialogConfig.maxWidth = '500px';
      dialogConfig.height = 'calc(100vh - 64px - 105px - 32px)';
      dialogConfig.position = { top: '80px' }
    }
    if (window.innerWidth <= 600) {
      dialogConfig.height = 'calc(100vh - 56px - 105px - 32px)';
      dialogConfig.position = { top: '70px' }
    }
      this.dialogRefAgrup = this.dialog.open(AgrupationsComponent, dialogConfig );
      this.dialogRefAgrup.afterClosed().subscribe(res => {
        this.store.dispatch(currentSelectedAgrupation({payload: {agrupation: res}}))
      });
    }
}
