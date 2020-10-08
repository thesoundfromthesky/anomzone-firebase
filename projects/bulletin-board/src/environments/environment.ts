import { Environment } from './environment.models';
import { menus } from './menus';
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: Environment = {
  production: false,
  configPath: 'config/config.dev.json',
  firebase: {
    apiKey: 'AIzaSyBmDXSzTRQs-OmSzuvsmQXO3cEPBTDWkIs',
    authDomain: 'anomzone-staging.firebaseapp.com',
    projectId: 'anomzone-staging',
  },
  firestore: { host: 'localhost:8080', ssl: false },
  functions: 'http://localhost:5001',
  menus,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
