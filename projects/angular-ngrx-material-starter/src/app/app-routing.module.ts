import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full'
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./features/about/about.module').then((m) => m.AboutModule)
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./features/profile-wrapper/profile-wrapper.module').then((m) => m.ProfileWrapperModule)
  },
  {
    path: 'agrupations',
    loadChildren: () =>
      import('./features/agrupations-wrapper/agrupations-wrapper.module').then((m) => m.AgrupationsWrapperModule)
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/product-list-wrapper/product-list-wrapper.module').then((m) => m.ProductListWrapperModule)
  },
  {
    path: 'catalogue',
    loadChildren: () =>
      import('./features/catalogue-wrapper/catalogue-wrapper.module').then((m) => m.CatalogueWrapperModule)
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./features/cart-wrapper/cart-wrapper.module').then((m) => m.CartWrapperModule)
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./features/order-list-wrapper/order-list-wrapper.module').then((m) => m.OrderListWrapperModule)
  },
  {
    path: 'feature-list',
    loadChildren: () =>
      import('./features/feature-list/feature-list.module').then(
        (m) => m.FeatureListModule
      )
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./features/settings/settings.module').then(
        (m) => m.SettingsModule
      )
  },
  {
    path: 'examples',
    loadChildren: () =>
      import('./features/examples/examples.module').then(
        (m) => m.ExamplesModule
      )
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/login-wrapper/login-wrapper.module').then(
        (m) => m.LoginWrapperModule
      )
  },
  {
    path: '**',
    redirectTo: 'about'
  }
];

@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
