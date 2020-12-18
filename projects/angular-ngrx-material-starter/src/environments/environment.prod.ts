const packageJson = require('../../../../package.json');

export const environment = {
  appName: 'Qkdas Art',
  envName: 'PROD',
  criptoKey: 'ashdafdfjk22323jadsad',
  production: true,
  test: false,
  i18nPrefix: '',
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
    ngrx: packageJson.dependencies['@ngrx/store'],
    material: packageJson.dependencies['@angular/material'],
    bootstrap: packageJson.dependencies.bootstrap,
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
    fontAwesome:
      packageJson.dependencies['@fortawesome/fontawesome-free-webfonts'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    typescript: packageJson.devDependencies['typescript'],
    cypress: packageJson.devDependencies['cypress']
  },
  pkStripeTest: 'pk_test_51HnPcFIjHFJYs4LUjgsSfS4xIcGucoSeYjopLOLcmgaGw0R5JQE29ZGvCy8RCKGUSGtp50TCgdMesZpR1uglP7nk008VmSSMxk',
  stripeCheckout: 'https://us-central1-qkdasartuoc.cloudfunctions.net/checkout',
  appDomain: 'https://qkdasartuoc.web.app/',
  firebaseConfig: {
    apiKey: 'AIzaSyAgvA8lyIGILOZwn5yZr6MyenTgqIDdRiY',
    authDomain: 'qkdasartuoc.firebaseapp.com',
    databaseURL: 'https://qkdasartuoc.firebaseio.com',
    projectId: 'qkdasartuoc',
    storageBucket: 'qkdasartuoc.appspot.com',
    messagingSenderId: '429277145752',
    appId: '1:429277145752:web:2a5394022eeb27ebeabeed',
    measurementId: 'G-0L6GZKF89N'
  }
};

