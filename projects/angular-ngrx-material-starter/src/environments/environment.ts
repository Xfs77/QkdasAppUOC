// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const packageJson = require('../../../../package.json');

export const environment = {
  appName: 'QkdasArtApp',
  envName: 'DEV',
  production: false,
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
    fontAwesome: packageJson.dependencies['@fortawesome/fontawesome-free'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    typescript: packageJson.devDependencies['typescript'],
    cypress: packageJson.devDependencies['cypress']
  },
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
