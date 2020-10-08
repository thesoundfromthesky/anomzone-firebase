import { Environment } from './environment.models';
import { menus } from './menus';

export const environment: Environment = {
  production: true,
  configPath: 'config/config.staging.json',
  firebase: {
    apiKey: 'AIzaSyBmDXSzTRQs-OmSzuvsmQXO3cEPBTDWkIs',
    authDomain: 'anomzone-staging.firebaseapp.com',
    databaseURL: 'https://anomzone-staging.firebaseio.com',
    projectId: 'anomzone-staging',
    storageBucket: 'anomzone-staging.appspot.com',
    messagingSenderId: '991797979503',
    appId: '1:991797979503:web:d2837a2b684e682dbf209a',
  },
  firestore: {},
  functions: undefined,
  menus,
};
