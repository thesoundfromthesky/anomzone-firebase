import { Environment } from './environment.models';
import { menus } from './menus';

export const environment: Environment = {
  production: true,
  configPath: 'config/config.prod.json',
  firebase: {
    apiKey: 'AIzaSyA1SsGDupoFTxzrCl-QzzUGVQyvV6iKOto',
    authDomain: 'anomzone-dev.firebaseapp.com',
    databaseURL: 'https://anomzone-dev.firebaseio.com',
    projectId: 'anomzone-dev',
    storageBucket: 'anomzone-dev.appspot.com',
    messagingSenderId: '1010974722465',
    appId: '1:1010974722465:web:bca5d2fe218818649663e0',
  },
  firestore: {},
  functions: undefined,
  menus,
};
